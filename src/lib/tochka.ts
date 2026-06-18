/**
 * Tochka Bank Acquiring API
 * Docs: https://developers.tochka.com/docs/tochka-api/api/rabota-s-platyozhnymi-ssylkami
 *
 * Env vars needed in .env.local:
 *   TOCHKA_JWT            — JWT-токен из ЛК банка (Интеграции → Сгенерировать JWT)
 *   TOCHKA_CUSTOMER_CODE  — Код компании (customerType: Business, 9 цифр)
 *   TOCHKA_MERCHANT_ID    — ID торговой точки (15 цифр, из метода Get Retailers)
 *   NEXT_PUBLIC_SITE_URL  — https://recycleobject.ru (для redirect URLs)
 *
 * Sandbox: TOCHKA_JWT=sandbox.jwt.token, TOCHKA_CUSTOMER_CODE=any
 */

const PROD_BASE = 'https://enter.tochka.com/uapi';
const SAND_BASE = 'https://enter.tochka.com/sandbox/v2';
const MAX_PURPOSE_LENGTH = 140;

function baseUrl() {
  return process.env.TOCHKA_JWT === 'sandbox.jwt.token' ? SAND_BASE : PROD_BASE;
}

function receiptPhone(phone?: string | null) {
  if (!phone) return undefined;
  const normalized = phone.replace(/[^\d+]/g, '');
  return /^\+?\d{11,15}$/.test(normalized) ? normalized : undefined;
}

function isNotImplementedReceiptError(status: number, bodyText: string) {
  if (status !== 501) return false;
  return /HTTPNotImplemented|Not Implemented|not implemented/i.test(bodyText);
}

function paymentPurpose(value: string) {
  return value.trim().slice(0, MAX_PURPOSE_LENGTH);
}

export interface TochkaCreatePaymentParams {
  orderId: string;       // ваш внутренний ID заказа
  amount: number;        // сумма в рублях (например 1500.00)
  purpose: string;       // назначение платежа
  redirectUrl: string;   // URL после успешной оплаты
  failUrl: string;       // URL после неудачной оплаты
  customer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  items?: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
}

export interface TochkaPaymentResult {
  operationId: string;
  paymentUrl: string;
  status: 'CREATED' | 'APPROVED' | 'EXPIRED' | string;
}

type TochkaPaymentOperation = {
  status?: string;
  operationId?: string;
  paymentType?: string;
  paidAt?: string;
  amount?: number;
};

export function extractTochkaPaymentOperation(response: unknown): TochkaPaymentOperation {
  const root = response as {
    Data?: {
      Operation?: TochkaPaymentOperation[];
      status?: string;
      operationId?: string;
      paymentType?: string;
      paidAt?: string;
      amount?: number;
    };
    Operation?: TochkaPaymentOperation[];
    status?: string;
    operationId?: string;
    paymentType?: string;
    paidAt?: string;
    amount?: number;
  };

  const data = root?.Data ?? root;
  const operation = Array.isArray(data?.Operation) ? data.Operation[0] : null;
  return operation ?? data ?? {};
}

/**
 * Создаёт платёж в Точке и возвращает ссылку на оплату
 */
