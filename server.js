const express = require('express');
const morgan = require('morgan'); // middleware per logging
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Abilita CORS
app.use(express.json()); // Per leggere body JSON
app.use(morgan('dev')); // Middleware: logging delle richieste HTTP

const dbConfig = {
    server: 'DB_HQ000DFA_DEV01.HQ000.IDENTITY.MSC.COM\\HQ000DFA_DEV01',
    database: 'DigitalFactory',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,       // usa autenticazione Windows
        trustServerCertificate: true   // evita problemi SSL se non hai certificato valido
      }
  };

  
  function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access denied" });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  }  

  function authorizeRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  }

  async function testConnection() {
    try {
        // Connessione al database
        const pool = await sql.connect(dbConfig);
        console.log("✅ Connessione a SQL Server riuscita!");

        // Opzionale: Esegui una query semplice per confermare l'accesso
        const result = await pool.query`SELECT 1 as Result`;
        console.log("✅ Query di prova eseguita con successo:", result.recordset[0].Result);

        // Chiudi la pool quando hai finito
        await pool.close();
        console.log("Connessione chiusa.");
        
    } catch (err) {
        // Gestisci l'errore di connessione
        console.error("❌ Errore durante la connessione a SQL Server:");
        console.error(err);
        // Se c'è un errore, a volte è utile chiudere la pool forzatamente
        if (sql.globalPool && sql.globalPool.connected) {
             sql.globalPool.close();
        }
    }
  }  

  async function getDati() {
    console.log("Avvio getDati()...");
    try {
      await sql.connect(dbConfig);
      const result = await sql.query`SELECT TOP 10 * FROM dbo.Booking`;
      return result.recordset;
    } catch (err) {
      console.error(err);
      throw err;
    }      
  }

// Endpoint di esempio
app.get('/api/hello', (req, res) => {
  res.json({ message: 'API funzionante!' });
});

app.get('/api/dati', async (req, res) => {
    try {
      const dati = await getDati();
      res.json(dati);
    } catch {
      res.status(500).send('Errore nel recupero dati');
    }
  });

app.get('/api/test', (req, res) => {
    testConnection();
});

app.get('/api/secure-data', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ secretData: 'This is confidential!' });
});
  
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  });
});
