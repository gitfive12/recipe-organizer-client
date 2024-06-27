const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

let userDB = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the user database.');
});


let db = new sqlite3.Database('./recipes.db', (err) => {
  if (err) {
    console.error('Could not connect to database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create Users table
userDB.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Create Recipes table
db.run(`CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  title TEXT,
  instructions TEXT,
  category TEXT,
  imageUrl TEXT
)`);

// Register user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userDB.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ userId: this.lastID });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  userDB.get(`SELECT id, password FROM users WHERE username = ?`, [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, row.password);
    if (isPasswordMatch) {
      res.json({ userId: row.id });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  });
});

// Get recipes by user ID
app.get('/api/recipes', (req, res) => {
  const { userId } = req.query;
  db.all(`SELECT * FROM recipes WHERE userId = ?`, [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add recipe
app.get('/api/recipes', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }

  db.all(`SELECT * FROM recipes WHERE userId = ?`, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});



process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the recipes database connection.');
  });
  userDB.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the user database connection.');
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

