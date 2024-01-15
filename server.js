// Required modules
const fs = require('fs');
const path = require('path');
const express = require('express');

// Load initial note data
const { notes } = require("./db/db.json");

// Setup server port
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, something went wrong!');
});

// API Endpoints
// GET - Retrieve notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//POST - Create notes
app.post('/api/notes', (req, res, next) => {
    req.body.id = notes.length.toString();
    notes.push(req.body);
  
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify({ notes }, null, 2), (err) => {
        if (err) {
            notes.pop();
            next(err);
        } else {
            res.json(req.body);
        }
    });
});

// DELETE - Remove notes by ID
app.delete('/api/notes/:id', (req, res, next) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(note => note.id === noteId);
  
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
  
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify({ notes }, null, 2), (err) => {
            if (err) {
                notes.splice(noteIndex, 0, notes[noteIndex]);
                next(err);
            } else {
                res.json({ message: 'Note deleted' });
            }
        });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

// Serve HTML files
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});