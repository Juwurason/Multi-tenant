import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usePublicHttp from '../../hooks/usePublicHttp';

const publicHttp = usePublicHttp();
export const loginAuth = createAsyncThunk(
    'Auth/loginAuth',
    async (info) => {
        const { data } = await publicHttp.post('/Account/auth_login', info)
        // localStorage.setItem("user", JSON.stringify(data.userProfile))
        return data
    }
);

const AuthSlice = createSlice({
    name: 'Auth',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Define any specific actions related to Admin (if needed)
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAuth.pending, (state) => {
                state.loading = true;
                state.data = null;
                state.error = null;
            })
            .addCase(loginAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(loginAuth.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
                console.log(action.error.message);
            });



    },
});

export const { } = AuthSlice.actions;
export default AuthSlice.reducer;
