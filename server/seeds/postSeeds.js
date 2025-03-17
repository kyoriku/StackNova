// Seed data for creating initial questions with timestamps and user relationships
const { Post, User } = require('../models');

const seedPosts = async (users) => {
  const postData = [{
    title: 'How to optimize large datasets with React Query and pagination?',
    content: `I'm building a dashboard that displays **thousands of records** from our MySQL database, and I'm running into performance issues.

Currently using **TanStack Query v4** with pagination, but the UI freezes when users rapidly switch between pages.

My current implementation:

\`\`\`javascript
const { data, isLoading } = useQuery({
  queryKey: ['items', page],
  queryFn: () => fetchItems(page, 50),
  keepPreviousData: true
});
\`\`\`

I've tried:
- Setting \`keepPreviousData: true\`
- Implementing \`useMemo\` for rendered items
- Adding \`staleTime: 60000\` to reduce refetches

Has anyone solved similar issues with large datasets? Would **virtualization** help in this case? Are there better patterns for handling data-heavy UIs?`,
    user_id: users[0].id,
    createdAt: new Date('2024-01-31T10:15:00'),
    updatedAt: new Date('2024-01-31T10:15:00')
  },
  {
    title: 'What\'s the best approach for implementing rate limiting in Express.js APIs?',
    content: `Our **Express.js API** is getting hammered with requests, and I need to implement a solid rate limiting solution.

### Current Setup:
- Express.js backend
- MySQL database with Sequelize
- Deployed on AWS EC2

I've been researching a few options:

\`\`\`js
// Option 1: express-rate-limit with Redis
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

app.use(rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 60 * 60 * 1000,
  max: (req) => req.isAuthenticated ? 1000 : 100
}));

// Option 2: Using IP-based limiting with in-memory storage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
\`\`\`

I'm curious:
1. Has anyone used Redis as the store for rate limiting in production?
2. Should I apply different limits for authenticated vs. unauthenticated users?
3. Is there a way to implement gradual throttling instead of hard limits?
4. Any other libraries or approaches I should consider?`,
    user_id: users[1].id,
    createdAt: new Date('2024-02-04T15:30:00'),
    updatedAt: new Date('2024-02-04T15:30:00')
  },
  {
    title: 'Quick Tip: Test your app on real devices with Vite\'s --host flag',
    content: `Just discovered a really convenient way to test your Vite app on actual mobile devices instead of relying on Chrome DevTools.

Add the \`--host\` flag to your Vite dev script in \`package.json\`:

\`\`\`json
{
  "scripts": {
    "dev": "vite --host"
  }
}
\`\`\`

When you run \`npm run dev\`, Vite will now expose your app to your local network and show you the IP address:

\`\`\`
  VITE v4.4.9  ready in 752 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.5:5173/
\`\`\`

Just visit that network URL on any device connected to the same wifi and you can test your app on real devices!

This has been a game-changer for quickly checking responsive designs on actual phones and tablets instead of just simulating them in DevTools.

**Bonus tip**: Combine with BrowserSync for auto-reloading across all connected devices.`,
    user_id: users[2].id,
    createdAt: new Date('2024-02-08T09:45:00'),
    updatedAt: new Date('2024-02-08T09:45:00')
  },
  {
    title: 'How do you handle complex CSS Grid layouts for different viewport sizes?',
    content: `I'm struggling with a **responsive dashboard** that uses CSS Grid. It works well on desktop but falls apart on mobile and tablet views.

My current approach:

\`\`\`css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}

/* Media query for tablets */
@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Media query for mobile */
@media (max-width: 576px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

But I have complex widgets that need to span different columns/rows based on the viewport.

Questions:
1. Is it better to use \`grid-template-areas\` for each breakpoint?
2. How do you handle grid items that need to be in completely different positions on mobile vs. desktop?
3. Any tools or methodologies to visualize and plan complex responsive grid layouts?
4. Has anyone used CSS Container Queries for dashboard layouts?

Would love to see examples of how others handle complex responsive grids!`,
    user_id: users[3].id,
    createdAt: new Date('2024-02-12T14:20:00'),
    updatedAt: new Date('2024-02-12T14:20:00')
  },
  {
    title: 'What\'s your testing strategy for a full-stack MERN application?',
    content: `Our team is developing a new **MERN stack application** and we're debating the best testing approach.

### Current Tech Stack:
- React frontend with TanStack Query
- Express.js backend
- MongoDB with Mongoose
- TypeScript throughout

### Testing Concerns:
- **Unit tests**: Jest for isolated functions/components?
- **Integration tests**: Testing API endpoints and database interactions?
- **E2E tests**: Cypress or Playwright?
- **Test coverage**: What's a realistic goal for a small team?

Our current plan is:

\`\`\`javascript
// Example Jest test for a React component
test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});

// Example API test with Supertest
describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});
\`\`\`

What's your testing pyramid look like for MERN applications? Any recommendations for balancing thorough testing with development velocity?`,
    user_id: users[4].id,
    createdAt: new Date('2024-02-15T16:30:00'),
    updatedAt: new Date('2024-02-15T16:30:00')
  },
  {
    title: 'How to efficiently manage global state in a large React application?',
    content: `Our React application has grown significantly, and we're facing challenges with state management. Currently using a mix of **Context API** and **Redux**, but it's becoming unwieldy.

### Current Issues:
- **Context API** causing unnecessary re-renders
- **Redux** requiring too much boilerplate
- Performance degradation with large state changes
- No clear pattern for async operations

I'm considering these options:

\`\`\`javascript
// Option 1: Redux Toolkit
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

// Option 2: Zustand
const useUserStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,
  login: async (credentials) => {
    set({ loading: true });
    try {
      const profile = await loginApi(credentials);
      set({ profile, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));
\`\`\`

Has anyone migrated from Redux to a newer state management solution like Zustand, Jotai, or Recoil? What were your experiences?

Should we break our app into more isolated components with their own state? Or is a global state solution still the way to go?`,
    user_id: users[0].id,
    createdAt: new Date('2024-02-20T11:00:00'),
    updatedAt: new Date('2024-02-20T11:00:00')
  },
  {
    title: 'Best practices for implementing WebSockets in a MERN stack application?',
    content: `I'm adding real-time features to our **MERN stack application** and need advice on WebSocket implementation.

### Requirements:
- Chat functionality between users
- Real-time notifications
- Live updates for collaborative features
- Must scale to thousands of concurrent connections

### Current plan:
- **Socket.IO** on the backend with Express
- **Socket.IO Client** in React components
- Redis for scaling across multiple servers

\`\`\`javascript
// Server setup
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  // Authenticate user from JWT
  const user = authenticateUserFromToken(socket.handshake.auth.token);
  
  // Join user to their own room
  socket.join(\`user:\${user.id}\`);
  
  socket.on('send_message', (data) => {
    // Store message in DB
    saveMessageToDatabase(data);
    // Broadcast to recipient
    socket.to(\`user:\${data.recipientId}\`).emit('receive_message', data);
  });
});
\`\`\`

Questions:
1. Is Socket.IO the right choice, or should I use plain WebSockets?
2. How to handle authentication with WebSockets?
3. Best practices for organizing WebSocket events and handlers?
4. Strategies for testing WebSocket functionality?
5. How to efficiently scale WebSockets with Redis or other solutions?

Any real-world experiences or gotchas to be aware of?`,
    user_id: users[1].id,
    createdAt: new Date('2024-02-25T14:45:00'),
    updatedAt: new Date('2024-02-25T14:45:00')
  },
  {
    title: 'Migrating from JavaScript to TypeScript in a MERN stack: Worth it?',
    content: `Our team is considering migrating our **MERN stack application** from JavaScript to TypeScript. The codebase is about 40K lines of JS code across frontend and backend.

### Potential Benefits:
- Better IDE support and autocompletion
- Catching type-related bugs earlier
- Improved documentation through types
- Better maintenance for the long term

### Concerns:
- Learning curve for team members
- Time investment for migration
- Potential performance impact during development
- Integration with existing libraries

If we proceed, we'd start with this approach:

\`\`\`typescript
// Example of typing a Mongoose model
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
\`\`\`

For those who've gone through a similar migration:
1. Was it worth the effort?
2. What migration strategy worked best? (Gradual vs. all at once)
3. Any unexpected challenges or benefits?
4. How did it affect your development velocity long-term?
5. Recommended tooling or resources for the migration process?`,
    user_id: users[2].id,
    createdAt: new Date('2024-03-01T09:30:00'),
    updatedAt: new Date('2024-03-01T09:30:00')
  },
  {
    title: 'How to identify and fix performance bottlenecks in React?',
    content: `Our React application is experiencing **significant performance issues**, especially on pages with complex data visualization and forms.

### Current Symptoms:
- Slow initial render (3-5 seconds)
- UI freezes during certain interactions
- Memory usage grows over time
- Some components re-render too frequently

I've started using the React DevTools Profiler and found some issues, but I'm looking for a more systematic approach.

\`\`\`javascript
// Example of a component that might be problematic
function DataGrid({ items, onSelect }) {
  const [sortedItems, setSortedItems] = useState([]);
  
  // This runs on every render
  const processedItems = items.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
    fullName: \`\${item.firstName} \${item.lastName}\`
  }));
  
  useEffect(() => {
    // Complex sorting logic here
    setSortedItems(sortItems(processedItems));
  }, [items, processedItems]);
  
  return (
    <Table data={sortedItems} onRowClick={onSelect} />
  );
}
\`\`\`

Questions:
1. What tools and methods do you use to identify React performance issues?
2. Common patterns that lead to performance problems?
3. Best practices for optimizing components with heavy data processing?
4. When should you use \`React.memo\`, \`useMemo\`, and \`useCallback\`?
5. How to prevent memory leaks in React applications?

Has anyone successfully solved similar performance issues? What was your approach?`,
    user_id: users[3].id,
    createdAt: new Date('2024-03-05T16:15:00'),
    updatedAt: new Date('2024-03-05T16:15:00')
  },
  {
    title: 'Quick Tip: How to rename a GitHub repository',
    content: `For beginners who might be wondering: it's actually very simple to rename a GitHub repository, and GitHub automatically handles redirects from the old name!

### Steps to rename a repository:

1. Go to your repository on GitHub
2. Click on "Settings" in the top navigation bar
3. Under the "General" section (should be open by default), find the "Repository name" field
4. Enter the new name for your repository
5. Click the "Rename" button

**Important things to know:**

- GitHub will automatically redirect traffic from the old URL to the new one, so links won't break
- You'll need to update your local repository's remote URL:

\`\`\`bash
# Check current remote URL
git remote -v

# Update the remote URL
git remote set-url origin https://github.com/username/new-repo-name.git
\`\`\`

- If you have GitHub Pages enabled, the site will automatically be available at the new URL
- Any project collaborators will need to update their remote URLs as well

This is much easier than creating a new repository and manually migrating everything over!`,
    user_id: users[4].id,
    createdAt: new Date('2024-03-10T11:45:00'),
    updatedAt: new Date('2024-03-10T11:45:00')
  }
  ];

  const posts = await Post.bulkCreate(postData, { individualHooks: true });
  return posts;
};

module.exports = seedPosts;