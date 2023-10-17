require('dotenv').config();
const
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser')
; 
const
  connectDB = require('./config/db'),
  PORT = process.env.PORT || 5000,
  { notFound, errorHandler } = require('./middleware/errorMiddleware'),
  app = express();
;
// Connect to DB
connectDB();

if(process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/users', require('./routes/userRoutes'));

// Linking the backend to the frontend
if(process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  // '*' wildcard to route all non /api/ links to the frontend
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')))
} else {
  // in development mode so
  app.get('^/$|index(.html)?', (req, res) => res.send('Server is running'));
}

// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// RUN SERVER
app.listen(PORT, () => console.log(`✅ Node server running on port: ${PORT}`));