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
    title: 'Setting up effective cross-browser testing with Playwright',
    content: `I've been struggling with inconsistent UI behavior across different browsers and need a better testing solution.

After trying both Cypress and Playwright, I settled on **Playwright** for automated cross-browser testing. Here's what made the difference for me:

\`\`\`javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
    {
      name: 'mobile chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile safari',
      use: {
        browserName: 'webkit',
        ...devices['iPhone 12'],
      },
    },
  ],
};
\`\`\`

The key advantages I found were:
- Tests run on all major browsers (Chrome, Firefox, Safari) with a single command
- Built-in mobile device emulation
- Much faster parallel execution compared to Cypress
- Better handling of iframes and multiple tabs

Has anyone else made this transition? Any tips for structuring tests to maximize browser compatibility detection?`,
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
    title: 'Implementing secure SSO authentication for enterprise applications',
    content: `Our team is building an enterprise web application that requires secure Single Sign-On (SSO) authentication. We're struggling to choose between several options and implement it correctly.

### Requirements:
- Support for SAML 2.0 and OpenID Connect
- Role-based access control
- Audit logging for compliance
- Works with React frontend and Node.js backend
- Enterprise client requirements (Azure AD, Okta, Google Workspace)

Here's my current approach for handling OIDC:

\`\`\`javascript
// Server-side OAuth handling with Passport.js
const passport = require('passport');
const { Strategy } = require('passport-oauth2');

passport.use(new Strategy({
    authorizationURL: process.env.OAUTH_AUTH_URL,
    tokenURL: process.env.OAUTH_TOKEN_URL,
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL,
    scope: ['openid', 'profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Get user info using the token
      const userInfo = await getUserInfo(accessToken);
      
      // Find or create user in our database
      let user = await User.findOne({ email: userInfo.email });
      
      if (!user) {
        // Create new user with info from SSO provider
        user = await User.create({
          email: userInfo.email,
          name: userInfo.name,
          // Map roles from provider to our system
          roles: mapProviderRolesToSystem(userInfo.roles)
        });
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
\`\`\`

Has anyone integrated with multiple SSO providers for enterprise clients? What are the key challenges? Are there any libraries or approaches that made this significantly easier?

Also, how do you handle role mapping between the identity provider and your application's permission system?`,
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
    title: 'Strategies for handling complex form validation in React',
    content: `I'm working on an enterprise application with complex multi-step forms, and I'm looking for the best approach to handle validation, error reporting, and state management.

Currently, we're using a combination of Formik, Yup, and custom validation, but it's becoming unwieldy as our forms grow more complex.

### Current implementation:

\`\`\`jsx
// Current form implementation with Formik + Yup
const validationSchema = Yup.object({
  personalInfo: Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  }),
  address: Yup.object({
    street: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    zipCode: Yup.string()
      .matches(/^\\d{5}(-\\d{4})?$/, 'Invalid ZIP code')
      .required('Required'),
  }),
  // Many more nested objects with complex validation rules
});

// Component using Formik
function ComplexForm() {
  return (
    <Formik
      initialValues={{
        personalInfo: { firstName: '', lastName: '', email: '' },
        address: { street: '', city: '', state: '', zipCode: '' },
        // More fields...
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <>
              <Field name="personalInfo.firstName" />
              <ErrorMessage name="personalInfo.firstName" />
              {/* More fields... */}
            </>
          )}
          
          {/* Step 2: Address */}
          {currentStep === 2 && (
            <>
              <Field name="address.street" />
              <ErrorMessage name="address.street" />
              {/* More fields... */}
            </>
          )}
          
          {/* Navigation buttons */}
          <button type="button" onClick={handlePrevStep}>
            Previous
          </button>
          {currentStep < totalSteps ? (
            <button type="button" onClick={handleNextStep}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </Form>
      )}
    </Formik>
  );
}
\`\`\`

### Problems we're facing:
1. Validating fields conditionally based on values in other fields
2. Handling validation across multiple steps 
3. Performance issues with large forms (200+ fields across all steps)
4. Error summarization for accessibility
5. Saving form progress (drafts)

I've been looking at alternatives like React Hook Form with Zod, but I'm not sure if it'll solve our specific issues.

Has anyone successfully implemented complex multi-step forms at scale? What libraries or patterns worked well? Any specific performance optimizations you found helpful?`,
    user_id: users[4].id,
    createdAt: new Date('2024-03-10T11:45:00'),
    updatedAt: new Date('2024-03-10T11:45:00')
  }
  ];

  const posts = await Post.bulkCreate(postData, { individualHooks: true });
  return posts;
};

module.exports = seedPosts;