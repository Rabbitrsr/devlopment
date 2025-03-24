const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');

require('dotenv').config();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', adminRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);

app.use((req, res) => {
    console.log(`[404] Route not found - Method: ${req.method}, URL: ${req.originalUrl}`);
    res.status(404).json({ message: 'Not found' });
});

module.exports = app;