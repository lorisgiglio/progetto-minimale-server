const express = require('express');
const morgan = require('morgan');   // abilita Morgan : middleware per Express per i log delle richieste HTTP
const cors = require('cors');       // abilitare i CORS

const bookingRoutes = require('./interfaces/routes/bookingRoutes');
const authRoutes = require('./interfaces/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/dati', bookingRoutes);
app.use('/api', authRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'API funzionante!' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});