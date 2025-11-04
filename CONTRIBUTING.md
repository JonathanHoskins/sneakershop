# Contributing to Nike Sneaker Shop

Thank you for your interest in contributing to Nike Sneaker Shop! 🏀

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/sneakershop.git
   cd sneakershop
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Make Your Changes

- Follow the existing code style
- Keep changes focused and atomic
- Write clear, descriptive commit messages

### 2. Test Your Changes

Before submitting a PR, run all tests locally:

```bash
# Test store links
npm run test-links

# Test shoe images
npm run test-images

# View database state (if you modified data)
npm run view-db

# Start the server to test manually
npm start
```

### 3. Verify No Errors

Check for syntax errors:
```bash
node -c server.js
node -c test-links.js
node -c test-images.js
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add description of your feature"
```

Follow conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `style:` - Code style changes (formatting)
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title
Use clear, descriptive titles:
- ✅ "Add sorting by popularity feature"
- ✅ "Fix broken image URLs for Jordan shoes"
- ❌ "Update stuff"
- ❌ "Changes"

### PR Description
Include:
- **What**: What changes did you make?
- **Why**: Why are these changes needed?
- **How**: How did you implement them?
- **Testing**: How did you test the changes?

### Example PR Description:
```markdown
## What
Added ability to sort shoes by popularity (views + wishlist count)

## Why
Users want to see the most popular shoes first to discover trending items

## How
- Added `views` and `wishlist_count` columns to shoes table
- Implemented sorting query parameter in GET /api/shoes endpoint
- Auto-increment view count when viewing shoe details

## Testing
- ✅ Tested sorting manually with different query params
- ✅ Verified view counts increment correctly
- ✅ All existing tests pass
```

## Automated Checks

All PRs automatically run:
- ✅ **Link Tests** - Validates all store URLs return 200 status
- ✅ **Image Tests** - Validates all shoe images load correctly
- ✅ **Syntax Checks** - Ensures no JavaScript syntax errors
- ✅ **Security Audit** - Checks for known vulnerabilities
- ✅ **Multi-version Testing** - Tests on Node.js 18.x and 20.x

**All checks must pass before merging.**

## Code Standards

### JavaScript
- Use ES6+ features (const, let, arrow functions, template literals)
- Prefer async/await over callbacks
- Add error handling with try/catch
- Use descriptive variable names

### Database
- Always use prepared statements (prevents SQL injection)
- Add appropriate indexes for performance
- Use transactions for multi-step operations
- Include error handling

### API
- Follow RESTful conventions
- Return appropriate HTTP status codes
- Include error messages in responses
- Validate input parameters

## Adding New Shoes

To add shoes to the database:

1. Insert directly via SQL:
   ```javascript
   const result = db.prepare(`
     INSERT INTO shoes (name, price, image, availability, status, release_date)
     VALUES (?, ?, ?, ?, ?, ?)
   `).run('Nike Shoe Name', 150, 'image-url', 'Available Now', 'available', null);
   
   const shoeId = result.lastInsertRowid;
   
   db.prepare(`
     INSERT INTO shoe_stores (shoe_id, store_name, store_url)
     VALUES (?, ?, ?)
   `).run(shoeId, 'Nike.com', 'https://...');
   ```

2. Test the image URL:
   ```bash
   npm run test-images
   ```

3. Test the store links:
   ```bash
   npm run test-links
   ```

## Questions?

- Open an issue for bugs or feature requests
- Tag issues appropriately (bug, enhancement, documentation)
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🙏
