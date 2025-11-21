const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Setting up EmpowerHer Backend...');

// Check if server.js exists, if not create it
if (!fs.existsSync('server.js')) {
  console.log('📄 Creating server.js...');
  const serverContent = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'EmpowerHer API is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
});`;
  
  fs.writeFileSync('server.js', serverContent);
}

// Create .env if it doesn't exist
if (!fs.existsSync('.env')) {
  console.log('📄 Creating .env file...');
  fs.writeFileSync('.env', 'PORT=5000\\nMONGODB_URI=mongodb://localhost:27017/empowerher_portal\\n');
}

console.log('✅ Setup complete! Run: npm run dev');