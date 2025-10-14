class GetBookingUseCase {
    constructor(bookingRepository) {
      this.bookingRepository = bookingRepository;
    }
  
    async execute() {
      return await this.bookingRepository.getTop10();
    }
  }
  
  module.exports = GetBookingUseCase;
  