# BookFlow Authentication & Button Functionality Test Guide

## System Overview
BookFlow is now a fully authenticated book exchange platform. Users MUST log in to access all features.

## Authentication System
- **Database**: Dummy in-memory database with persistent sessions
- **Login**: `/login` - Email-based login with demo accounts
- **Signup**: `/signup` - New user registration with validation
- **Logout**: Accessible from navbar menu
- **Protected Routes**: All pages except home, login, and signup require authentication

## Demo Accounts
All demo accounts use the password: `password123`

```
Email: sarah@example.com
Email: marcus@example.com  
Email: emma@example.com
```

## Test Scenarios

### 1. Authentication Flow
**✓ SIGN UP Page (/signup)**
- [ ] Form validation works (password match, min 6 chars)
- [ ] Submit button creates new user
- [ ] User redirects to dashboard on success
- [ ] Login link navigates to login page

**✓ LOG IN Page (/login)**
- [ ] Demo account button fills form
- [ ] Form validation (email required, password required)
- [ ] Submit button authenticates user
- [ ] User redirects to dashboard on success
- [ ] Sign up link navigates to signup page
- [ ] Error messages display for invalid credentials

**✓ HOME Page (/)**
- [ ] Authenticated users redirect to /dashboard automatically
- [ ] Unauthenticated users see landing page
- [ ] "Get Started Free" button links to /signup
- [ ] "Sign In" button links to /login
- [ ] Featured books display properly

### 2. Protected Routes & Navigation
**✓ NAVBAR (All Pages)**
- [ ] Shows login/signup buttons when NOT authenticated
- [ ] Shows user profile, dashboard, exchanges links when authenticated
- [ ] User avatar and name display correctly
- [ ] Logout button appears when authenticated
- [ ] Mobile menu toggle works
- [ ] All navigation links are functional

**✓ DASHBOARD (/dashboard)**
- [ ] Only accessible when logged in (redirects to login if not)
- [ ] Displays user welcome message
- [ ] Shows user stats (books shared, rating, reviews, community status)
- [ ] "List a Book" button links to /list-book
- [ ] Search bar filters books by title/author
- [ ] Books display in grid with images, ratings, condition badges
- [ ] Heart icon button for wishlist (functional)
- [ ] Book cards are clickable and navigate to book detail
- [ ] "Browse All" button functional

**✓ BROWSE (/browse)**
- [ ] Only accessible when logged in
- [ ] Search functionality filters books
- [ ] Genre filter buttons work
- [ ] Condition filter buttons work
- [ ] Clear filters button resets all filters
- [ ] Book cards display properly with hover effects
- [ ] Mobile filter menu toggle works

**✓ BOOK DETAIL (/book/[id])**
- [ ] Only accessible when logged in
- [ ] Book information displays (title, author, description, cover)
- [ ] Owner profile information shows
- [ ] Rating and reviews section displays
- [ ] Propose Exchange button functional
- [ ] Wishlist button functional
- [ ] Share button functional
- [ ] Back navigation works

**✓ LIST BOOK (/list-book)**
- [ ] Only accessible when logged in
- [ ] Form fields (title, author, ISBN, description, genre, condition) work
- [ ] Cover image upload/selection
- [ ] Submit button creates new book listing
- [ ] Success message displays
- [ ] Redirect to dashboard after listing

**✓ EXCHANGES (/exchanges)**
- [ ] Only accessible when logged in
- [ ] Displays all pending exchanges
- [ ] Accept button functional
- [ ] Reject button functional
- [ ] Complete button functional
- [ ] Exchange details display correctly
- [ ] Tabs switch between Pending, Completed, Cancelled

**✓ PROFILE (/profile/[id])**
- [ ] Only accessible when logged in
- [ ] User information displays (name, rating, bio, location)
- [ ] User statistics show (books shared, reviews, member since)
- [ ] User's book listings display
- [ ] Follow/Unfollow button works
- [ ] Message button navigates to messaging
- [ ] Edit profile button appears for own profile

**✓ WISHLIST (/wishlist/[id])**
- [ ] Only accessible when logged in
- [ ] Displays user's wishlist books
- [ ] Remove button functional
- [ ] View button links to book details
- [ ] Request Exchange button functional
- [ ] Empty wishlist message shows when no items

### 3. API Endpoints
**✓ Auth Endpoints**
- [ ] POST /api/auth/signup - Creates user and session
- [ ] POST /api/auth/login - Authenticates user
- [ ] POST /api/auth/logout - Destroys session
- [ ] GET /api/auth/me - Returns current user info

**✓ Book Endpoints**
- [ ] GET /api/books - Fetches all books
- [ ] GET /api/books/[id] - Fetches single book
- [ ] POST /api/books - Creates new book listing

**✓ Exchange Endpoints**
- [ ] GET /api/exchanges - Fetches exchanges for user
- [ ] POST /api/exchanges - Creates exchange request
- [ ] PUT /api/exchanges/[id] - Updates exchange status

**✓ Wishlist Endpoints**
- [ ] GET /api/wishlist/[id] - Fetches user's wishlist
- [ ] POST /api/wishlist - Adds book to wishlist
- [ ] DELETE /api/wishlist/[id] - Removes from wishlist

**✓ Review Endpoints**
- [ ] GET /api/reviews - Fetches reviews
- [ ] POST /api/reviews - Creates review

### 4. UI/UX & Design
**✓ Color Scheme**
- [ ] Modern blue primary color (#2563eb)
- [ ] Purple accent (#a855f7)
- [ ] Clean white backgrounds
- [ ] Professional typography
- [ ] Proper contrast for readability

**✓ Responsive Design**
- [ ] Mobile menu toggle works
- [ ] Grid layouts stack on mobile
- [ ] Forms are mobile-friendly
- [ ] Images scale properly
- [ ] Touch targets are large enough

**✓ Accessibility**
- [ ] Alt text on all images
- [ ] Proper heading hierarchy
- [ ] Form labels associated with inputs
- [ ] Color contrast meets standards
- [ ] Keyboard navigation works

### 5. Session Management
- [ ] Sessions persist across page navigation
- [ ] Sessions expire after 24 hours
- [ ] Logout clears session properly
- [ ] Protected routes check session validity
- [ ] Cookie handling is secure (httpOnly)

## Test Results
Run through each scenario and mark as complete. All buttons and functionality should be working end-to-end.

---

**Last Updated**: 2025
**Status**: Ready for Testing
