import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// 1. Import Routers
import indexRouter from './routes/index.js';
import adminRouter from './routes/adminRoute.js';
import authRouter from './routes/authRoute.js';
import usersRouter from './routes/usersRoute.js';

// ES Module __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//2. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Persistent storage
    store: MongoStore.create({
      mongoUrl: process.env.DB_MONGODB_URI,
      ttl: 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    },
    // Trust proxy for Render/Production
    proxy: process.env.NODE_ENV === 'production' ? true : undefined,
  }),
);

//3. Setup folder public
app.use(express.static(path.join(__dirname, 'public')));

//4. Routers
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

export default app;
