const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const routes = require('./routes');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://10.88.111.4:3000'],  // Allow both local and network access
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  }),
  name: 'sessionId',
  proxy: process.env.NODE_ENV === 'production'
};

console.log('Server running in', process.env.NODE_ENV || 'development', 'mode');

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});