// Seed data for creating initial comments with timestamps and relationships
const { Comment } = require('../models');

const seedComments = async (users, posts) => {
  const commentData = [
  {
    comment_text: "Thanks for sharing your ML journey! I'm in week 2 of the same course. Quick tip: check out fast.ai too, they have a more practical approach that really clicked for me.",
    user_id: users[1].id, // Use UUID from second user
    post_id: posts[0].id, // Use UUID from first post
    createdAt: new Date('2024-02-01T11:30:00'),
    updatedAt: new Date('2024-02-01T11:30:00')
  },
  {
    comment_text: "The rate limiting tip saved my API from a DDoS last week! Would love to see that deep dive, especially about handling rate limit errors gracefully on the client side.",
    user_id: users[2].id,
    post_id: posts[1].id,
    createdAt: new Date('2024-02-05T16:45:00'),
    updatedAt: new Date('2024-02-05T16:45:00')
  },
  {
    comment_text: "Have you tried using React Query? We implemented it last sprint and it cut our bundle size by another 15%. Plus, the caching is *chef's kiss*",
    user_id: users[3].id,
    post_id: posts[2].id,
    createdAt: new Date('2024-02-09T10:20:00'),
    updatedAt: new Date('2024-02-09T10:20:00')
  },
  {
    comment_text: "That Safari bug was driving me crazy too! Found a similar issue with grid-auto-flow: dense in iOS 14. Your solution is much cleaner than our hacky fix!",
    user_id: users[0].id,
    post_id: posts[3].id,
    createdAt: new Date('2024-02-13T15:00:00'),
    updatedAt: new Date('2024-02-13T15:00:00')
  },
  {
    comment_text: "Question about the chart library - did you consider using Observable Plot instead? Curious about the bundle size comparison.",
    user_id: users[4].id, 
    post_id: posts[2].id,
    createdAt: new Date('2024-02-10T08:15:00'),
    updatedAt: new Date('2024-02-10T08:15:00')
  },
  {
    comment_text: "This resonates so much. We just implemented Jest snapshot testing and caught three potential regressions in our last PR. Better late than never!",
    user_id: users[1].id,
    post_id: posts[4].id,
    createdAt: new Date('2024-02-16T09:45:00'),
    updatedAt: new Date('2024-02-16T09:45:00')
  }
];

// Bulk create all comments
return Comment.bulkCreate(commentData);
}; 
module.exports = seedComments;
