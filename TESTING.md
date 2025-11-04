# Link Testing System

## Overview
This project includes an automated link testing system to verify that all store links and images work properly before deployment.

## Running Tests

To test all links in the application, run:

```bash
npm run test-links
```

## What Gets Tested

The test script (`test-links.js`) automatically verifies:

1. **Store Links** - All retailer URLs for each shoe
2. **Image Links** - All product images from Unsplash
3. **Status Codes** - Validates HTTP responses (200, 301, 302, 307, 308 are considered valid)

## Test Output

The test provides:
- ✅ Green checkmarks for working links
- ❌ Red X for broken links
- Detailed summary with percentage of working links
- List of any broken links that need fixing

## Recent Fixes

Based on automated testing, the following changes were made:

### Removed Links
- **StockX** - Returns 403 (bot protection), replaced with GOAT
- **Amazon** - Returns 405 (method not allowed for HEAD requests)
- **Dick's Sporting Goods** - Returns 403 (bot protection)

### Working Stores
- ✅ **Nike.com** - Direct product links work great
- ✅ **Foot Locker** - Search queries work reliably  
- ✅ **Champs Sports** - Search queries work reliably
- ✅ **GOAT** - Search queries work perfectly
- ✅ **eBay** - Search queries always work
- ✅ **Tactics** - Skate shop links work well
- ✅ **Unsplash** - All images load properly

## Why Some Sites Don't Work

### StockX
StockX uses Cloudflare bot protection that blocks automated HEAD requests (403 error). While links work in browsers, they fail automated tests. Replaced with GOAT which has similar inventory.

### Amazon
Amazon blocks HEAD requests with 405 errors to prevent scraping. Links work in browsers but fail tests.

### Dick's Sporting Goods
Uses bot protection similar to StockX.

## Image Testing

In addition to link testing, we also validate all shoe images:

```bash
npm run test-images
```

The image tests verify:
- ✅ All image URLs return HTTP 200
- ✅ Content-Type is `image/*`
- ⚠️ Warns if using stock photos (Unsplash)
- ⚠️ Suggests using official Nike product images

## CI/CD Integration

### GitHub Actions Workflow

All tests run automatically on every pull request via GitHub Actions (`.github/workflows/pr-checks.yml`).

**The workflow includes:**

1. **Test Job** (Matrix: Node 18.x, 20.x)
   - Runs `npm run test-links`
   - Runs `npm run test-images`
   - Must pass ✅ to merge PR

2. **Lint Job**
   - Checks JavaScript syntax
   - Validates all test files
   - Must pass ✅ to merge PR

3. **Security Job**
   - Runs `npm audit`
   - Checks for vulnerabilities
   - Fails on high-severity issues

### PR Requirements

Before submitting a PR:
```bash
# Run all tests locally
npm run test-links
npm run test-images

# Check syntax
node -c server.js
```

**All checks must pass before merging!**

### Viewing Results

1. Go to your Pull Request on GitHub
2. Scroll to "Checks" section
3. Click "Details" to see test output
4. Fix any failures and push again

## Future Improvements

Consider adding:
- ✅ ~~CI/CD integration to run tests automatically on commits~~ **DONE**
- Browser-based testing with Puppeteer for sites with bot protection
- Retry logic with exponential backoff
- Caching of test results
- Performance benchmarking tests
- Database integrity tests
