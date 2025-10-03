const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());

const BASE_DIR = path.join(__dirname, 'data');

// API: List all categories
app.get('/api/categories', (req, res) => {
  fs.readdir(BASE_DIR, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(404).json([]);
    const categories = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    res.json(categories);
  });
});

// API: List all .txt website files for a category
app.get('/api/:category', (req, res) => {
  const categoryDir = path.join(BASE_DIR, req.params.category);
  fs.readdir(categoryDir, (err, files) => {
    if (err) return res.status(404).json([]);
    const result = files
      .filter(name => name.endsWith('.txt'))
      .map(name => ({
        name: path.parse(name).name,
        url: `${req.params.category}/${name}`
      }));
    res.json(result);
  });
});

// API: Get website link from specific .txt
app.get('/api/:category/:website', (req, res) => {
  const filePath = path.join(BASE_DIR, req.params.category, req.params.website);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.send(data.trim());
  });
});

// File upload (add/update .txt files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category } = req.body;
    const dir = path.join(BASE_DIR, category);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ status: 'uploaded', file: req.file.filename });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started ${PORT}`));
