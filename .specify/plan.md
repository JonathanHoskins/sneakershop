# Nike Sneaker Shop - Technical Plan

## Architecture Overview

This document outlines the technical implementation plan for the Nike Sneaker Shop, a specification-driven web application for browsing and tracking Nike sneakers.

## Technology Stack

### Backend
- **Runtime**: Node.js (v18.x or v20.x)
- **Framework**: Express 4.18.2
- **Database**: SQLite via better-sqlite3 12.4.1
- **Authentication**: express-session 1.18.2 + bcrypt 6.0.0
- **Security**: express-rate-limit 8.2.1
- **Email**: nodemailer 7.0.10

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Approach**: Vanilla JavaScript (no framework overhead)
- **Styling**: Custom CSS with CSS Grid and Flexbox

### Development Tools
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Testing**: Custom test scripts (Node.js based)
- **Package Manager**: npm

## System Architecture

### Three-Tier Architecture

```
┌─────────────────┐
│   Frontend      │  (HTML/CSS/JS)
│   Browser       │  
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   Backend       │  (Express.js)
│   API Server    │  
└────────┬────────┘
         │
         │ SQL
         │
┌────────▼────────┐
│   Database      │  (SQLite)
│   Data Layer    │  
└─────────────────┘
```

### Component Breakdown

#### 1. Frontend Layer
- **index.html**: Main application shell
- **styles.css**: Styling and responsive design
- **app.js**: Client-side logic and API interactions
- **Features**:
  - Single-page application feel with dynamic content loading
  - Modal-based authentication
  - Toast notifications for user feedback
  - Responsive card-based shoe display

#### 2. Backend Layer (server.js)
- **Express Server**: Main application server
- **Middleware Stack**:
  - body-parser for JSON parsing
  - express-session for session management
  - express-rate-limit for DDoS protection
- **Route Handlers**:
  - Authentication routes (`/api/register`, `/api/login`, `/api/logout`)
  - Shoe routes (`/api/shoes`, `/api/shoes/:id`)
  - Wishlist routes (`/api/wishlist`)
  - Notification routes (`/api/subscribe`)
- **Database Interface**: Direct SQL queries via better-sqlite3

#### 3. Database Layer
- **SQLite Database**: sneakershop.db
- **Schema**: Five tables (users, shoes, shoe_stores, wishlist, email_subscriptions)
- **Initialization**: Automatic seeding on first run
- **Transactions**: Used for multi-step operations

## Database Design

### Entity-Relationship Model

```
┌─────────────┐         ┌─────────────┐
│    Users    │         │    Shoes    │
│─────────────│         │─────────────│
│ id (PK)     │         │ id (PK)     │
│ email       │         │ name        │
│ password    │         │ price       │
│ created_at  │         │ image       │
└──────┬──────┘         │ status      │
       │                │ views       │
       │                │ wishlist_ct │
       │                └──────┬──────┘
       │                       │
       │   ┌───────────────────┼──────────────┐
       │   │                   │              │
       │   │                   │              │
┌──────▼───▼──┐         ┌──────▼──────┐  ┌──▼─────────────┐
│  Wishlist   │         │ Shoe_Stores │  │ Email_Subscript│
│─────────────│         │─────────────│  │─────────────────│
│ id (PK)     │         │ id (PK)     │  │ id (PK)        │
│ user_id(FK) │         │ shoe_id(FK) │  │ email          │
│ shoe_id(FK) │         │ store_name  │  │ shoe_id (FK)   │
│ added_at    │         │ store_url   │  │ created_at     │
└─────────────┘         └─────────────┘  └────────────────┘
```

### Indexes
- Primary keys on all tables (automatic)
- Unique constraint on users.email
- Unique constraint on (user_id, shoe_id) in wishlist
- Unique constraint on (email, shoe_id) in email_subscriptions

## API Design

### RESTful Principles
- Use appropriate HTTP methods (GET, POST, DELETE)
- Return consistent JSON responses
- Use proper HTTP status codes
- Include error messages in responses

### Authentication Flow
1. User submits credentials
2. Server validates email format
3. Server checks bcrypt hash
4. Server creates session
5. Server returns success + sets cookie
6. Client stores session in browser

### Data Flow Example: Adding to Wishlist
1. User clicks heart icon (client)
2. Client sends POST /api/wishlist with shoeId
3. Server checks authentication
4. Server validates shoeId exists
5. Server inserts into wishlist table
6. Server increments shoe.wishlist_count
7. Server returns success
8. Client updates UI

## Security Architecture

### Defense in Depth

