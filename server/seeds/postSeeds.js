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
  },
  {
    id: 6,
    title: 'Mastering State Management with Redux Toolkit',
    content: `Transitioning our React app from vanilla Redux to **Redux Toolkit** was a game-changer.

### Why Redux Toolkit?
- **Reduced boilerplate** 🔥
- **Built-in immutability** with Immer
- **Simplified async logic** using \`createAsyncThunk\`

### Sample Slice Creation:
\`\`\`javascript
const userSlice = createSlice({
  name: 'user',
  initialState: { 
    profile: null, 
    loading: false, 
    error: null 
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    }
  }
});
\`\`\`

Performance improved by **40%** - less code, more predictability! 💡

Anyone else moved away from traditional Redux patterns?`,
    user_id: 1,
    createdAt: new Date('2024-02-20T11:00:00'),
    updatedAt: new Date('2024-02-20T11:00:00')
  },
  {
    id: 7,
    title: 'WebSocket Real-Time Collaboration: Building a Multiplayer Code Editor',
    content: `Just completed a **real-time collaborative code editor** using **Socket.IO** and **React**.

### Tech Stack:
- **Backend**: Node.js with Express
- **WebSockets**: \`Socket.IO\`
- **Frontend**: React with Operational Transforms

### Key Challenges:
- Handling **concurrent edits**
- Implementing **cursor tracking**
- Managing **connection states**

### Sample Socket Event Handler:
\`\`\`javascript
socket.on('code_change', (changes) => {
  // Apply operational transforms
  const updatedCode = applyChanges(currentCode, changes);
  broadcastToCollaborators(updatedCode);
});
\`\`\`

**Fascinating discovery**: Real-time sync is hard, but incredibly satisfying when it works! 🚀

Who else is exploring collaborative editing technologies?`,
    user_id: 2,
    createdAt: new Date('2024-02-25T14:45:00'),
    updatedAt: new Date('2024-02-25T14:45:00')
  },
  {
    id: 8,
    title: 'TypeScript: From Frustration to Productivity',
    content: `My team's journey from **JavaScript** to **TypeScript** - lessons learned and productivity gains.

### Initial Pain Points:
- **Steep learning curve** 📚
- Configuring **tsconfig.json**
- Handling **complex type definitions**

### Productivity Boosters:
- **Autocomplete everywhere**
- Catching errors at **compile-time**
- **Self-documenting** code

### Advanced Type Magic:
\`\`\`typescript
type APIResponse<T> = {
  data: T;
  status: 'success' | 'error';
  timestamp: number;
};

type UserProfile = {
  id: number;
  name: string;
  email: string;
};

const processUserData = (response: APIResponse<UserProfile>) => {
  // Type-safe processing
};
\`\`\`

**Type coverage**: 0% → 92% 📈
**Bugs caught early**: Reduced by 60% 🐛

Embracing the type system, one interface at a time! 💪`,
    user_id: 3,
    createdAt: new Date('2024-03-01T09:30:00'),
    updatedAt: new Date('2024-03-01T09:30:00')
  },
  {
    id: 9,
    title: 'Performance Profiling in React: Beyond the Basics',
    content: `Deep dive into **React Performance Optimization** using Chrome DevTools and custom profiling.

### Optimization Techniques:
- **Memoization** with \`useMemo\` and \`useCallback\`
- Identifying **unnecessary re-renders**
- **Code splitting** strategies

### Profiling Example:
\`\`\`javascript
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyComputation(data);
  }, [data]);

  return <RenderComponent data={processedData} />;
});
\`\`\`

### Key Metrics:
- **Initial render**: 450ms → 120ms
- **Re-render time**: 210ms → 35ms
- **Bundle size**: Reduced by 40% 📉

Performance is a feature, not an afterthought! 🚀

Who else geeks out about web performance?`,
    user_id: 4,
    createdAt: new Date('2024-03-05T16:15:00'),
    updatedAt: new Date('2024-03-05T16:15:00')
  },
  {
    id: 10,
    title: 'Migrating a Monolith to Microservices: Lessons from the Trenches',
    content: `Our epic journey of breaking down a **massive Node.js monolith** into **microservices**.

### Architectural Evolution:
- **Initial Monolith**: 50k lines of code 😱
- **Communication**: REST → \`gRPC\`
- **Deployment**: Kubernetes + Helm Charts

### Challenges Overcome:
- **Distributed transactions**
- **Service discovery**
- **Eventual consistency**

### Sample gRPC Service:
\`\`\`protobuf
syntax = "proto3";

service UserService {
  rpc CreateUser(CreateUserRequest) returns (User) {}
  rpc GetUser(GetUserRequest) returns (User) {}
}
\`\`\`

### Results:
- **Deployment frequency**: Weekly → Multiple times daily
- **Scaling**: Granular and efficient
- **Development velocity**: 📈 Increased by 70%

Microservices: Not a silver bullet, but powerful when done right! 💡

Microservice architects, share your war stories!`,
    user_id: 5,
    createdAt: new Date('2024-03-10T11:45:00'),
    updatedAt: new Date('2024-03-10T11:45:00')
  }
];

// Bulk create all posts
const seedPosts = () => Post.bulkCreate(postData, { individualHooks: true });

module.exports = seedPosts;
