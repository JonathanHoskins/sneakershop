# Nike Sneaker Shop 🏀

![PR Checks](https://github.com/JonathanHoskins/sneakershop/workflows/PR%20Checks/badge.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

A modern, elegant website to browse and track cool Nike shoes that are available now, coming soon, or rare and affordable. Features user authentication, persistent wishlists, and a SQLite database backend.

## Features

### 🔐 User Authentication & Security
- **Secure Registration** - Create account with email and password
- **Login System** - Persistent sessions with 7-day cookie expiration
- **Password Security** - Bcrypt hashing with 10 salt rounds
- **Session Management** - Secure cookie-based authentication
- **Rate Limiting** - DDoS protection (100 requests per 15 minutes)
- **Input Validation** - Server-side email and data validation

### 👟 Shoe Browsing & Discovery
- **Curated Collection** - 8 hand-picked Nike sneakers with high-quality images
- **Category Filters** - Browse by:
  - **All Shoes** - Complete catalog
  - **Available Now** - Ready to purchase immediately
  - **Coming Soon** - Upcoming releases with dates
  - **Rare & Affordable** - Hard-to-find at reasonable prices
  - **My Wishlist** - Your saved favorites (requires login)
- **Dynamic Sorting** - Sort by:
  - **Popular** - Most viewed and wishlisted shoes
  - **Newest** - Recently added releases
  - **Price** - Low to high or high to low
- **Detailed Information** - View prices, release dates, and store availability
- **Store Links** - Direct purchase links to Nike, Foot Locker, GOAT, eBay, and Tactics

### ❤️ Wishlist Management
- **Persistent Storage** - Wishlists saved in SQLite database (survives server restarts)
- **User-Specific** - Each user has their own private wishlist
- **Easy Management** - Add/remove shoes with one click
- **Visual Feedback** - Filled heart icon for wishlisted items
- **Login Required** - Secure, personalized experience

### 📧 Email Notifications
- **Release Alerts** - Get notified when "Coming Soon" shoes are released
- **Email Validation** - RFC 5322 compliant validation
- **Database Storage** - Subscriptions persisted in SQLite
- **Smart Restrictions** - Can only subscribe to upcoming releases

### 📊 Analytics & Tracking
- **View Counter** - Automatically tracks shoe popularity
- **Wishlist Metrics** - See how many users saved each shoe
- **Trending Algorithm** - Popular sort uses view + wishlist data
- **Database-Driven** - All metrics stored persistently

### 🎨 Modern UI/UX
- **Dark Cyberpunk Theme** - Sleek gradient background with neon accents
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Card hover effects and transitions
- **Toast Notifications** - Real-time feedback for user actions
- **Modal System** - Clean login/registration experience
- **Accessibility** - Semantic HTML and keyboard navigation

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: express-session + bcrypt
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Custom link & image validation tests
- **CI/CD**: GitHub Actions
- **Development**: Specification-Driven Development with GitHub Spec Kit

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run test-links` - Validate all store links
- `npm run test-images` - Validate all shoe images
- `npm run view-db` - View database contents and stats
- `npm run spec:demo` - Interactive Spec Kit demo and guide
- `npm run spec:read` - View main project specification
- `npm run spec:plan` - View technical implementation plan
- `npm run spec:constitution` - View project principles
- `npm run spec:tasks` - List all task specifications

## Usage

1. **Register/Login** - Create an account or login to save your wishlist
2. **Browse Shoes** - Click the navigation buttons to filter shoes by category
3. **Add to Wishlist** - Click the heart icon on any shoe card (requires login)
4. **Get Notifications** - For upcoming releases, click "Notify Me" and enter your email
5. **View Wishlist** - Click "My Wishlist" to see all your saved shoes

## API Endpoints

### Authentication

#### `POST /api/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful"
}
```

#### `POST /api/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful"
}
```

#### `POST /api/logout`
Logout current user (destroys session).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/status`
Check if user is authenticated.

**Response:** `200 OK`
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Shoes

#### `GET /api/shoes`
Get all shoes with optional filtering and sorting.

