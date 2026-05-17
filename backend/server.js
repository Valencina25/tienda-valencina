const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} catch (e) {
  console.log('Cloudinary no configurado');
}

const db = new Database(path.join(__dirname, 'tienda.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT '',
    precio REAL NOT NULL,
    imagen TEXT DEFAULT '',
    productor TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    cliente_data TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contactos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TEXT NOT NULL
  );
`);

const ADMIN_PASSWORD = 'juan1962';
const PRODUCTOS_DEFAULT = [
  {nombre:"Miel Cruda de Azahar",categoria:"alimentacion",precio:15.5,imagen:"imagenes/flor1.jpg",productor:"Apiculture Los Alcores"},
  {nombre:"Aceite de Oliva Virgen Extra",categoria:"alimentacion",precio:18.9,imagen:"imagenes/naranja.jpg",productor:"Almazara El Viso"},
  {nombre:"Crema Hidratante Aloe Vera",categoria:"cosmetica",precio:12.3,imagen:"imagenes/flor.jpg",productor:"Cosmética Natural Sevilla"},
  {nombre:"Jabón Artesanal de Lavanda",categoria:"cosmetica",precio:6.5,imagen:"imagenes/flor2.jpg",productor:"Jabonería La Alpujarra"},
  {nombre:"Cebollas",categoria:"alimentacion",precio:2.5,imagen:"imagenes/cebollino.jpg",productor:"Hortalizas Local"},
  {nombre:"Tomates",categoria:"alimentacion",precio:3,imagen:"imagenes/tomate-rosa.jpg",productor:"Hortalizas Local"},
  {nombre:"Pimientos",categoria:"alimentacion",precio:2.8,imagen:"imagenes/pimiento-italiano.jpg",productor:"Hortalizas Local"},
  {nombre:"Berenjenas",categoria:"alimentacion",precio:2.2,imagen:"imagenes/berejena-morada.jpg",productor:"Hortalizas Local"}
];

const rowCount = db.prepare('SELECT COUNT(*) as c FROM productos').get().c;
if (rowCount === 0) {
  const insert = db.prepare('INSERT INTO productos (nombre, categoria, precio, imagen, productor) VALUES (?, ?, ?, ?, ?)');
  const tx = db.transaction(() => {
    for (const p of PRODUCTOS_DEFAULT) {
      insert.run(p.nombre, p.categoria, p.precio, p.imagen, p.productor);
    }
  });
  tx();
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/imagenes', express.static(path.join(__dirname, '..', 'imagenes')));

const uploadsDir = path.join(__dirname, '..', 'imagenes');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.get('/api/productos', (req, res) => {
  const productos = db.prepare('SELECT * FROM productos ORDER BY id').all();
  res.json(productos);
});

app.post('/api/productos', (req, res) => {
  const { nombre, categoria, precio, imagen, productor } = req.body;
  const info = db.prepare('INSERT INTO productos (nombre, categoria, precio, imagen, productor) VALUES (?, ?, ?, ?, ?)').run(
    nombre, categoria || '', parseFloat(precio), imagen || '', productor || ''
  );
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(info.lastInsertRowid);
  res.json(producto);
});

app.put('/api/productos/:id', (req, res) => {
  const { nombre, categoria, precio, imagen, productor } = req.body;
  db.prepare('UPDATE productos SET nombre = ?, categoria = ?, precio = ?, imagen = ?, productor = ? WHERE id = ?').run(
    nombre, categoria || '', parseFloat(precio), imagen || '', productor || '', parseInt(req.params.id)
  );
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(parseInt(req.params.id));
  res.json(producto);
});

app.delete('/api/productos/:id', (req, res) => {
  db.prepare('DELETE FROM productos WHERE id = ?').run(parseInt(req.params.id));
  res.json({ success: true });
});

app.post('/api/productos/reset', (req, res) => {
  db.prepare('DELETE FROM productos').run();
  const insert = db.prepare('INSERT INTO productos (nombre, categoria, precio, imagen, productor) VALUES (?, ?, ?, ?, ?)');
  const tx = db.transaction(() => {
    for (const p of PRODUCTOS_DEFAULT) {
      insert.run(p.nombre, p.categoria, p.precio, p.imagen, p.productor);
    }
  });
  tx();
  const productos = db.prepare('SELECT * FROM productos ORDER BY id').all();
  res.json(productos);
});

app.post('/api/pedidos', (req, res) => {
  const { cliente, items, total } = req.body;
  const info = db.prepare('INSERT INTO pedidos (fecha, cliente_data, items, total) VALUES (?, ?, ?, ?)').run(
    new Date().toLocaleString('es-ES'),
    JSON.stringify(cliente),
    JSON.stringify(items),
    parseFloat(total)
  );
  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(info.lastInsertRowid);
  pedido.cliente = JSON.parse(pedido.cliente_data);
  pedido.items = JSON.parse(pedido.items);
  res.json(pedido);
});

app.get('/api/pedidos', (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos ORDER BY id DESC').all();
  pedidos.forEach(p => {
    p.cliente = JSON.parse(p.cliente_data);
    p.items = JSON.parse(p.items);
    delete p.cliente_data;
  });
  res.json(pedidos);
});

app.delete('/api/pedidos/:id', (req, res) => {
  db.prepare('DELETE FROM pedidos WHERE id = ?').run(parseInt(req.params.id));
  res.json({ success: true });
});

app.post('/api/contacto', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  db.prepare('INSERT INTO contactos (nombre, email, mensaje, fecha) VALUES (?, ?, ?, ?)').run(
    nombre, email, mensaje, new Date().toISOString()
  );
  res.json({ success: true });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend tienda-valencina en http://localhost:${PORT}`);
});
