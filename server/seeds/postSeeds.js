// Seed data for creating initial blog posts with timestamps and user relationships
const { Post } = require('../models');

const postData = [
  {
    title: 'My Journey Learning Machine Learning: From Zero to First Model',
    content: "Just wrapped up my first month of diving into ML using the Boston Housing dataset. After learning Python basics and data manipulation with pandas, I built my first RandomForestRegressor model achieving an R-squared score of 0.84. The most fascinating discovery was that number of rooms had a stronger correlation with price (0.7) than distance to employment centers (0.5). Key lessons learned: watch out for multicollinearity, implement proper feature scaling (improved MSE from 21.6 to 15.3), and always use cross-validation. Planning to try gradient boosting next - what was your first ML project like?",
    user_id: 1,
    createdAt: new Date('2024-01-31T10:15:00'),
    updatedAt: new Date('2024-01-31T10:15:00')
  },
  {
    title: 'Express.js API Tips I Wish I Knew Earlier',
    content: "Just improved our e-commerce platform's API with some game-changing optimizations. We implemented rate limiting with Redis (100 requests/hour for public, 1000/hour for authenticated users), reducing spam by 95%. Added centralized error handling with correlation IDs and proper logging. The big wins came from response compression (70% smaller payloads), Redis caching (40% less DB load), and PM2 cluster mode (2.5x better throughput). Result? API response time dropped from 250ms to 85ms. Next up is GraphQL - anyone interested in the implementation details?",
    user_id: 2,
    createdAt: new Date('2024-02-04T15:30:00'),
    updatedAt: new Date('2024-02-04T15:30:00')
  },
  {
    title: 'How We Reduced Our React Bundle Size by 60%',
    content: "Finally tackled our SaaS dashboard's bundle size issues. Initial state: 2.8MB bundle with 3.2s First Paint. Main culprits were moment.js (472KB) and our charting library (685KB). Implemented code splitting with React.lazy(), switched to date-fns and Recharts, and properly configured tree shaking. New bundle is 1.1MB, First Paint down to 1.1s, and Lighthouse score up from 72 to 94. Key takeaway: analyze your bundle first and don't be afraid to replace popular packages with lighter alternatives. Anyone tried module federation for micro-frontends?",
    user_id: 3,
    createdAt: new Date('2024-02-08T09:45:00'),
    updatedAt: new Date('2024-02-08T09:45:00')
  },
  {
    title: 'Debugging CSS Grid in Real-World Projects',
    content: "Spent last week moving our dashboard to CSS Grid and found some interesting Safari quirks. Fixed auto-placement issues by switching from grid-auto-flow: dense to row with explicit gaps. Discovered that nested grids (3+ levels) were causing layout thrashing, so we flattened the structure using grid-template-areas. Implemented a mobile-first approach with CSS custom properties and clamp() for column widths, reducing layout shifts by 94%. Now exploring Container Queries - anyone using them in production yet?",
    user_id: 4,
    createdAt: new Date('2024-02-12T14:20:00'),
    updatedAt: new Date('2024-02-12T14:20:00')
  },
  {
    title: 'The Hidden Costs of Not Writing Tests',
    content: "A production incident with our authentication flow finally pushed us to take testing seriously. Six weeks later, we've gone from 12% to 85% test coverage using Jest, React Testing Library, and Cypress. Added GitHub Actions for CI/CD, visual regression testing with Percy, and parallel test execution (CI time down from 45 to 12 minutes). Initial setup took 80 dev hours but saved us 120 hours of bug fixing in the first month. TypeScript is catching 23% of issues at compile time now. Looking into property-based testing next - anyone tried it with React?",
    user_id: 5,
    createdAt: new Date('2024-02-15T16:30:00'),
    updatedAt: new Date('2024-02-15T16:30:00')
  }
];


// Bulk create all posts
const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
