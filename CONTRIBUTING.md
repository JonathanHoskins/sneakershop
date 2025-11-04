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
4. **Understand the project** using Spec Kit:
   ```bash
   # Read the project specification
   cat .specify/spec.md
   
   # Read the project principles
   cat .specify/constitution.md
   
   # Read the technical plan
   cat .specify/plan.md
   ```
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Specification-Driven Development Workflow

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for specification-driven development. Before writing code, you should create or reference a specification.

### For New Features

1. **Create a Task Specification**:
   ```bash
   # Create a new task file
   touch .specify/tasks/your-feature-name.md
   ```
   
   Use existing tasks as templates:
   - `.specify/tasks/add-price-alert-feature.md` (complex feature)
   - `.specify/tasks/add-search-feature.md` (simple feature)

2. **Include in Your Specification**:
   - Status (Not Started, In Progress, Completed)
   - Description and context
   - Functional requirements
   - Technical approach
   - API changes (if applicable)
   - UI/UX changes
   - Testing plan
   - Success criteria

3. **Get Specification Reviewed**:
   - Create a PR with your spec (use `docs:` prefix)
   - Get feedback before implementation
   - Ensure alignment with `.specify/spec.md` and `.specify/constitution.md`

### For Bug Fixes

1. **Reference Existing Specs**:
   - Check `.specify/spec.md` for expected behavior
   - Follow standards in `.specify/constitution.md`
   - Keep fixes minimal and focused

2. **Document If Needed**:
   - Update specs if behavior changes
   - Add notes about edge cases discovered

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

**Reference task specifications in commits:**
```bash
git commit -m "feat: add search feature per .specify/tasks/add-search-feature.md"
```

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
- **Specification**: Link to the task specification (if applicable)
- **What**: What changes did you make?
- **Why**: Why are these changes needed?
- **How**: How did you implement them?
- **Testing**: How did you test the changes?

### Example PR Description:
```markdown
## Specification
Implements: `.specify/tasks/add-search-feature.md`

## What
Added search functionality allowing users to search shoes by name

## Why
Users need a way to find specific shoes quickly as the catalog grows

## How
- Modified GET /api/shoes to accept search parameter
- Added search input box with real-time filtering
- Implemented debouncing to prevent excessive API calls
- Added "No results" message for empty searches

## Testing
- ✅ Search filters shoes by name (case-insensitive)
- ✅ Search works with existing filters and sorting
- ✅ Debouncing prevents API spam
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

## Specification-Driven Development Guide

### What is Spec Kit?

This project uses GitHub's Spec Kit for specification-driven development (SDD). Specifications are living documents that guide all development work.

### Key Specification Files

- **`.specify/spec.md`** - Main project specification (vision, features, standards)
- **`.specify/plan.md`** - Technical implementation plan (architecture, design)
- **`.specify/constitution.md`** - Project principles and best practices
- **`.specify/tasks/`** - Individual feature specifications

### When to Create a Task Specification

Create a task spec for:
- ✅ New features (any size)
- ✅ Complex bug fixes that change behavior
- ✅ API changes or additions
- ✅ Database schema changes
- ✅ Significant refactoring

You don't need a task spec for:
- ❌ Simple typo fixes
- ❌ Dependency updates (unless they change functionality)
- ❌ Minor style tweaks

### Task Specification Template

```markdown
# Task: [Feature Name]

## Status
Not Started / In Progress / Completed

## Description
Clear description of what needs to be done

## Context
Why this feature is needed

## Requirements
### Functional Requirements
- Requirement 1
- Requirement 2

### Non-Functional Requirements
- Performance requirements
- Security requirements

## Technical Approach
How you plan to implement it

## Implementation Steps
1. Step 1
2. Step 2

## Testing
- [ ] Test case 1
- [ ] Test case 2

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Using Spec Kit with AI Assistants

When working with AI coding assistants (GitHub Copilot, Claude, etc.), provide them with specifications:

```
Please implement the feature described in .specify/tasks/add-search-feature.md

Context:
- Read .specify/spec.md for project standards
- Read .specify/constitution.md for code quality principles
- Read .specify/plan.md for technical architecture

Follow all specifications and maintain consistency with existing code.
```

### Updating Specifications

Specifications should evolve with the code:
- Update specs when requirements change
- Document decisions and rationale
- Keep specs in sync with implementation
- Review specs during code reviews

For more details, see `.specify/README.md`.

## Questions?

- Open an issue for bugs or feature requests
- Tag issues appropriately (bug, enhancement, documentation)
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🙏
