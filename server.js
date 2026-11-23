const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let links = [
  {
    id: 1,
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    description: 'Code hosting and collaboration platform'
  },
  {
    id: 2,
    title: 'Google Cloud',
    url: 'https://cloud.google.com',
    category: 'Cloud',
    description: 'Cloud services and deployment documentation'
  }
];
let nextId = 3;

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

app.get('/api/links', (req, res) => {
  const search = String(req.query.search || '').toLowerCase();
  const category = String(req.query.category || '').toLowerCase();

  const results = links.filter((link) => {
    const matchesSearch = !search || [link.title, link.url, link.description]
      .some((value) => value.toLowerCase().includes(search));
    const matchesCategory = !category || link.category.toLowerCase() === category;
    return matchesSearch && matchesCategory;
  });

  res.json(results);
});

app.post('/api/links', (req, res) => {
  const { title, url, category, description = '' } = req.body;

  if (!title?.trim() || !category?.trim() || !isValidUrl(url)) {
    return res.status(400).json({ error: 'A title, valid URL, and category are required.' });
  }

  if (links.some((link) => link.url.toLowerCase() === url.toLowerCase())) {
    return res.status(409).json({ error: 'That URL is already saved.' });
  }

  const link = {
    id: nextId++,
    title: title.trim(),
    url: url.trim(),
    category: category.trim(),
    description: description.trim()
  };
  links.push(link);
  res.status(201).json(link);
});

app.delete('/api/links/:id', (req, res) => {
  const index = links.findIndex((link) => link.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Link not found.' });
  links.splice(index, 1);
  res.status(204).send();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'linkvault' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log(`LinkVault running on port ${PORT}`));
}

module.exports = app;
