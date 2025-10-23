const fs = require('fs');

class CartManager {
  constructor() {
    this.path = './data/carts.json';
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === Number(id));
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length === 0 ? 1 : Math.max(...carts.map(c => c.id)) + 1,
      products: []
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === Number(cartId));

    if (cartIndex === -1) throw new Error('Cart not found');

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === Number(productId));

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: Number(productId), quantity: 1 });
    }

    carts[cartIndex] = cart;

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
