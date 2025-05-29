const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Base de données en mémoire pour les produits
const products = [
  { id: 1, name: 'Product 1', price: 100, stock: 10 },
  { id: 2, name: 'Product 2', price: 200, stock: 5 },
  { id: 3, name: 'Product 3', price: 300, stock: 15 }
];

// Récupérer tous les produits
app.get('/products', (req, res) => {
  res.json(products);
});

// Récupérer un produit par son ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Mettre à jour le stock d'un produit
app.patch('/products/:id/stock', (req, res) => {
  const { quantity } = req.body;
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  product.stock -= quantity;
  res.json(product);
});

app.listen(port, () => {
  console.log(`Product service listening on port ${port}`);
}); 