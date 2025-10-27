const express = require('express');
const path = require('path');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cm = new CartManager(path.join(__dirname, '../data/carts.json'));

router.post('/', async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creating cart' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    res.json(cart.products);
  } catch (error) {
    if (error.message === 'Cart not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error getting cart' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cm.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    if (error.message === 'Cart not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router;
