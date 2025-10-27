const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./managers/ProductManager.js');

const productsRouter = require('./routers/products.router.js');
const cartsRouter = require('./routers/carts.routers.js');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

const pm = new ProductManager();

app.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await pm.getProducts();
  res.render('realTimeProducts', { products });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado');

  socket.on('nuevoProducto', async (product) => {
    try {
      await pm.addProduct(product);
      const products = await pm.getProducts();
      io.emit('actualizarLista', products);
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      socket.emit('errorMensaje', error.message);
    }
  });

  socket.on('eliminarProducto', async (id) => {
    try {
      await pm.deleteProduct(id);
      const products = await pm.getProducts();
      io.emit('actualizarLista', products);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      socket.emit('errorMensaje', error.message);
    }
  });
});
