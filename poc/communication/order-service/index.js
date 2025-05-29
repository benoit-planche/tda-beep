const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Base de données en mémoire pour les commandes
const orders = [];

// Créer une nouvelle commande
app.post('/orders', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Vérifier le stock du produit via le service Product
    const productResponse = await axios.get(`http://product-service:3000/products/${productId}`);
    const product = productResponse.data;

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Mettre à jour le stock du produit
    await axios.patch(`http://product-service:3000/products/${productId}/stock`, {
      quantity
    });

    // Créer la commande
    const order = {
      id: orders.length + 1,
      productId,
      quantity,
      totalPrice: product.price * quantity,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Récupérer toutes les commandes
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Récupérer une commande par son ID
app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.listen(port, () => {
  console.log(`Order service listening on port ${port}`);
}); 