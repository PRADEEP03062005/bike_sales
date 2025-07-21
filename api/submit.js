// api/submit.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set this in Vercel env vars
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, mobile } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ message: 'Missing name or mobile' });
  }

  try {
    await pool.query('CREATE TABLE IF NOT EXISTS contacts (id SERIAL PRIMARY KEY, name TEXT, mobile TEXT)');
    await pool.query('INSERT INTO contacts(name, mobile) VALUES($1, $2)', [name, mobile]);
    res.status(200).json({ message: 'Contact saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving contact', error: err.message });
  }
};
