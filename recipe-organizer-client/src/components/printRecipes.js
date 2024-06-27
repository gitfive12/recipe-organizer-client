const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./recipes.db', (err) => {
  if (err) {
    return console.error('Could not connect to database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.each(`SELECT * FROM recipes`, (err, row) => {
    if (err) {
      console.error('Error querying the database:', err.message);
    } else {
      console.log(row);
    }
  });
});

db.close((err) => {
  if (err) {
    return console.error('Error closing the database:', err.message);
  }
  console.log('Closed the database connection.');
});
