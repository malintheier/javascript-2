# javascript-2

JavaScript 2 Course Assignment - Pulse

<img width="1106" height="566" alt="image" src="https://github.com/user-attachments/assets/1cf29871-9ac5-46c3-b273-d1d774b487cf" />

🔗 **Live Demo:** [https://pulse-2026.netlify.app/](https://pulse-2026.netlify.app/)

## Description

A social media application built with vanilla JavaScript that allows users to create accounts, manage posts, and interact with profiles. This project demonstrates modern JavaScript development practices including API integration, authentication, and dynamic content rendering.

## Features

- User authentication (login/register)
- Create, edit, and delete posts via modal forms
- Tag-based post filtering (Pulse2026 tag)
- Dual-mode search supporting both posts and user profiles
- Individual post view with full details
- User profile pages with follower/following counts
- Follow and unfollow users
- Profile bio editing
- Author links from post cards to profiles
- Album cover image support with alt text on posts
- Character counter (280 limit) on post body
- Delete confirmation dialog before removing posts
- Form validation with user feedback
- Auth-guarded routes (redirects unauthenticated users)
- Responsive design

## Project Structure

```
├── index.html              # Landing page
├── package.json            # Node dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── pages/                  # Application pages
│   ├── feed.html          # Main feed with posts
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── post.html          # Individual post view
│   └── profile.html       # User profile
├── js/                     # JavaScript files
│   ├── main.js            # Main entry point (feed, search, modals)
│   ├── api/               # API integration
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── config.js      # API configuration and base URLs
│   │   ├── posts.js       # Post CRUD endpoints
│   │   └── profiles.js    # Profile, follow/unfollow endpoints
│   ├── modules/           # Reusable UI modules
│   │   ├── formValidation.js      # Login/register validation
│   │   ├── renderPostCard.js      # Individual post card component
│   │   ├── renderPostList.js      # Post list and profile grid rendering
│   │   └── renderProfileHeader.js # Profile header component
│   └── utils/             # Utility functions
│       ├── authGuard.js   # Route protection / redirect
│       ├── getParam.js    # URL parameter handling
│       ├── showMessage.js # Toast messages, modals, create/edit post forms
│       └── storage.js     # Local storage management
├── css/                   # Compiled stylesheets
│   ├── reset.css         # CSS reset
│   ├── global.css        # Global styles
│   ├── layout.css        # Layout styles
│   ├── components.css    # Component styles
│   ├── forms.css         # Form styles
│   ├── tailwind.css      # Tailwind directives
│   └── tailwind.output.css # Compiled Tailwind output
├── scss/                  # SCSS source files
│   ├── _variables.scss   # Shared variables
│   ├── components.scss   # Component styles
│   ├── forms.scss        # Form styles
│   ├── global.scss       # Global styles
│   └── reset.scss        # CSS reset source
└── assets/               # Static assets (logo, images)

```

## Technologies Used

- HTML5
- CSS3 / SCSS
- Tailwind CSS (utility-first styling)
- PostCSS
- Vanilla JavaScript (ES6+ with ES modules)
- REST API integration (Noroff Social API)
- Local Storage for auth token persistence

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.)
- VS Code (recommended) or any code editor

### Installation

1. Clone or download the repository

   ```bash
   git clone https://github.com/yourusername/javascript-2.git
   ```

2. Navigate to the project directory

   ```bash
   cd javascript-2
   ```

3. Open the project in VS Code

   ```bash
   code .
   ```

4. Run the project using one of these methods:

   **Option A: Using VS Code Live Server (Recommended)**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"
   - The project will open automatically in your browser

   **Option B: Direct File Opening**
   - Simply double-click `index.html` to open it in your default browser
   - Note: Some API features may not work without a proper server

   **Option C: Using Python (if installed)**

   ```bash
   python -m http.server 8000
   ```

   Then open `http://localhost:8000` in your browser

   **Option D: Using Node.js (if installed)**

   ```bash
   npx http-server
   ```

   Then open the provided local URL in your browser

## Usage

1. Register a new account on the registration page
2. Log in with your credentials
3. Browse Pulse2026-tagged posts on the feed page
4. Use the search bar to search posts or user profiles
5. Click "Create Post" to open the post creation modal (supports song, artist, body, and album cover)
6. Click on a post to view it in full detail
7. Edit or delete your own posts from the feed or post view
8. Visit a user's profile to follow or unfollow them
9. Edit your own bio from your profile page
10. Log out from the navigation menu

## Development

The application follows a modular structure with separation of concerns:

- **API layer**: Handles all API communications with the Noroff Social API, including authentication headers and structured error handling
- **Modules**: Reusable UI components and rendering logic (post cards, post lists, profile headers)
- **Utils**: Helper functions for auth guards, URL params, toast/modal messages, and local storage
- **CSS/SCSS**: Layered stylesheet architecture with a separate Tailwind CSS pipeline

### Build

To compile Tailwind CSS:

```bash
npm install
npm run build
```

## AI Assistance

This project utilized AI tools (Microsoft Copilot) to enhance development efficiency and problem-solving. All AI-generated code has been thoroughly reviewed, tested, and refined to ensure quality and maintainability.

**AI contributions include:**

- **Debugging support**: Analyzing complex error codes and network issues
- **Feature implementation**: Tag-based filtering system for "Pulse 2026" content
- **Modal development**: Create post and edit post functionality with form handling
- **Search functionality**: Dual-mode search supporting both posts and user profiles with intelligent filtering
- **Version control**: Git commit messages and repository documentation
- **Design assets**: Logo creation and branding elements
- **Error handling**: User-friendly error message system and validation feedback

## License

This project is created as part of a course assignment.
