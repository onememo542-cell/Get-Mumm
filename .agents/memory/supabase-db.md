---
name: Supabase DB connection
description: The backend connects to Supabase PostgreSQL, not the local Replit database.
---

## Rule
All schema changes (CREATE TABLE, ALTER TABLE, etc.) must be run via `psql` using the connection string in `backend/GetMumm.Api/appsettings.json`, NOT via the `executeSql()` code_execution callback (which targets the local Replit DB).

## Connection string location
`backend/GetMumm.Api/appsettings.json` → `ConnectionStrings.DefaultConnection`

## How to apply
```bash
PGPASSWORD='<password>' psql "host=... port=5432 dbname=postgres user=... sslmode=require" -c "SQL HERE"
```

**Why:** The `executeSql` sandbox callback connects to the Replit-managed local PostgreSQL, but the API container uses the Supabase connection string. Running SQL on the wrong DB causes `42P01: relation does not exist` errors at runtime.
