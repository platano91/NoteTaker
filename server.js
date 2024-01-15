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


