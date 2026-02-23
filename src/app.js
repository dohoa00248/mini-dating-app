import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Import Routers
import indexRouter from './routes/index.js';
import adminRouter from './routes/adminRoute.js';

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

//3. Setup folder public
app.use(express.static(path.join(__dirname, 'public')));

//4. Routers
app.use('/', indexRouter);
app.use('/admin', adminRouter);

export default app;
