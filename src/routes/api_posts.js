const router = require('express').Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                posts.id, 
                posts.titulo, 
                posts.descripcion, 
                posts.fecha_creacion, 
                posts.categoria,
                autores.id AS autor_id,
                autores.nombre AS autor_nombre,
                autores.email AS autor_email,
                autores.imagen AS autor_imagen
            FROM posts
            INNER JOIN autores ON posts.autor_id = autores.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/autor/:autorId', async (req, res) => {
    try {
        const { autorId } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                posts.id, 
                posts.titulo, 
                posts.descripcion, 
                posts.fecha_creacion, 
                posts.categoria,
                autores.id AS autor_id,
                autores.nombre AS autor_nombre,
                autores.email AS autor_email,
                autores.imagen AS autor_imagen
            FROM posts
            INNER JOIN autores ON posts.autor_id = autores.id
            WHERE autores.id = ?
        `, [autorId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, categoria, autor_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, categoria, autor_id]
        );

        const [newPost] = await pool.query(`
            SELECT 
                posts.id, 
                posts.titulo, 
                posts.descripcion, 
                posts.fecha_creacion, 
                posts.categoria,
                autores.id AS autor_id,
                autores.nombre AS autor_nombre,
                autores.email AS autor_email,
                autores.imagen AS autor_imagen
            FROM posts
            INNER JOIN autores ON posts.autor_id = autores.id
            WHERE posts.id = ?
        `, [result.insertId]);

        res.status(201).json(newPost[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;