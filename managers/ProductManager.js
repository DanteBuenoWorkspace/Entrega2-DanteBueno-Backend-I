const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = './data/products.json';
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async addProduct(product) {
        const products = await this.getProducts();

        if (!product.title || !product.price || !product.description || !product.code || !product.stock || !product.thumbnail) {
            throw new Error('All product fields are required');
        } else if (products.find(p => p.code === product.code)) {
            throw new Error('Product code must be unique');
        }

        if (products.length === 0) {
            product.id = 1;
        } else {
            const maxId = Math.max(...products.map(p => p.id));
            product.id = maxId + 1;
        }

        products.push(product);

        await fs.promises.mkdir('data', { recursive: true });

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return product;
    }

    async updateProductById(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === Number(id));

        if (productIndex === -1) {
            throw new Error('Product not found');
        }

        if (updatedFields.code) {
            const duplicated = products.find(
                p => p.code === updatedFields.code && p.id !== Number(id)
            );
            if (duplicated) {
                throw new Error('Product code must be unique');
            }
        }

        const product = products[productIndex];
        const productUpdated = { ...product, ...updatedFields, id: Number(id) };
        products[productIndex] = productUpdated;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return productUpdated;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productDeleted = products.find(p => p.id === Number(id));

        if (!productDeleted) {
            throw new Error('Product not found');
        }

        const updatedProducts = products.filter(p => p.id !== Number(id));

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));

        return productDeleted;
    }

}

module.exports = ProductManager;