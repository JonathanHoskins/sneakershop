const Database = require('better-sqlite3');
const db = new Database('sneakershop.db', { readonly: true });

console.log('\n=== SNEAKER SHOP DATABASE ===\n');

// Show all users
console.log('📧 USERS:');
console.log('─'.repeat(60));
const users = db.prepare('SELECT id, email, created_at FROM users').all();
if (users.length === 0) {
  console.log('No users registered yet.\n');
} else {
  users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${user.created_at}`);
    console.log('─'.repeat(60));
  });
  console.log(`Total users: ${users.length}\n`);
}

// Show all wishlists
console.log('❤️  WISHLISTS:');
console.log('─'.repeat(60));
const wishlists = db.prepare(`
  SELECT w.id, w.user_id, u.email, w.shoe_id, w.added_at
  FROM wishlist w
  JOIN users u ON w.user_id = u.id
  ORDER BY u.email, w.shoe_id
`).all();

if (wishlists.length === 0) {
  console.log('No wishlist items yet.\n');
} else {
  let currentUser = null;
  wishlists.forEach(item => {
    if (currentUser !== item.email) {
      if (currentUser !== null) console.log('');
      console.log(`User: ${item.email}`);
      currentUser = item.email;
    }
    console.log(`  - Shoe ID: ${item.shoe_id} (added: ${item.added_at})`);
  });
  console.log('─'.repeat(60));
  console.log(`Total wishlist items: ${wishlists.length}\n`);
}

// Show all email subscriptions
console.log('🔔 EMAIL SUBSCRIPTIONS:');
console.log('─'.repeat(60));
const subscriptions = db.prepare('SELECT * FROM email_subscriptions ORDER BY email, shoe_id').all();
if (subscriptions.length === 0) {
  console.log('No email subscriptions yet.\n');
} else {
  subscriptions.forEach(sub => {
    console.log(`Email: ${sub.email} | Shoe ID: ${sub.shoe_id} | Created: ${sub.created_at}`);
  });
  console.log('─'.repeat(60));
  console.log(`Total subscriptions: ${subscriptions.length}\n`);
}

db.close();