#### Layer 1: Input Validation
- Email format validation (RFC 5322 regex)
- Required field validation
- Type checking

#### Layer 2: Authentication
- bcrypt password hashing (10 rounds)
- Secure session cookies (httpOnly, secure in production)
- Session expiration (7 days)

#### Layer 3: Authorization
- Middleware checks for authenticated session
- User-specific data isolation (wishlist is per-user)

#### Layer 4: Database Security
- Prepared statements for all queries
- No string concatenation in SQL
- Parameterized queries

#### Layer 5: Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force and DDoS

#### Layer 6: Error Handling
- Generic error messages to users
- Detailed logging for debugging
- No stack traces to clients

## Deployment Architecture

### Development Environment
- Local Node.js server
- SQLite database file
- Hot reload not enabled (manual restart)

### Production Considerations
- Use environment variables for sensitive config
- Enable HTTPS
- Use production session store (Redis)
- Implement proper logging
- Set up monitoring
- Use process manager (PM2)
- Configure reverse proxy (nginx)

## Testing Strategy

### Automated Tests
1. **Link Validation** (test-links.js)
   - Validates all store URLs return 200 status
   - Checks for broken links
   
2. **Image Validation** (test-images.js)
   - Validates all shoe images load correctly
   - Checks HTTP status codes

3. **Syntax Checks**
   - Validates JavaScript syntax
   - Runs on all JS files

4. **Security Audit**
   - npm audit for known vulnerabilities
   - Checks dependencies

### CI/CD Pipeline
- Runs on every PR
- Multi-version testing (Node 18.x, 20.x)
- All tests must pass before merge
- Automated checks via GitHub Actions

### Manual Testing Checklist
- [ ] User registration flow
- [ ] User login/logout flow
- [ ] Shoe browsing and filtering
- [ ] Wishlist add/remove
- [ ] Email subscription
- [ ] Responsive design on mobile
- [ ] Error handling scenarios
- [ ] Session persistence

## Performance Considerations

### Current Optimizations
- SQLite for fast local queries
- In-memory session store (dev)
- Minimal JavaScript bundle
- No external CSS frameworks

### Future Optimizations
- Database indexing for large datasets
- Redis for session storage
- CDN for static assets
- Image optimization and lazy loading
- API response caching

## Development Workflow

### Local Development
1. Clone repository
2. Run `npm install`
3. Run `npm start`
4. Access at http://localhost:3000
5. Database auto-initializes on first run

### Adding Features
1. Create task specification in `.specify/tasks/`
2. Implement following code standards
3. Test locally
4. Run automated tests
5. Create PR
6. Wait for CI/CD checks
7. Get code review
8. Merge

### Database Operations
- Use `npm run view-db` to inspect database
- Direct SQLite queries via better-sqlite3
- Migrations handled manually in server.js

## Maintenance Plan

### Regular Tasks
- Update dependencies monthly
- Run security audits
- Review and update documentation
- Monitor error logs
- Backup database

### Monitoring
- Track API response times
- Monitor error rates
- Check disk space (database size)
- Review session storage usage

## Risk Mitigation

### Identified Risks

1. **SQL Injection**
   - **Mitigation**: Use prepared statements exclusively
   
2. **XSS Attacks**
   - **Mitigation**: Parameterized queries, no innerHTML with user data
   
3. **Session Hijacking**
   - **Mitigation**: Secure cookies, HTTPS in production
   
4. **DDoS Attacks**
   - **Mitigation**: Rate limiting, future: CDN/WAF
   
5. **Password Breaches**
   - **Mitigation**: bcrypt hashing, no password storage in plain text

## Dependencies

### Production Dependencies
- express: Web framework
- bcrypt: Password hashing
- better-sqlite3: Database driver
- body-parser: JSON parsing
- express-rate-limit: Rate limiting
- express-session: Session management
- nodemailer: Email notifications

### Development Dependencies
- None currently (consider adding linters in future)

## File Structure

```
sneakershop/
├── .github/
│   ├── workflows/
│   │   └── pr-checks.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── .specify/
│   ├── spec.md
│   ├── plan.md
│   └── tasks/
│       └── (task specifications)
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── test-links.js
├── test-images.js
├── view-database.js
├── package.json
├── package-lock.json
├── README.md
├── CONTRIBUTING.md
├── TESTING.md
└── sneakershop.db (generated)
```

## Conclusion

This technical plan provides a comprehensive blueprint for the Nike Sneaker Shop application. It emphasizes security, maintainability, and user experience while keeping the architecture simple and understandable. The specification-driven approach ensures that all development aligns with the project's core vision and standards.
