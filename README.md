# Nike Sneaker Shop 🏀

A simple, elegant website to browse and track cool Nike shoes that are available now, coming soon, or rare and affordable.

## Features

✅ **Browse Nike Shoes** - View a curated collection of Nike sneakers with images, prices, and availability
✅ **Filter by Category** - Filter shoes by:
  - Available Now - Currently available for purchase
  - Coming Soon - Upcoming releases with release dates
  - Rare & Affordable - Hard-to-find shoes at reasonable prices
✅ **Wishlist** - Save your favorite shoes to a wishlist for easy tracking
✅ **Email Notifications** - Get notified when upcoming shoes are released
✅ **Store Information** - See where each shoe is available for purchase

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

## Usage

1. **Browse Shoes** - Click the navigation buttons to filter shoes by category
2. **Add to Wishlist** - Click "Add to Wishlist" button on any shoe card
3. **Get Notifications** - For upcoming releases, click "Notify Me" and enter your email
4. **View Wishlist** - Click "My Wishlist" to see all your saved shoes

## API Endpoints

- `GET /api/shoes` - Get all shoes (optional query param: `?status=available|coming-soon|rare`)
- `GET /api/shoes/:id` - Get a specific shoe by ID
- `GET /api/wishlist` - Get all wishlist items
- `POST /api/wishlist/:id` - Add a shoe to wishlist
- `DELETE /api/wishlist/:id` - Remove a shoe from wishlist
- `POST /api/subscribe` - Subscribe to email notifications for a shoe release

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
