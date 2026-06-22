---
name: MenuItem IDs are UUIDs
description: MenuItem.Id is Guid in C# / UUID string in JSON; frontend types say number but actual runtime values are UUID strings.
---

## Rule
- Backend: `MenuItem.Id` is `Guid`, serializes to UUID string (e.g. `"49885f24-f147-47ec-a197-b86ea9a3b705"`)
- Frontend: `CartItem.id` is typed as `number` in TypeScript but at runtime holds a UUID string
- When sending cart items to the backend order API, always use `String(item.id)` to ensure correct serialization
- Backend `OrderItem.MenuItemId` and `CreateOrderItemRequest.MenuItemId` are both `Guid`

**Why:** The frontend type file was auto-generated and has `id: number` for MenuItem, but the actual API response has always returned UUID strings. TypeScript types are wrong but runtime values are correct. Changing the type would require touching all menu-related code.

**How to apply:** Any new API call that sends a menuItemId from the cart must cast with `String(item.id)`.
