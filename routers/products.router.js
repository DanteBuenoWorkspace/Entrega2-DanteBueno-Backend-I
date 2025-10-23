const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const pm = new ProductManager('../data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    const { limit } = req.query;

    if (limit) {
      const n = parseInt(limit);
      if (Number.isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'limit must be a positive number' });
      }
      return res.json(products.slice(0, n));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error getting products' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const product = await pm.getProductById(id);
    res.json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Error getting the product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.message === 'All product fields are required') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Product code must be unique') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error adding product' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedProduct = await pm.updateProductById(id, req.body);
    res.json({ message: 'Successfully updated product', updatedProduct });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error updating product' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedProduct = await pm.deleteProduct(id);
    res.json({ message: 'Product disposed correctly', deletedProduct });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Product deletion error' });
  }
});

module.exports = router;
