const GetBookingUseCase = require('../../application/usecases/getBookingUseCase');
const BookingRepository = require('../../infrastructure/repositories/BookingRepository');

const bookingRepository = new BookingRepository();
const getBookingUseCase = new GetBookingUseCase(bookingRepository);

async function getDati(req, res) {
  try {
    const dati = await getBookingUseCase.execute();
    res.json(dati);
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore nel recupero dati');
  }
}

module.exports = { getDati };
