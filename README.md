# javascript-2

JavaScript 2 Course Assignment - Pulse

<img width="1106" height="566" alt="image" src="https://github.com/user-attachments/assets/1cf29871-9ac5-46c3-b273-d1d774b487cf" />


🔗 **Live Demo:** [https://pulse-2026.netlify.app/](https://pulse-2026.netlify.app/)

## Description

A social media application built with vanilla JavaScript that allows users to create accounts, manage posts, and interact with profiles. This project demonstrates modern JavaScript development practices including API integration, authentication, and dynamic content rendering.

## Features

- User authentication (login/register)
- Create, read, and display posts
- User profile management
- Feed with post listings
- Form validation
- Responsive design

## Project Structure

```
├── index.html              # Landing page
├── pages/                  # Application pages
│   ├── feed.html          # Main feed with posts
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── post.html          # Individual post view
│   └── profile.html       # User profile
├── js/                     # JavaScript files
│   ├── main.js            # Main entry point
│   ├── api/               # API integration
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── config.js      # API configuration
│   │   ├── posts.js       # Post endpoints
│   │   └── profiles.js    # Profile endpoints
│   ├── modules/           # Reusable modules
│   │   ├── formValidation.js
│   │   ├── renderPostCard.js
│   │   ├── renderPostList.js
│   │   └── renderProfileHeader.js
│   └── utils/             # Utility functions
│       ├── authGuard.js   # Route protection
│       ├── getParam.js    # URL parameter handling
│       ├── showMessage.js # User notifications
│       └── storage.js     # Local storage management
├── css/                   # Stylesheets
│   ├── reset.css         # CSS reset
│   ├── global.css        # Global styles
│   ├── layout.css        # Layout styles
│   ├── components.css    # Component styles
│   └── forms.css         # Form styles
└── assets/               # Static assets

```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- REST API integration
- Local Storage

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
3. Browse posts on the feed page
4. Create new posts
5. View and manage your profile

## Development

The application follows a modular structure with separation of concerns:

- **API layer**: Handles all API communications
- **Modules**: Reusable UI components and rendering logic
- **Utils**: Helper functions for common tasks
- **CSS**: Organized stylesheet architecture

## License

This project is created as part of a course assignment.
