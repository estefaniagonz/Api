const express = require('express');
const app = express();

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pma',
  password: '123456',
  database: 'students'
});

connection.connect(function (error) {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Node JS');
});

app.get('/api/students', (req, res) => {
  const query = 'SELECT * FROM students';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener estudiantes:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.send(results);
  });
});

app.get('/api/students/:id', (req, res) => {
  const query = 'SELECT * FROM students WHERE id = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error al obtener estudiante:', error);
      return res.status(500).send('Error interno del servidor');
    }
    if (results.length === 0) {
      return res.status(404).send('Estudiante no encontrado');
    }
    res.send(results[0]);
  });
});

app.post('/api/students', (req, res) => {
  const { name, age, grado } = req.body;
  const query = 'INSERT INTO students (name, age, grado) VALUES (?, ?, ?)';
  connection.query(query, [name, age, grado], (error, results) => {
    if (error) {
      console.error('Error al agregar estudiante:', error);
      return res.status(500).send('Error interno del servidor');
    }
    res.send({
      id: results.insertId,
      name: name,
      age: age,
      grado: grado
    });
  });
});

app.delete('/api/students/:id', (req, res) => {
  const query = 'DELETE FROM students WHERE id = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error al eliminar estudiante:', error);
      return res.status(500).send('Error interno del servidor');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Estudiante no encontrado');
    }
    res.send('Estudiante eliminado correctamente');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
