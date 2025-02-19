// Seed data for creating initial blog posts with timestamps and user relationships
const { Post } = require('../models');

const postData = [
  {
    id: 1,
    title: 'My Journey Learning Machine Learning: From Zero to First Model',
    content: `Just wrapped up my first month of diving into ML using the **Boston Housing dataset**.

After learning Python basics and data manipulation with **pandas**, I built my first \`RandomForestRegressor\` model achieving an R-squared score of **0.84**.

The most fascinating discovery was that **number of rooms** had a stronger correlation with price (**0.7**) than **distance to employment centers** (**0.5**).

### Key Lessons Learned:
- Watch out for **multicollinearity**
- Implement proper **feature scaling** _(improved MSE from 21.6 to 15.3)_
- Always use **cross-validation**

Planning to try **gradient boosting** next - what was your first ML project like?`,
    user_id: 1,
    createdAt: new Date('2024-01-31T10:15:00'),
    updatedAt: new Date('2024-01-31T10:15:00')
  },
  {
    id: 2,
    title: 'Express.js API Tips I Wish I Knew Earlier',
    content: `Just improved our **e-commerce platform's API** with some game-changing optimizations.

### Key Improvements:
- Implemented **rate limiting** with Redis:
  \`\`\`js
  const rateLimit = require('express-rate-limit');
  const RedisStore = require('rate-limit-redis');
  
  app.use(rateLimit({
    store: new RedisStore({ client: redisClient }),
    windowMs: 60 * 60 * 1000,
    max: (req) => req.isAuthenticated ? 1000 : 100
  }));
  \`\`\`
- Added **centralized error handling** with correlation IDs
- **Response compression** _(70% smaller payloads)_
- **Redis caching** _(40% less DB load)_
- **PM2 cluster mode** _(2.5x better throughput)_

🚀 API response time dropped from **250ms to 85ms**. Next up: **GraphQL** - anyone interested in the implementation details?`,
    user_id: 2,
    createdAt: new Date('2024-02-04T15:30:00'),
    updatedAt: new Date('2024-02-04T15:30:00')
  },
  {
    id: 3,
    title: 'How We Reduced Our React Bundle Size by 60%',
    content: `Finally tackled our **SaaS dashboard's bundle size** issues.

### Initial State:
- **2.8MB bundle** 🚨
- **3.2s First Paint**

### Key Fixes:
- **Replaced Moment.js** (472KB) → Switched to **date-fns** ✅
- **Replaced Charting Library** (685KB) → Switched to **Recharts** 📉
- Implemented **Code Splitting** with React.lazy():
  \`\`\`js
  const Chart = React.lazy(() => import('./Chart'));
  
  function Dashboard() {
    return (
      <Suspense fallback={<Loading />}>
        <Chart />
      </Suspense>
    );
  }
  \`\`\`

### Results:
- **New Bundle Size: 1.1MB** 🎉
- **First Paint: 1.1s** ⚡
- **Lighthouse Score: 72 → 94** 🔥

Anyone tried **module federation** for micro-frontends?`,
    user_id: 3,
    createdAt: new Date('2024-02-08T09:45:00'),
    updatedAt: new Date('2024-02-08T09:45:00')
  },
  {
    id: 4,
    title: 'Debugging CSS Grid in Real-World Projects',
    content: `Spent last week moving our **dashboard to CSS Grid** and found some interesting **Safari quirks**.

### Fixes & Lessons Learned:
- **Fixed auto-placement issues**:
  \`\`\`css
  .grid-container {
    display: grid;
    grid-auto-flow: row;
    gap: 10px;
  }
  \`\`\`
- **Flattened nested grids** (3+ levels caused layout thrashing)
- **Used CSS Custom Properties** and \`clamp()\` for better responsiveness:
  \`\`\`css
  .grid-item {
    width: clamp(200px, 50%, 400px);
  }
  \`\`\`

🚀 **Layout shifts reduced by 94%**. Now exploring **Container Queries** - anyone using them in production yet?`,
    user_id: 4,
    createdAt: new Date('2024-02-12T14:20:00'),
    updatedAt: new Date('2024-02-12T14:20:00')
  },
  {
    id: 5,
    title: 'The Hidden Costs of Not Writing Tests',
    content: `A production incident with our **authentication flow** finally pushed us to take testing seriously.

### 6 Weeks Later:
- **Test coverage**: **12% → 85%** 📈
- **Tools used**: Jest, React Testing Library, Cypress
- **CI/CD**: GitHub Actions + Parallel test execution _(CI time: 45 → 12 minutes)_
- **Visual regression testing** with Percy
- **TypeScript catching 23% of issues at compile time** ✅

### Example Jest Test:
  \`\`\`js
  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });
  \`\`\`

🚀 Initial setup took **80 dev hours**, but **saved 120 hours** of bug fixing in the first month. 

Looking into **property-based testing** next - anyone tried it with React?`,
    user_id: 5,
    createdAt: new Date('2024-02-15T16:30:00'),
    updatedAt: new Date('2024-02-15T16:30:00')
  }
];

// Bulk create all posts
const seedPosts = () => Post.bulkCreate(postData, { individualHooks: true });

module.exports = seedPosts;
