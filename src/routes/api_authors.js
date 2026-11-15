const router = require('express').Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM autores');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, email, imagen } = req.body;
        const [result] = await pool.query(
            'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
            [nombre, email, imagen]
        );
        
        const [newAutor] = await pool.query('SELECT * FROM autores WHERE id = ?', [result.insertId]);
        res.status(201).json(newAutor[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;