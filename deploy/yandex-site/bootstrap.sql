\if :{?site_db_password}
\else
  \echo 'site_db_password psql variable is required'
  \quit 2
\endif

select format('create role repanel_site_app login password %L', :'site_db_password')
where not exists (select 1 from pg_roles where rolname = 'repanel_site_app')
\gexec

select 'create database repanel_site owner repanel_site_app'
where not exists (select 1 from pg_database where datname = 'repanel_site')
\gexec

revoke all on database repanel_site from public;
grant connect on database repanel_site to repanel_site_app;
