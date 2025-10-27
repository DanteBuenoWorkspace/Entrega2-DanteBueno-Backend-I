const socket = io();

const formAgregar = document.getElementById('formAgregar');
formAgregar.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formAgregar));
  socket.emit('nuevoProducto', data);
  formAgregar.reset();
});

const formEliminar = document.getElementById('formEliminar');
formEliminar.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = formEliminar.id.value;
  socket.emit('eliminarProducto', Number(id));
  formEliminar.reset();
});

socket.on('actualizarLista', (products) => {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  products.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - $${p.price}`;
    lista.appendChild(li);
  });
});
