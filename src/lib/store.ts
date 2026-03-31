import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./features/auth/authSlice"
import hotelReducer from "./features/hotels/hotelSlice"
import bookingReducer from "./features/booking/bookingSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      hotels: hotelReducer,
      booking: bookingReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>

// Create store instance for client-side
export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
