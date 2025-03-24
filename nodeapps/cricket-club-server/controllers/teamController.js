const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.addTeam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, short_name, place } = req.body;
    const logoUrl = req.file ? `/uploads/teams/${req.file.filename}` : null;

    try {
        await db.query(
            'INSERT INTO teams (name, short_name, logo_url, place) VALUES ($1, $2, $3, $4)',
            [name, short_name, logoUrl, place]
        );
        res.status(201).json({ message: 'Team added successfully' });
    } catch (err) {
        console.error('Error adding team:', err);
        res.status(500).json({ message: err.message });
    }
};

