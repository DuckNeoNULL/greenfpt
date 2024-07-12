// Step 1: Import necessary modules

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const connection = mysql.createConnection({
  host: 'localhost', // Default host for Laragon's MySQL
  user: 'root', // Default user for Laragon's MySQL
  password: '', // Default password for Laragon's MySQL is empty
  database: 'databasegreen' // Your database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Step 2: Initialize the Express application
const app = express();

// Step 3: Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Step 4: Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
app.use('/index', indexRouter);
app.post('/addPoints', (req, res) => {
  const { username, points } = req.body;

  // Query the database to fetch the user's current points
  const selectQuery = `SELECT points FROM userpoint WHERE username = ?`;
  connection.query(selectQuery, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Check if the user exists
    if (results.length > 0) {
      const currentPoints = results[0].points;

      // Calculate the new total points
      const newPoints = currentPoints + points;

      // Update the user's points in the database
      const updateQuery = `UPDATE userpoint SET points = ? WHERE username = ?`;
      connection.query(updateQuery, [newPoints, username], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        console.log('Points added successfully');
        res.send('Points added successfully');
      });
    } else {
      // User does not exist
      console.log('User does not exist');
      res.status(404).send('User not found');
    }
  });
});
// Step 5: Serve the login form for GET requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use(express.json());  
const jwt = require('jsonwebtoken');

// Secret key for JWT signing and encryption
const SECRET_KEY = 'duckneo'; // Use a long, random string in production
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body); // Log the entire request body
  
    // Hardcoded user credentials for demonstration
    // Query the database to fetch the user's credentials
    const query = `SELECT ID,username, password FROM users WHERE username = ?`;
    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Check if the user exists and the password matches
      if (results.length > 0 && results[0].password === password) {
        // User authenticated successfully
        console.log('User authenticated successfully');
        // Create a token
        const userId = results[0].ID;
        
        console.log(results[0].ID)
        const token = jwt.sign({ userId:userId, role:'user' }, SECRET_KEY, { expiresIn: '1h' });
        // localStorage.setItem('userId', userId);
        // Send the token to the client
        res.json({ message: 'Login successful', token: token, userId: userId });
      } else {
        // Authentication failed
        console.log('Authentication failed');
        res.status(401).send('Login failed: Incorrect username or password');
      }
    });
});  

app.get('/api/userinfo', (req, res) => {
  
  const { userId } = req.query;
  console.log(req.query); // Log the query parameters (userId
  // Query the database to fetch the user's information
  const selectQuery = `SELECT * FROM info_users WHERE userId = ?`;
  connection.query(selectQuery, [userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Check if the user exists
    if (results.length > 0) {
      const user = results[0];
      res.json(user);
    } else {
      // User does not exist
      console.log('User does not exist');
      res.status(404).send('User not found');
    }
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


  