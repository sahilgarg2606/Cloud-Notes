const express = require('express');
const path = require('path');
const noteRoutes = require('./routes/noteRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API and View Routes
app.use('/api/notes', noteRoutes);

// Fallback to SPA Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});