# Nike Sneaker Shop 🏀

![PR Checks](https://github.com/JonathanHoskins/sneakershop/workflows/PR%20Checks/badge.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

A modern, elegant website to browse and track cool Nike shoes that are available now, coming soon, or rare and affordable. Features user authentication, persistent wishlists, and a SQLite database backend.

## Features

✅ **Browse Nike Shoes** - View a curated collection of Nike sneakers with images, prices, and availability
✅ **User Authentication** - Secure login/registration with bcrypt password hashing
✅ **Persistent Wishlists** - Save your favorite shoes with user-specific wishlists stored in SQLite
✅ **Filter by Category** - Filter shoes by:
  - Available Now - Currently available for purchase
  - Coming Soon - Upcoming releases with release dates
  - Rare & Affordable - Hard-to-find shoes at reasonable prices
✅ **Dynamic Sorting** - Sort by popularity, newest, price (low/high)
✅ **View Tracking** - Automatically track shoe popularity
✅ **Email Notifications** - Get notified when upcoming shoes are released
✅ **Store Links** - Direct links to purchase from Nike, Foot Locker, GOAT, and more
✅ **Dark Theme** - Modern dark UI with glowing effects

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: express-session + bcrypt
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Custom link & image validation tests
- **CI/CD**: GitHub Actions

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

## Usage

1. **Register/Login** - Create an account or login to save your wishlist
2. **Browse Shoes** - Click the navigation buttons to filter shoes by category
3. **Add to Wishlist** - Click the heart icon on any shoe card (requires login)
4. **Get Notifications** - For upcoming releases, click "Notify Me" and enter your email
5. **View Wishlist** - Click "My Wishlist" to see all your saved shoes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/status` - Check authentication status

### Shoes
- `GET /api/shoes` - Get all shoes (optional query params: `?status=available|coming-soon|rare&sort=popular|newest|price-low|price-high`)
- `GET /api/shoes/:id` - Get a specific shoe by ID (increments view count)

### Wishlist (Requires Authentication)
- `GET /api/wishlist` - Get user's wishlist items
- `POST /api/wishlist/:id` - Add a shoe to wishlist
- `DELETE /api/wishlist/:id` - Remove a shoe from wishlist

### Notifications
- `POST /api/subscribe` - Subscribe to email notifications for a shoe release

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test-links && npm run test-images`
5. Submit a pull request

All PRs will automatically run validation tests.

## License

ISC

## Technologies Used

- **Backend**: Express.js, Node.js
- **Email**: Nodemailer
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with gradient backgrounds and animations

## Known Limitations

- **In-Memory Storage**: Wishlist and email subscriptions are stored in memory and will be reset when the server restarts. For production use, consider implementing persistent storage with a database like MongoDB or PostgreSQL.
- **Email Configuration**: The email notification system is set up but requires SMTP configuration to send actual emails. Currently, subscriptions are logged to the console. To enable real email sending, configure nodemailer with your SMTP credentials in the server.js file.

## Future Enhancements

- Add database persistence for wishlist and subscriptions
- Implement user authentication
- Configure real email sending with SMTP
- Add more shoes and categories
- Implement search functionality
- Add shoe size selection

## Screenshot

![Nike Sneaker Shop](https://github.com/user-attachments/assets/68376ec2-07e5-441f-8bfd-531f0e754961)
