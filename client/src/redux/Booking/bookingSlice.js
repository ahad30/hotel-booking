import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRooms: [],
  checkInDate: null,
  checkOutDate: null,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDetails: (state, action) => {
      const { selectedRooms, checkInDate, checkOutDate, totalPrice , nights } = action.payload;
      state.selectedRooms = selectedRooms;
      state.checkInDate = checkInDate;
      state.checkOutDate = checkOutDate;
      state.totalPrice = totalPrice;
      state.nights = nights;
    },
    clearBooking: (state) => {
      state.selectedRooms = [];
      state.checkInDate = null;
      state.checkOutDate = null;
      state.totalPrice = 0;
      state.nights = 0;
    }
  },
});

export const { setBookingDetails, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
