import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ServerState {
    limits: any;


}
const initialState: ServerState = {
    limits: []
}


export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setLimits: (state, action: PayloadAction<any>) => {
            state.limits = action.payload;
        }
    }
})

export const {setLimits} = serverSlice.actions;
export default serverSlice.reducer;