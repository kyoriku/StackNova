# StackNova
*A full-stack developer community platform built with React and Node.js, enabling technical discussions with Markdown support and optimized data retrieval*

## Built With  
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=TailwindCSS&logoColor=white)](https://tailwindcss.com/docs/installation/using-vite)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154.svg?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest/docs/framework/react/installation)
[![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7.svg?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D.svg?style=for-the-badge&logo=Redis&logoColor=white)](https://redis.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/guide/)

## Table of Contents
- [Description](#description)
  - [Deployed Site](#deployed-site)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technical Details](#technical-details)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)

## Description
StackNova is a full-stack developer community and Q&A platform that allows developers to ask questions, share knowledge, and engage in technical discussions. Built using a React frontend and Node.js/Express backend with MySQL database, the platform implements best practices for performance, security, and user experience.

The application features secure authentication with HTTP-only cookies, advanced search capabilities, and a responsive UI with light/dark modes powered by Tailwind CSS. StackNova leverages server-side caching with Redis and client-side optimizations with TanStack Query to deliver exceptional performance. The platform supports Markdown formatting for posts and comments, allowing developers to share code snippets with syntax highlighting through prism-react-renderer.

### Deployed Site
Visit the live website at: [https://stacknova.ca](https://stacknova.ca)

## Features
- **Secure Auth with HTTP-only Cookies**: Robust authentication system with protected routes and secure session management.
  * Verification via API endpoint using HTTP-only cookies
  * Client-side auth context for state management
  * Server-side session storage with express-session
- **Advanced Search**: Find posts by title, content, author, date, or comments.
- **Pagination**: Displays 10 posts per page for better navigation.
- **Responsive UI**: Adaptive design with light/dark modes powered by Tailwind CSS.
- **Server-Side Caching**: Speeds up responses using Redis.
- **Client-Side Caching & Prefetching**: Optimized data fetching with TanStack Query.
- **Rate Limiting**: Protects against excessive requests using express-rate-limit.
  * Restricts login attempts
  * Limits post submissions
  * Controls comment frequency
- **Validation & Sanitization**: Ensures clean and safe input with express-validator and sanitize-html.
  * Preserves Markdown formatting
  * Prevents XSS attacks
- **Rich Icons**: Clean and modern icons provided by lucide-react.
- **Markdown Support**: Write and format posts with react-markdown.
  * Syntax highlighting via prism-react-renderer
  * Code block formatting
- **Performance Benchmarking**: Measures database vs. cache query times using perf_hooks.
  * Provides insights into performance improvements
  * Helps identify bottlenecks
- **User Profiles**: View comprehensive user statistics.
  * Post and comment counts
  * Account creation date
  * Activity tracking
- **UUID-based IDs**: Enhances security by preventing:
  * Enumeration attacks
  * URL tampering
  * Data leakage
  * Business information exposure

## Screenshots
![StackNova-Home](public/screenshots/1-StackNovaHome.jpg)
![StackNova-Question](public/screenshots/2-StackNovaQuestion.jpg)
![StackNova-Dashboard](public/screenshots/3-StackNovaDashboard.jpg)

## Technical Details
StackNova is built with a modern tech stack implementing several advanced patterns and features:

* **Frontend Architecture**:
  * React with functional components and hooks
  * Context API for state management
  * TanStack Query for data fetching and caching
  * Tailwind CSS for responsive styling
  * Dark/light mode theming
  * Code splitting for optimized loading
* **Backend Structure**:
  * Node.js with Express for API endpoints
  * API-focused architecture separating concerns
  * Models for data structure and database interaction
  * Controllers for business logic
  * RESTful API design principles
  * Middleware for authentication, validation, and error handling
  * Rate limiting for security
* **Database Design**:
  * MySQL with Sequelize ORM
  * User Model: Authentication and profile information
  * Post Model: Title, content, and user relationships
  * Comment Model: Content with user and post relationships
  * Efficient indexing for performance
* **Authentication System**:
  * HTTP-only cookies for secure sessions
  * Express-session for session management
  * Bcrypt for password hashing
  * Protected routes using middleware
  * Session persistence with connect-session-sequelize
* **Performance Optimizations**:
  * Redis for server-side caching
  * Query optimization
  * Client-side data prefetching
  * Lazy loading components
* **Security Features**:
  * XSS prevention through sanitization
  * Rate limiting
  * Input validation
  * Secure cookie configuration
  * UUID-based identifiers

## Installation
To run this project locally:

1. Clone the repository
    ```bash
    git clone https://github.com/kyoriku/stacknova.git
    ```

2. Navigate to the project directory
    ```bash
    cd stacknova
    ```

3. Install dependencies for both client and server automatically
    ```bash
    npm install
    ```
    This will install the dependencies for both client and server thanks to the custom install script in the root package.json.

4. Create a `.env` file in the server directory with the following variables
    ```bash
    # Database Configuration
    DB_NAME='stacknova_db'
    DB_USER='your_MySQL_username'
    DB_PASSWORD='your_MySQL_password'
    
    # Session Configuration
    SESSION_SECRET='your_session_secret'
    
    # Redis Configuration (if using Redis locally)
    REDIS_URL='redis://localhost:6379'
    
    # Node Environment
    NODE_ENV='development'
    ```

5. Set up the database
    ```bash
    mysql -u root -p
    source db/schema.sql
    ```

6. Set up Redis (required for caching)
    ```bash
    # Install Redis if not already installed
    # For macOS:
    brew install redis
    
    # For Ubuntu:
    sudo apt-get install redis-server
    
    # Start Redis server
    redis-server
    ```

7. (Optional) Seed the database
    ```bash
    npm run seed
    ```

## Usage
1. Start the development server (both frontend and backend)
    ```bash
    npm run dev
    ```

2. Access the application at `http://localhost:3000`

3. Create an account to:
   * Ask and answer questions
   * Manage your content through the dashboard
   * View your activity history

## Roadmap
- [x] Favicon
- [ ] Improve accessibility
- [x] Modularize code
- [ ] Meta tags for SEO
- [ ] Implement answer acceptance feature
- [ ] Add user reputation system
- [ ] Integrate social login options
- [ ] Add real-time notifications

## Contributing
Contributions are welcome! Here are ways you can help:

1. Fork the repository
2. Create a feature branch
    ```bash
    git checkout -b feature/YourFeature
    ```
3. Make your changes - this could include:
    * Adding new features
    * Improving the UI/UX
    * Optimizing database queries
    * Enhancing security
    * Bug fixes
4. Commit your changes
5. Push to your branch
6. Open a Pull Request

Please ensure your contributions:
* Follow the existing code style
* Include appropriate error handling
* Test all changes locally
* Include clear descriptions in your pull request

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=mit)](https://opensource.org/licenses/MIT)

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license - see the LICENSE file for details.

## Questions
For any questions, feel free to email me at hello@austingraham.ca.