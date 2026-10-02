import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import ModalSlice from "../Modal/ModalSlice";
import baseApi from "../Api/baseApi";
import loadingSlice from "../loading/loadingSlice";
import authSlice from "../Feature/auth/authSlice";
import bookingReducer from "../Booking/bookingSlice"; 


// Persist reducers
const persistedAuthReducer = persistReducer({ key: "auth", storage }, authSlice);
const persistedBookingReducer = persistReducer({ key: "booking", storage }, bookingReducer);


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    booking: persistedBookingReducer,
    modal: ModalSlice,
    loading: loadingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = (selector) => selector(store.getState());