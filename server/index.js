// server/index.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const port = 4000; // Backend will run on port 4000

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./fieldData.db', (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS fields (
                                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  name TEXT,  -- Ensure the name field is added
                                                  polygon TEXT,
                                                  rent REAL,
                                                  seedCost REAL,
                                                  fertilizerCost REAL,
                                                  maintenanceCost REAL,
                                                  miscCost REAL
            )
        `, (err) => {
            if (err) {
                console.error("Error creating table", err);
            }
        });
    }
});

// Route to save field and cost data
app.post('/save-field', (req, res) => {
    const { name, polygon, rent, seedCost, fertilizerCost, maintenanceCost, miscCost } = req.body;

    // Log the name and other data to check if it's being passed
    console.log('Saving field:', { name, rent, seedCost, fertilizerCost, maintenanceCost, miscCost });

    db.run(
        `INSERT INTO fields (name, polygon, rent, seedCost, fertilizerCost, maintenanceCost, miscCost) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, JSON.stringify(polygon), rent, seedCost, fertilizerCost, maintenanceCost, miscCost],
        function (err) {
            if (err) {
                return res.status(500).send("Error saving data");
            }
            res.send({ message: "Field data saved successfully", id: this.lastID });
        }
    );
});

// Route to retrieve all saved fields
app.get('/fields', (req, res) => {
    db.all('SELECT * FROM fields', [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error retrieving fields");
        }
        res.json(rows); // Send all the saved fields to the frontend, including the name
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});