export async function createTochkaPayment(
  params: TochkaCreatePaymentParams,
): Promise<TochkaPaymentResult> {
  const jwt = process.env.TOCHKA_JWT;
  const customerCode = process.env.TOCHKA_CUSTOMER_CODE;

  if (!jwt || !customerCode) {
    throw new Error('TOCHKA_JWT and TOCHKA_CUSTOMER_CODE env vars are required');
  }

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
    CustomerCode: customerCode,
  };

  const merchantId = process.env.TOCHKA_MERCHANT_ID;

  // Be conservative: plain payment links are the safe default.
  // Receipt-mode must be enabled explicitly in env only after the merchant
  // account is confirmed to support Tochka's receipt endpoint.
  const receiptEnabled = process.env.TOCHKA_RECEIPTS_ENABLED === 'true';
  const receiptItems = (params.items ?? [])
    .filter((item) => item.quantity > 0 && item.price > 0)
    .map((item) => ({
      name: item.title.slice(0, 128),
      amount: Number(item.price.toFixed(2)),
      quantity: item.quantity,
      vatType: process.env.TOCHKA_RECEIPT_VAT_TYPE ?? 'none',
      paymentMethod: process.env.TOCHKA_RECEIPT_PAYMENT_METHOD ?? 'full_payment',
      paymentObject: process.env.TOCHKA_RECEIPT_PAYMENT_OBJECT ?? 'goods',
      measure: process.env.TOCHKA_RECEIPT_MEASURE ?? 'шт.',
    }));

  const canSendReceipt = Boolean(receiptEnabled && params.customer?.email && receiptItems.length > 0);

  const body = {
    Data: {
      customerCode,
      ...(merchantId ? { merchantId } : {}),
      purpose: paymentPurpose(params.purpose),
      amount: params.amount,
      orderId: params.orderId,
      paymentLinkId: params.orderId,
      redirectUrl: params.redirectUrl,
      failRedirectUrl: params.failUrl,
      paymentMode: ['card', 'sbp'],
      ...(canSendReceipt ? {
        Client: {
          email: params.customer?.email,
          name: params.customer?.name,
          phone: receiptPhone(params.customer?.phone),
        },
        Items: receiptItems,
        taxSystemCode: process.env.TOCHKA_RECEIPT_TAX_SYSTEM_CODE,
      } : {}),
    },
  };

  async function postPayment(path: string, payload: unknown) {
    const res = await fetch(`${baseUrl()}${path}`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Tochka API error ${res.status}: ${text}`);
    }

    return JSON.parse(text);
  }

  let data: Record<string, unknown>;
  if (canSendReceipt) {
    try {
      data = await postPayment('/acquiring/v1.0/payments-with-receipt', body);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const statusMatch = message.match(/Tochka API error (\d+):\s*([\s\S]*)$/);
      const status = statusMatch ? Number(statusMatch[1]) : 0;
      const bodyText = statusMatch?.[2] ?? message;

      if (!isNotImplementedReceiptError(status, bodyText)) {
        throw error;
      }

      console.warn('[tochka] Receipt endpoint not available, retrying plain payment link');
      data = await postPayment('/acquiring/v1.0/payments', {
        Data: {
          customerCode,
          ...(merchantId ? { merchantId } : {}),
          purpose: paymentPurpose(params.purpose),
          amount: params.amount,
          orderId: params.orderId,
          paymentLinkId: params.orderId,
          redirectUrl: params.redirectUrl,
          failRedirectUrl: params.failUrl,
          paymentMode: ['card', 'sbp'],
        },
      });
    }
  } else {
    data = await postPayment('/acquiring/v1.0/payments', {
      Data: {
        customerCode,
        ...(merchantId ? { merchantId } : {}),
        purpose: paymentPurpose(params.purpose),
        amount: params.amount,
        orderId: params.orderId,
        paymentLinkId: params.orderId,
        redirectUrl: params.redirectUrl,
        failRedirectUrl: params.failUrl,
        paymentMode: ['card', 'sbp'],
      },
    });
  }

  // Tochka wraps response in { Data: { operationId, paymentLink, status, ... } }
  const d = ((data as { Data?: Record<string, unknown> }).Data ?? data) as Record<string, unknown>;
  return {
    operationId: String(d.operationId ?? d.operation_id ?? d.id ?? ''),
    paymentUrl: String(d.paymentLink ?? d.paymentUrl ?? d.payment_url ?? d.url ?? d.link ?? ''),
    status: String(d.status ?? 'CREATED'),
  };
}

/**
 * Получает статус платежа по operationId
 */
export async function getTochkaPaymentStatus(operationId: string) {
  const jwt = process.env.TOCHKA_JWT;
  const customerCode = process.env.TOCHKA_CUSTOMER_CODE;

  if (!jwt || !customerCode) throw new Error('Missing Tochka env vars');

  const res = await fetch(`${baseUrl()}/acquiring/v1.0/payments/${operationId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      CustomerCode: customerCode,
    },
  });

  if (!res.ok) throw new Error(`Tochka status check failed: ${res.status}`);
  return res.json();
}

export interface TochkaRefundResult {
  isRefund: boolean;
  operationId: string;
  amount: number;
}

/**
 * Возврат платежа по operationId.
 * Точка возвращает ТОЛЬКО платежи в статусе APPROVED.
 *   POST /acquiring/v1.0/payments/{operationId}/refund
 *   body: { Data: { amount } }   — amount > 0 и не больше суммы оплаты
 *   ответ: { Data: { isRefund, operationId, amount, date, orderId } }
 */
export async function refundTochkaPayment(
  operationId: string,
  amount: number,
): Promise<TochkaRefundResult> {
  const jwt = process.env.TOCHKA_JWT;
  const customerCode = process.env.TOCHKA_CUSTOMER_CODE;

  if (!jwt || !customerCode) throw new Error('Missing Tochka env vars');
  if (!operationId) throw new Error('refundTochkaPayment: operationId is required');
  if (!(amount > 0)) throw new Error('refundTochkaPayment: amount must be > 0');

  const res = await fetch(`${baseUrl()}/acquiring/v1.0/payments/${operationId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
      CustomerCode: customerCode,
    },
    body: JSON.stringify({ Data: { amount: Number(amount.toFixed(2)) } }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Tochka refund error ${res.status}: ${text}`);
  }

  let parsed: unknown = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {};
  }
  const d = ((parsed as { Data?: Record<string, unknown> }).Data ?? parsed) as Record<string, unknown>;
  return {
    isRefund: d.isRefund === undefined ? true : Boolean(d.isRefund),
    operationId: String(d.operationId ?? operationId),
    amount: Number(d.amount ?? amount),
  };
}
