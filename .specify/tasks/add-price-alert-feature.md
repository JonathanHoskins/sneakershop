# Task: Add Price Alert Feature

## Status
Not Started

## Description
Implement a price alert feature that allows users to set price thresholds for shoes and receive notifications when the price drops below their specified threshold.

## Context
Currently, users can only subscribe to release notifications for "Coming Soon" shoes. Many users want to be notified when the price of a shoe they're interested in drops to a specific level.

## Requirements

### Functional Requirements
1. Users must be able to set a target price for any shoe
2. Users can only set one price alert per shoe
3. When a shoe's price is updated in the database and falls below a user's target price, they should receive an email notification
4. Users should be able to view all their active price alerts
5. Users should be able to update or delete their price alerts
6. Authentication is required for all price alert operations

### Non-Functional Requirements
1. Email validation using existing RFC 5322 compliant regex
2. Database queries must use prepared statements
3. API endpoints must follow existing RESTful conventions
4. Error handling must follow project standards
5. Must pass all existing tests (no regression)

## Technical Approach

### Database Changes

#### New Table: price_alerts
```sql
CREATE TABLE IF NOT EXISTS price_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  shoe_id INTEGER NOT NULL,
  target_price INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE,
  UNIQUE(user_id, shoe_id)
)
```

### API Endpoints

#### POST /api/price-alerts
Set a price alert for a shoe.

**Authentication**: Required

**Request Body**:
```json
{
  "shoeId": 1,
  "targetPrice": 150
}
```

**Response**: 201 Created
```json
{
  "success": true,
  "message": "Price alert set for Nike Air Force 1 at $150"
}
```

**Error Responses**:
- 400: Invalid shoeId or targetPrice
- 401: Not authenticated
- 409: Price alert already exists for this shoe

#### GET /api/price-alerts
Get all price alerts for the current user.

**Authentication**: Required

**Response**: 200 OK
```json
[
  {
    "id": 1,
    "user_id": 1,
    "shoe_id": 2,
    "target_price": 150,
    "created_at": "2025-11-03T12:00:00.000Z",
    "shoe": {
      "id": 2,
      "name": "Nike Dunk Low Retro",
      "price": 170,
      "image": "https://...",
      "current_price": 170
    }
  }
]
```

#### PUT /api/price-alerts/:shoeId
Update the target price for a price alert.

**Authentication**: Required

**Request Body**:
```json
{
  "targetPrice": 140
}
```

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Price alert updated to $140"
}
```

#### DELETE /api/price-alerts/:shoeId
Delete a price alert.

**Authentication**: Required

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Price alert deleted"
}
```

### Backend Implementation (server.js)

1. Add price_alerts table creation in database initialization
2. Implement authentication middleware (already exists)
3. Add route handlers for all endpoints
4. Implement price check logic that runs when shoe prices are updated
5. Integrate with existing nodemailer for email notifications

### Frontend Implementation (public/app.js)

1. Add "Set Price Alert" button to shoe cards
2. Create modal for setting/updating price alerts
3. Add "Price Alerts" filter to navigation (similar to "My Wishlist")
4. Display active price alerts with current vs target price
5. Add visual indicator for shoes with active price alerts

### Frontend Implementation (public/index.html)

1. Add price alert modal HTML structure
2. Add price alert indicator icons

### Frontend Implementation (public/styles.css)

1. Style price alert modal
2. Style price alert indicators
3. Style price alerts view

## Testing

### Automated Tests
No new automated tests needed as this follows existing patterns, but verify:
- [ ] `npm run test-links` passes
- [ ] `npm run test-images` passes
- [ ] Syntax check passes

### Manual Testing Checklist
- [ ] User can set a price alert for a shoe
- [ ] Price alert appears in user's price alerts view
- [ ] User cannot set duplicate price alerts for the same shoe
- [ ] User can update target price
- [ ] User can delete price alert
- [ ] Unauthenticated users cannot access price alert endpoints
- [ ] Email notification triggers when price drops below target
- [ ] Price alerts persist across sessions
- [ ] Price alert UI is responsive on mobile

## Implementation Steps

1. **Database Schema** (server.js)
   - Add price_alerts table creation
   - Add indexes for performance

2. **Backend API** (server.js)
   - Implement POST /api/price-alerts
   - Implement GET /api/price-alerts
   - Implement PUT /api/price-alerts/:shoeId
   - Implement DELETE /api/price-alerts/:shoeId
   - Add price check logic for email notifications

3. **Frontend UI** (public/)
   - Add price alert button to shoe cards
   - Create price alert modal
   - Add price alerts navigation filter
   - Add price alert indicators
   - Style all new elements

4. **Testing**
   - Run automated tests
   - Complete manual testing checklist
   - Test error scenarios

5. **Documentation**
   - Update README.md with price alert feature
   - Update API documentation
   - Add example usage

## Dependencies
- Existing nodemailer configuration
- Existing authentication middleware
- Existing database connection

## Estimated Effort
- Backend: 2-3 hours
- Frontend: 2-3 hours
- Testing: 1-2 hours
- Documentation: 1 hour
- **Total**: 6-9 hours

## Success Criteria
- [ ] All API endpoints work as specified
- [ ] Price alerts persist in database
- [ ] Email notifications work correctly
- [ ] UI is intuitive and responsive
- [ ] All existing tests pass
- [ ] New feature is documented
- [ ] Code follows project standards

## Related Files
- `server.js` - Backend implementation
- `public/app.js` - Frontend logic
- `public/index.html` - HTML structure
- `public/styles.css` - Styling
- `README.md` - Documentation
- `.specify/spec.md` - Project specification

## Notes
- Consider rate limiting for price alert creation (e.g., max 10 alerts per user)
- Consider adding a "notify me when in stock" feature in future iterations
- Email notifications should be batched if multiple alerts trigger at once
- Consider adding a notification history table for auditing