**Query Parameters:**
- `status` - Filter by: `available`, `coming-soon`, `rare`
- `sort` - Sort by: `popular`, `newest`, `price-low`, `price-high`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Air Jordan 1 Retro High OG",
    "price": 170,
    "image": "https://...",
    "availability": "available",
    "status": "available",
    "release_date": null,
    "views": 42,
    "wishlist_count": 15,
    "stores": [
      {
        "store_name": "Nike.com",
        "store_url": "https://..."
      }
    ]
  }
]
```

#### `GET /api/shoes/:id`
Get a specific shoe by ID. Increments view counter.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Air Jordan 1 Retro High OG",
  "price": 170,
  "image": "https://...",
  "availability": "available",
  "status": "available",
  "release_date": null,
  "views": 43,
  "wishlist_count": 15,
  "stores": [...]
}
```

### Wishlist (Requires Authentication)

#### `GET /api/wishlist`
Get current user's wishlist items.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "shoe_id": 2,
    "added_at": "2025-11-03T12:00:00.000Z",
    "shoe": {
      "id": 2,
      "name": "Nike Dunk Low Retro",
      "price": 110,
      "image": "https://...",
      "stores": [...]
    }
  }
]
```

#### `POST /api/wishlist`
Add a shoe to user's wishlist. Increments shoe's wishlist_count.

**Request Body:**
```json
{
  "shoeId": 2
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Added to wishlist"
}
```

#### `DELETE /api/wishlist/:shoeId`
Remove a shoe from user's wishlist. Decrements shoe's wishlist_count.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

### Email Notifications

#### `POST /api/subscribe`
Subscribe to email notifications for a shoe release.

**Request Body:**
```json
{
  "email": "user@example.com",
  "shoeId": 5
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "You'll be notified at user@example.com when Nike SB Dunk Low Pro is released!"
}
```

**Restrictions:**
- Only works for shoes with `status: "coming-soon"`
- Email must be valid (RFC 5322 format)
- Duplicate subscriptions are ignored (database constraint)

## Database Schema

The application uses SQLite with the following tables:

- **users** - User accounts with bcrypt-hashed passwords
- **shoes** - Shoe catalog with view counts and wishlist tracking
- **shoe_stores** - Store links for each shoe
- **wishlist** - User-specific wishlists
- **email_subscriptions** - Email notification subscriptions

## Testing

The project includes comprehensive automated tests:

```bash
# Test all store links
npm run test-links

# Test all shoe images
npm run test-images
```

Tests automatically run on every pull request via GitHub Actions.

## CI/CD

GitHub Actions workflow runs on every PR:
- ✅ Link validation tests
- ✅ Image validation tests  
- ✅ Syntax checks
- ✅ Security audit
- ✅ Multi-version Node.js testing (18.x, 20.x)

## Specification-Driven Development

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for specification-driven development (SDD). All project specifications, technical plans, and task definitions are maintained in the `.specify/` directory.

### Quick Start with Spec Kit

**Interactive Demo:**
```bash
npm run spec:demo
```

**Understanding the Project:**
1. Read `.specify/spec.md` - Main project specification
2. Read `.specify/constitution.md` - Project principles and standards
3. Read `.specify/plan.md` - Technical implementation plan

**Adding New Features:**
1. Create a task specification in `.specify/tasks/`
2. Follow the specification during implementation
3. Update specs if requirements change
4. Reference the task in your PR

**Example Task Specifications:**
- `.specify/tasks/add-price-alert-feature.md` - Complex feature example
- `.specify/tasks/add-search-feature.md` - Simple feature example

For detailed guidance on using Spec Kit in this project, see `.specify/README.md`.

### Benefits
- **Clear Requirements**: Every feature has a detailed specification
- **Better Collaboration**: Specs provide context for AI assistants and team members
- **Consistent Quality**: Standards defined in constitution.md guide all development
- **Living Documentation**: Specifications evolve with the codebase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test-links && npm run test-images`
5. Submit a pull request

All PRs will automatically run validation tests.

## License

ISC

## Recent Updates & Fixes

### Version 2.0 - Major Database & CI/CD Update

