# Task: Add Shoe Search Feature

## Status
Not Started

## Description
Implement a search feature that allows users to search for shoes by name in real-time as they type.

## Context
Currently, users can only filter shoes by predefined categories (Available Now, Coming Soon, Rare & Affordable, My Wishlist). There is no way to search for a specific shoe by name. This makes it difficult for users to find a particular shoe when the catalog grows.

## Requirements

### Functional Requirements
1. Users must be able to search for shoes by typing in a search box
2. Search should be case-insensitive
3. Search should match partial shoe names (e.g., "jordan" matches "Air Jordan 1")
4. Search results should update in real-time as the user types
5. Search should work in combination with existing filters
6. Clear search button should reset to showing all shoes
7. Search should show a "No results found" message when no matches exist

### Non-Functional Requirements
1. Search must be responsive and not cause lag (debounce at 300ms)
2. Search should work on all devices (mobile, tablet, desktop)
3. Must integrate seamlessly with existing UI
4. Must not break existing filter/sort functionality
5. Must pass all existing tests (no regression)

## Technical Approach

### Backend Changes

#### Modify GET /api/shoes
Add optional `search` query parameter.

**Query Parameters**:
- `status` - Filter by status (existing)
- `sort` - Sort by field (existing)
- `search` - Search by shoe name (new)

**Example Request**:
```
GET /api/shoes?search=jordan&status=available&sort=popular
```

**Implementation**:
```javascript
// In server.js, modify the GET /api/shoes route
let query = 'SELECT * FROM shoes WHERE 1=1';
const params = [];

if (req.query.search) {
  query += ' AND name LIKE ?';
  params.push(`%${req.query.search}%`);
}

if (req.query.status) {
  query += ' AND status = ?';
  params.push(req.query.status);
}

// ... existing sort logic
```

### Frontend Changes

#### HTML (public/index.html)
Add search box to the navigation area:
```html
<div class="search-container">
  <input 
    type="text" 
    id="searchInput" 
    placeholder="Search shoes..." 
    aria-label="Search shoes"
  />
  <button id="clearSearch" class="clear-search" aria-label="Clear search">
    ✕
  </button>
</div>
```

#### JavaScript (public/app.js)

1. Add search input event listener with debouncing:
```javascript
let searchTimeout;
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value.trim();
    loadShoes();
  }, 300);
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  loadShoes();
});
```

2. Modify `loadShoes()` function to include search parameter:
```javascript
let url = '/api/shoes?';
if (currentSearch) {
  url += `search=${encodeURIComponent(currentSearch)}&`;
}
// ... existing filter and sort logic
```

3. Update UI to show "No results" message:
```javascript
if (shoes.length === 0) {
  shoesContainer.innerHTML = `
    <div class="no-results">
      <h2>No shoes found</h2>
      <p>Try adjusting your search or filters</p>
    </div>
  `;
}
```

#### CSS (public/styles.css)

Add styles for search box:
```css
.search-container {
  position: relative;
  margin: 20px 0;
}

#searchInput {
  width: 100%;
  max-width: 500px;
  padding: 12px 40px 12px 15px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(17, 24, 39, 0.8);
  color: white;
  font-size: 16px;
  transition: border-color 0.3s;
}

#searchInput:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.8);
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(139, 92, 246, 0.7);
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  display: none;
}

#searchInput:not(:placeholder-shown) + .clear-search {
  display: block;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.no-results h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.no-results p {
  font-size: 16px;
}
```

## Testing

### Automated Tests
No new automated tests needed as this follows existing patterns, but verify:
- [ ] `npm run test-links` passes
- [ ] `npm run test-images` passes
- [ ] Syntax check passes

### Manual Testing Checklist
- [ ] Search box appears in the UI
- [ ] Typing in search box filters shoes in real-time
- [ ] Search is case-insensitive (e.g., "JORDAN" finds "Air Jordan 1")
- [ ] Partial matches work (e.g., "force" finds "Air Force 1")
- [ ] Clear button appears when text is entered
- [ ] Clear button resets search and shows all shoes
- [ ] Search works with category filters
- [ ] Search works with sorting
- [ ] "No results found" message appears when appropriate
- [ ] Search box is responsive on mobile devices
- [ ] Debouncing prevents excessive API calls

## Implementation Steps

1. **Backend API** (server.js)
   - Modify GET /api/shoes to accept `search` parameter
   - Add SQL LIKE query for name matching
   - Test with various search terms

2. **Frontend HTML** (public/index.html)
   - Add search input field
   - Add clear search button
   - Position in navigation area

3. **Frontend JavaScript** (public/app.js)
   - Add search input event listener with debouncing
   - Add clear button event listener
   - Modify loadShoes() to include search parameter
   - Add "No results" UI handling

4. **Frontend CSS** (public/styles.css)
   - Style search input box
   - Style clear button
   - Style "No results" message
   - Ensure responsive design

5. **Testing**
   - Run automated tests
   - Complete manual testing checklist
   - Test edge cases (special characters, very long strings)

6. **Documentation**
   - Update README.md with search feature
   - Update API documentation with search parameter

## Dependencies
- None (uses existing infrastructure)

## Estimated Effort
- Backend: 30 minutes
- Frontend HTML: 15 minutes
- Frontend JavaScript: 1 hour
- Frontend CSS: 30 minutes
- Testing: 30 minutes
- Documentation: 15 minutes
- **Total**: 3-3.5 hours

## Success Criteria
- [ ] Users can search for shoes by name
- [ ] Search updates in real-time with debouncing
- [ ] Search works with filters and sorting
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
- Consider adding search highlights in results in future iterations
- Consider adding search history/suggestions in future
- Consider adding advanced search filters (price range, release date range)
- Make sure to sanitize search input to prevent SQL injection (use prepared statements)
- Consider adding analytics to track popular search terms

## Security Considerations
- Use parameterized queries (LIKE with ?) to prevent SQL injection
- Limit search query length to prevent abuse (e.g., max 100 characters)
- Ensure search doesn't expose sensitive data
- Consider rate limiting search endpoint if abuse is detected
