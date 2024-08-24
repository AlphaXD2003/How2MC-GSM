import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    user: any;
    isLoggedIn: boolean;

}

const initialState: UserState = {
    user: null,
    isLoggedIn: false,
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, acttion: PayloadAction<any>) => {
            state.user = acttion.payload;
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
    },
})

export const { setUserData, setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;