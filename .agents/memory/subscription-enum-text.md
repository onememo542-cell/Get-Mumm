---
name: Subscription enum columns stored as text in PostgreSQL
description: SubscriptionType and SubscriptionStatus enums are text in the DB; EF Core needs HasConversion<string>() or it throws InvalidCastException reading them as int.
---

The `Subscriptions` table stores `Type` and `Status` columns as PostgreSQL `text` (e.g. 'Monthly', 'Active'). EF Core defaults to mapping enums as integers, causing `InvalidCastException: Reading as 'System.Int32' is not supported for fields having DataTypeName 'text'`.

**Fix applied in GetMummDbContext.cs `OnModelCreating`:**
```csharp
modelBuilder.Entity<Subscription>()
    .Property(s => s.Type)
    .HasConversion<string>();

modelBuilder.Entity<Subscription>()
    .Property(s => s.Status)
    .HasConversion<string>();
```

**Why:** The DB schema was created with text columns (likely via a migration or direct SQL) while the C# entity uses C# enums. EF Core's default int mapping does not match.

**How to apply:** Any new enum property on an entity whose DB column is text must have `HasConversion<string>()` in the DbContext configuration.
