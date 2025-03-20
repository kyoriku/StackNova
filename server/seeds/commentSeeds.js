// Seed data for creating initial comments with timestamps and relationships
const { Comment } = require('../models');

const seedComments = async (users, posts) => {
  const commentData = [
  {
    comment_text: "For large datasets with React Query, I'd recommend using virtualization with either react-window or react-virtualized. We had a similar issue and combining React Query's `keepPreviousData` with virtualization reduced our render times from seconds to milliseconds. Here's what worked for us:\n\n```javascript\nimport { useVirtualizer } from '@tanstack/react-virtual';\n\nfunction VirtualizedList({ data }) {\n  const parentRef = useRef(null);\n  \n  const rowVirtualizer = useVirtualizer({\n    count: data.length,\n    getScrollElement: () => parentRef.current,\n    estimateSize: () => 50,\n  });\n  \n  return (\n    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>\n      <div\n        style={{\n          height: `${rowVirtualizer.getTotalSize()}px`,\n          position: 'relative',\n        }}\n      >\n        {rowVirtualizer.getVirtualItems().map((virtualRow) => (\n          <div\n            key={virtualRow.index}\n            style={{\n              position: 'absolute',\n              top: 0,\n              left: 0,\n              width: '100%',\n              height: `${virtualRow.size}px`,\n              transform: `translateY(${virtualRow.start}px)`,\n            }}\n          >\n            {data[virtualRow.index].name}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n```\n\nAlso, consider implementing cursor-based pagination instead of offset pagination if your data model allows it. It's much more efficient for large datasets.",
    user_id: users[1].id,
    post_id: posts[0].id,

  },

  {
    comment_text: "The issue is in your dependency array. You're including `processedItems` which is recreated every render, causing an infinite loop. Change your code to this:\n\n```javascript\nfunction DataGrid({ items, onSelect }) {\n  const [sortedItems, setSortedItems] = useState([]);\n  \n  const processedItems = useMemo(() => {\n    return items.map(item => ({\n      ...item,\n      formattedDate: formatDate(item.date),\n      fullName: `${item.firstName} ${item.lastName}`\n    }));\n  }, [items]);\n  \n  useEffect(() => {\n    setSortedItems(sortItems(processedItems));\n  }, [processedItems]); // Now this only depends on the memoized value\n  \n  return <Table data={sortedItems} onRowClick={onSelect} />;\n}\n```\n\nThis should fix your performance issue.",
    user_id: users[3].id,
    post_id: posts[8].id,
    createdAt: new Date('2024-03-06T14:30:00'),
    updatedAt: new Date('2024-03-06T14:30:00')
  },
  
  {
    comment_text: "I've implemented rate limiting in production using Option 1 (express-rate-limit with Redis) and it works beautifully at scale. The Redis store is essential if you're running multiple server instances.\n\nDefinitely apply different limits for authenticated vs. unauthenticated users - we use a tiered approach:\n\n```javascript\nconst apiLimiter = rateLimit({\n  store: new RedisStore({\n    client: redisClient,\n    prefix: 'rate-limit:',\n    // Expire keys after window time has elapsed to save memory\n    expiry: 60 * 60\n  }),\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  // Dynamic limit based on user role\n  max: (req) => {\n    if (!req.user) return 30; // Anonymous\n    if (req.user.isPremium) return 600; // Premium users\n    return 100; // Regular users\n  },\n  // Add headers explaining rate limit to clients\n  standardHeaders: true,\n  // Gradual throttling - increase response delay as limit approaches\n  handler: (req, res, next, options) => {\n    const remainingRequests = options.max - req.rateLimit.current;\n    const delayFactor = Math.max(0, 1 - (remainingRequests / options.max));\n    \n    // Add artificial delay as user approaches their limit\n    if (delayFactor > 0.5) {\n      const delay = Math.floor(delayFactor * 1000); // max 1 second delay\n      setTimeout(() => {\n        res.status(429).json({\n          message: 'Too many requests, please try again later.',\n          retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000)\n        });\n      }, delay);\n      return;\n    }\n    \n    res.status(429).json({\n      message: 'Too many requests, please try again later.',\n      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000)\n    });\n  }\n});\n```\n\nFor gradual throttling, we also implemented a sliding window approach where users get gradually slower responses as they approach their limit rather than being cut off entirely. This provides a better UX than a hard 429 error.",
    user_id: users[2].id,
    post_id: posts[1].id,
    createdAt: new Date('2024-02-05T16:45:00'),
    updatedAt: new Date('2024-02-05T16:45:00')
  },
  
  {
    comment_text: "Just add the `--host` flag to your Vite command. Simple as that:\n\n```json\n{\n  \"scripts\": {\n    \"dev\": \"vite --host\"\n  }\n}\n```",
    user_id: users[0].id,
    post_id: posts[2].id,
    createdAt: new Date('2024-02-09T10:00:00'),
    updatedAt: new Date('2024-02-09T10:00:00')
  },
  
  {
    comment_text: "Grid areas is definitely the way to go for complex layouts. Here's a quick fix for your code:\n\n```css\n.dashboard-grid {\n  display: grid;\n  gap: 20px;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-areas:\n    \"header header header header\"\n    \"sidebar main main main\"\n    \"sidebar stats stats stats\";\n}\n\n@media (max-width: 992px) {\n  .dashboard-grid {\n    grid-template-columns: repeat(2, 1fr);\n    grid-template-areas:\n      \"header header\"\n      \"main main\"\n      \"sidebar stats\";\n  }\n}\n\n@media (max-width: 576px) {\n  .dashboard-grid {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      \"header\"\n      \"main\"\n      \"stats\"\n      \"sidebar\";\n  }\n}\n\n.header { grid-area: header; }\n.main { grid-area: main; }\n.sidebar { grid-area: sidebar; }\n.stats { grid-area: stats; }\n```\n\nThis lets you completely rearrange items for each viewport without changing the DOM order.",
    user_id: users[4].id,
    post_id: posts[3].id,
    createdAt: new Date('2024-02-13T15:00:00'),
    updatedAt: new Date('2024-02-13T15:00:00')
  },
  
  {
    comment_text: "We implemented a comprehensive testing strategy for our MERN app last year, and here's what worked best for us:\n\n1. **Unit Tests (60% of tests)**:\n   - Frontend: React Testing Library + Jest for components and hooks\n   - Backend: Jest for controllers, services, and utility functions\n\n2. **Integration Tests (30% of tests)**:\n   - API routes with Supertest + in-memory MongoDB\n   - Database operations with actual queries but test database\n\n3. **E2E Tests (10% of tests)**:\n   - Critical user flows with Playwright\n   - Run in CI/CD pipeline before deployment\n\nOur code coverage goals:\n- 90% for utility/helper functions\n- 80% for business logic/services\n- 70% for controllers/routes\n- 60% for React components (focusing on interactive elements)\n\nWe found that Playwright was better than Cypress for our needs due to:  \n- Multi-browser testing in parallel  \n- Better performance with our component-heavy UI\n\nKey learning: Start with tests for the most critical business logic and user flows, then expand. Don't aim for 100% coverage from day one - it's not worth the effort.\n\nThis structure helped us find a good balance between test coverage and development velocity.",
    user_id: users[4].id, 
    post_id: posts[4].id,
    createdAt: new Date('2024-02-16T09:45:00'),
    updatedAt: new Date('2024-02-16T09:45:00')
  },
  
  {
    comment_text: "Your Redux code has too much boilerplate. Switch to Redux Toolkit:\n\n```javascript\n// Before (verbose Redux)\nconst INCREMENT = 'counter/increment';\nconst DECREMENT = 'counter/decrement';\n\nfunction counterReducer(state = { value: 0 }, action) {\n  switch (action.type) {\n    case INCREMENT:\n      return { ...state, value: state.value + 1 };\n    case DECREMENT:\n      return { ...state, value: state.value - 1 };\n    default:\n      return state;\n  }\n}\n\n// After (with Redux Toolkit)\nimport { createSlice } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: state => { state.value += 1 },\n    decrement: state => { state.value -= 1 }\n  }\n});\n\nexport const { increment, decrement } = counterSlice.actions;\nexport default counterSlice.reducer;\n```\n\nMuch cleaner, and you get immutability built-in with Immer.",
    user_id: users[1].id,
    post_id: posts[5].id,
    createdAt: new Date('2024-02-21T13:25:00'),
    updatedAt: new Date('2024-02-21T13:25:00')
  },
  
  {
    comment_text: "Socket.IO is definitely the way to go for your requirements. For authentication, use the JWT in handshake like this:\n\n```javascript\n// Client-side\nconst socket = io(SOCKET_URL, {\n  auth: { token: localStorage.getItem('token') }\n});\n\n// Server-side\nio.use((socket, next) => {\n  try {\n    const token = socket.handshake.auth.token;\n    const user = jwt.verify(token, process.env.JWT_SECRET);\n    socket.user = user;\n    next();\n  } catch (err) {\n    next(new Error('Authentication error'));\n  }\n});\n```\n\nNo need to reinvent the wheel - Socket.IO handles reconnections, fallbacks, and room management for you.",
    user_id: users[3].id,
    post_id: posts[6].id,
    createdAt: new Date('2024-02-26T16:10:00'),
    updatedAt: new Date('2024-02-26T16:10:00')
  },
  
  {
    comment_text: "TypeScript is absolutely worth it. Start small by enabling it in your project:\n\n```json\n// tsconfig.json\n{\n  \"compilerOptions\": {\n    \"target\": \"es6\",\n    \"lib\": [\"dom\", \"dom.iterable\", \"esnext\"],\n    \"allowJs\": true,          // Allow JavaScript files\n    \"skipLibCheck\": true,     // Skip type checking of all declaration files\n    \"esModuleInterop\": true,  // Enables interoperability between CommonJS and ES Modules\n    \"allowSyntheticDefaultImports\": true,\n    \"strict\": false,          // Start with strict mode off to ease migration\n    \"forceConsistentCasingInFileNames\": true,\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"node\",\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\"\n  },\n  \"include\": [\"src\"]\n}\n```\n\nThen gradually convert files from .js to .ts, starting with utility functions. The productivity boost is worth the initial time investment.",
    user_id: users[2].id,
    post_id: posts[7].id,
    createdAt: new Date('2024-03-02T11:15:00'),
    updatedAt: new Date('2024-03-02T11:15:00')
  },
  
  {
    comment_text: "Your core problem is creating new objects on every render. Fix it like this:\n\n```javascript\nimport { useMemo, useCallback } from 'react';\n\nfunction DataGrid({ items, onSelect }) {\n  // Memoize data transformations\n  const processedItems = useMemo(() => {\n    return items.map(item => ({\n      ...item,\n      formattedDate: formatDate(item.date),\n      fullName: `${item.firstName} ${item.lastName}`\n    }));\n  }, [items]);\n  \n  // Memoize sorting\n  const sortedItems = useMemo(() => {\n    return sortItems(processedItems);\n  }, [processedItems]);\n  \n  // Memoize callback\n  const handleRowClick = useCallback(onSelect, [onSelect]);\n  \n  return <Table data={sortedItems} onRowClick={handleRowClick} />;\n}\n```\n\nI fixed this exact issue in our app and reduced render time from 3s to 150ms.",
    user_id: users[0].id,
    post_id: posts[8].id,
    createdAt: new Date('2024-03-06T13:30:00'),
    updatedAt: new Date('2024-03-06T13:30:00')
  },
  
  {
    comment_text: "Thanks for sharing this tip! Just want to add that if you have deployed GitHub pages from the repository, you should be aware of one additional step:\n\nAfter renaming, you might need to update your GitHub Pages settings if you're using a custom domain. Sometimes the rename process can reset this configuration.\n\nYou can check by going to:\nSettings > Pages > Custom domain\n\nIf your custom domain is missing, just add it back and save.\n\nThis saved me a lot of confusion when I renamed a portfolio project repository and suddenly my site was down!",
    user_id: users[4].id,
    post_id: posts[9].id,
    createdAt: new Date('2024-03-11T10:00:00'),
    updatedAt: new Date('2024-03-11T10:00:00')
  },
  
  // Additional short comments for more variety
  {
    comment_text: "Have you tried using React Query's `prefetchQuery`? That solved a similar issue for me:\n\n```javascript\n// In your route component or layout\nconst queryClient = useQueryClient();\n\nuseEffect(() => {\n  // Prefetch the next page\n  queryClient.prefetchQuery(\n    ['items', currentPage + 1],\n    () => fetchItems(currentPage + 1, 50)\n  );\n}, [currentPage, queryClient]);\n```\n\nThis will load the next page in the background, making pagination feel instant.",
    user_id: users[0].id,
    post_id: posts[0].id,
    createdAt: new Date('2024-02-01T14:45:00'),
    updatedAt: new Date('2024-02-01T14:45:00')
  },
  
  {
    comment_text: "Use the --host flag with a specific port number if you need a consistent address for testing:\n\n```bash\nvite --host --port 3333\n```\n\nThis way the port won't change between restarts.",
    user_id: users[1].id,
    post_id: posts[2].id,
    createdAt: new Date('2024-02-09T11:05:00'),
    updatedAt: new Date('2024-02-09T11:05:00')
  }
];

  const comments = await Comment.bulkCreate(commentData, { individualHooks: true });
  return comments;
}; 

module.exports = seedComments;