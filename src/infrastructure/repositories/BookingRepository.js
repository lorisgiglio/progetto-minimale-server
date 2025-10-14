const sql = require('mssql/msnodesqlv8');
const dbConfig = require('../db/sqlConfig');

class BookingRepository {
  async getTop10() {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT TOP 10 * FROM dbo.Booking`;
    return result.recordset;
  }
}

module.exports = BookingRepository;
