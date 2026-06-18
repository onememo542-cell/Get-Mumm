# API Reference

Base URL: `http://localhost:3001` (development) or deployed URL (production)

## Endpoints

### Menu

**GET /api/menu**
```bash
curl http://localhost:3001/api/menu
```

Query Parameters:
- `category` - Filter by category (appetizers, mains, desserts, beverages, sides)
- `dietary` - Filter by dietary (vegetarian, vegan, gluten-free)
- `limit` - Items per page (default: 20)
- `offset` - Pagination offset (default: 0)

Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Koshari",
      "category": "mains",
      "price": 12.99,
      "dietary_info": "vegetarian",
      "description": "Traditional Egyptian comfort food"
    }
  ],
  "total": 50
}
```

---

### Chefs

**GET /api/chefs**
```bash
curl http://localhost:3001/api/chefs
```

Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Chef Fatima",
      "bio": "15 years experience in traditional Egyptian cuisine",
      "specialties": "Bread making, Stews",
      "image_url": "/images/chef-1.jpg"
    }
  ]
}
```

---

### Blog

**GET /api/blog**
```bash
curl http://localhost:3001/api/blog
```

Query Parameters:
- `category` - Filter by category
- `limit` - Posts per page
- `offset` - Pagination offset

Response:
```json
{
  "items": [
    {
      "id": 1,
      "title": "Traditional Egyptian Bread",
      "content": "How to make authentic aish...",
      "author": "Chef Ali",
      "publish_date": "2024-01-15T10:00:00Z",
      "category": "recipes",
      "featured_image": "/images/blog-1.jpg",
      "read_time": 5
    }
  ]
}
```

---

### Contact

**POST /api/contact**
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Catering Inquiry",
    "message": "I am interested in your catering services..."
  }'
```

Required Fields:
- `name` - Sender's name
- `email` - Sender's email
- `subject` - Message subject
- `message` - Message body

Optional Fields:
- `phone` - Phone number

Response:
```json
{
  "success": true,
  "message": "Thank you for contacting us!"
}
```

Error Response:
```json
{
  "error": "Invalid email format",
  "status": 400
}
```

---

### Subscriptions

**GET /api/subscriptions**
```bash
curl http://localhost:3001/api/subscriptions
```

Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Starter",
      "price": 9.99,
      "billing_cycle": "monthly",
      "features": [
        "2 meals per week",
        "Basic support"
      ],
      "is_popular": false
    },
    {
      "id": 2,
      "name": "Professional",
      "price": 19.99,
      "billing_cycle": "monthly",
      "features": [
        "4 meals per week",
        "Priority support",
        "Menu customization"
      ],
      "is_popular": true
    }
  ]
}
```

---

### Health Check

**GET /health**
```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Server Error |

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Testing

API endpoints are tested with:
- Valid requests
- Invalid data (SQL injection, XSS, etc.)
- Missing required fields
- Malformed JSON
- Error responses

See [Testing Guide](./TESTING.md) for running tests.

## Rate Limiting

Currently no rate limiting. Will be added for production.

## Authentication

Currently no authentication required. JWT support ready for implementation.

See [Architecture](./ARCHITECTURE.md) for security details.
