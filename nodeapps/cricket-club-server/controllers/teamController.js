const db = require('../config/db');
const { validationResult } = require('express-validator');
const multer = require('multer');

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/teams'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage: storage });
exports.uploadlogo = upload.single('logo');

exports.addTeam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, short_name, place} = req.body;
    const logoUrl = req.file ? `/uploads/teams/${req.file.filename}` : null;

    try {
        await db.query(
            'INSERT INTO teams (name, short_name, logo_url, place) VALUES ($1, $2, $3, $4)',
            [name, short_name, logoUrl, place]
        );
        res.status(201).json({message: 'Team added successfully'});
    } catch (err) {
        console.error('Error adding team:', err);
        res.status(500).json({message: err.message});
    }
};

exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name, shortname, place } = req.body;
    const logoUrl = req.file ? `/uploads/teams/${req.file.filename}` : null;

    try {
        const existing = await db.query('SELECT * FROM teams WHERE id = $1', [id]);

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await db.query(
            `UPDATE teams SET 
                name = $1, 
                short_name = $2, 
                place = $3, 
                logo_url = COALESCE($4, logo_url), 
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $5`,
            [name, shortname, place, logoUrl, id]
        );

        res.json({ message: 'Team updated successfully' });
    } catch (err) {
        console.error('Error updating team:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getTeams = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM teams ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTeam = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM teams WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        console.error('Error deleting team:', err);
        res.status(500).json({ message: err.message });
    }
};