#### ✨ New Features
- 🔐 **User Authentication System** - Secure registration/login with bcrypt password hashing and session management
- 💾 **SQLite Database** - Migrated from in-memory to persistent SQLite storage with 5 comprehensive tables
- 📊 **Popularity Tracking** - View counters and wishlist metrics to identify trending shoes
- 🔄 **Dynamic Sorting** - Sort shoes by popularity, newest, price (low to high, high to low)
- 🧪 **Automated Testing** - Link validation and image validation test suites
- 🚀 **CI/CD Pipeline** - GitHub Actions workflow with automated PR checks
- 📝 **Enhanced Documentation** - Contributing guidelines, issue templates, and PR templates

#### 🔧 Fixes & Improvements
- Fixed broken Air Jordan 4 Bred image URL (404 error resolved)
- Updated all shoe images to valid URLs with 100% pass rate
- Removed retailers with bot protection (StockX, Amazon, Dick's Sporting Goods)
- Added email validation (RFC 5322 compliant regex)
- Implemented database seeding system (auto-populates 8 shoes on first run)
- Added database inspection utility (`view-database.js`)
- Enhanced security with prepared statements (SQL injection prevention)
- Added comprehensive error handling across all API endpoints
- Improved session security with 7-day cookie expiration

#### 📦 Database Schema
```sql
-- Users table with secure password storage
users (id, email, password, created_at)

-- Shoes table with popularity metrics
shoes (id, name, price, image, availability, status, release_date, views, wishlist_count, created_at, updated_at)

-- Store availability for each shoe
shoe_stores (id, shoe_id, store_name, store_url)

-- User-specific wishlists (persistent)
wishlist (id, user_id, shoe_id, added_at)

-- Email subscriptions for release notifications
email_subscriptions (id, email, shoe_id, created_at)
```

#### 🧪 Testing & Quality Assurance
- **Link Validation**: Automated testing of all store URLs (Nike, Foot Locker, GOAT, eBay, Tactics)
- **Image Validation**: HTTP checks for all shoe images with relevance warnings
- **Multi-Version Testing**: CI/CD tests on Node.js 18.x and 20.x
- **Security Audits**: Automated npm audit on every PR
- **Syntax Validation**: JavaScript linting across all files

#### 🔒 Security Enhancements
- Bcrypt password hashing (10 salt rounds)
- Session-based authentication with secure cookies
- Rate limiting (100 requests per 15 minutes)
- SQL injection prevention via prepared statements
- XSS protection with parameterized queries
- Server-side input validation

## Technologies Used

**Backend:**
- Express.js 4.18.2 - Web framework
- better-sqlite3 12.4.1 - Database
- express-session 1.18.2 - Session management
- bcrypt 6.0.0 - Password hashing
- express-rate-limit 7.5.0 - Rate limiting

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 with semantic markup
- CSS3 with modern gradients and animations

**DevOps:**
- GitHub Actions - CI/CD pipeline
- Custom test runners - Link & image validation

## Known Limitations

- **Email Configuration**: Email notification system requires SMTP configuration to send actual emails. Currently, subscriptions are logged to the console. To enable email sending, configure nodemailer with your SMTP credentials in `server.js`.
- **Bot Protection**: Some retailers (StockX, Amazon, Dick's) block automated requests, so their links are excluded from tests but work in browsers.
- **Session Storage**: Sessions use in-memory store. For production, use a session store like `connect-redis` or `connect-mongo`.

## Future Enhancements

- [ ] Configure SMTP for real email notifications
- [ ] Add shoe size selection and inventory tracking
- [ ] Implement advanced search and filtering
- [ ] Add user profile pages with wishlist history
- [ ] Integrate with real-time stock APIs
- [ ] Add price drop alerts
- [ ] Implement Redis session store for scalability
- [ ] Add mobile app support (React Native)
- [ ] Implement social sharing features

## Screenshot

![Nike Sneaker Shop - Updated UI with Authentication and Database](Screenshot%202025-11-03%20214554.png)

*Modern Nike Sneaker Shop featuring user authentication, persistent wishlists, and SQLite database backend.*
