import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
    orderId: null,
    locationId: null,
    eggId: null,
    productCategoryId: null,
    productId: null,
    price: null,
    paymentType: null,
}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers:{
        setOrderId: (state, action: PayloadAction<any>) => {
            state.orderId = action.payload;
        },
        setLocationId: (state, action: PayloadAction<any>) => {
            state.locationId = action.payload;
        },
        setEggId: (state, action: PayloadAction<any>) => {
            state.eggId = action.payload;
        },
        setProductCategoryId: (state, action: PayloadAction<any>) => {
            state.productCategoryId = action.payload;
        },
        setProductId: (state, action: PayloadAction<any>) => {
            state.productId = action.payload;
        },
        setPrice: (state, action: PayloadAction<any>) => {
            state.price = action.payload;
        },
        setPaymentType: (state, action: PayloadAction<any>) => {
            state.paymentType = action.payload;
        }
    }
})

export const {setOrderId, setLocationId, setEggId, setProductCategoryId, setProductId, setPrice, setPaymentType} = orderSlice.actions;
export default orderSlice.reducer;