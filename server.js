const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database'
});
app.use(express.static('public'));
app.use(express.json());

connection.connect(error => {
    if (error) throw error;
    console.log('Connected to the MySQL server.');
});


 connection.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255))', (error) => {
     if (error) throw error;
     console.log('Table created or already exists.');
 });

app.get('/users', (req, res) => {
    // Query the database to get all users
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Adjusted salt rounds for better security
        const user = { name: req.body.name, password: hashedPassword };
        // Insert the user into the database
        connection.query('INSERT INTO users SET ?', user, (error) => {
            if (error) throw error;
            res.status(201).send();
        });
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    // Query the database to find the user by name
    connection.query('SELECT * FROM users WHERE name = ?', [req.body.name], async (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(400).send('Cannot find user');
        }
        try {
            if (await bcrypt.compare(req.body.password, results[0].password)) {
                res.send('Success');
            } else {
                res.send('Not Allowed');
            }
        } catch {
            res.status(500).send();
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});