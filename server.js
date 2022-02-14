const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

// Init Middleware (to be able to get the data in the req.body, from the routes)
app.use(express.json({
    extended: false
}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API Running...');
})

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

// 4.
app.listen(PORT, () => console.log(`💻 Server started on port ${PORT} 👌 !`));


