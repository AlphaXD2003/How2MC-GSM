
import userReducer from '@/slice/userSlice'
import { configureStore } from '@reduxjs/toolkit'
import serverReducer from '@/slice/serverSlice'
import orderReducer from '@/slice/orderSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        server: serverReducer,
        order: orderReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch