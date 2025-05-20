
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';

// Load or initialize users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = loadUsers();
  if (users.find(user => user.email === email)) return res.status(409).json({ message: 'User already exists' });

  users.push({ name, email, password });
  saveUsers(users);
  res.status(201).json({ message: 'User created successfully' });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
