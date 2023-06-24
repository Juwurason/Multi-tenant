import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';


export const fetchChart = createAsyncThunk(
    'Chart/fetchChart',
    async ({ value }) => {
        const response = await api.getChartData(value);
        return response.chart_info;
    }
);

const ChartSlice = createSlice({
    name: 'Chart',
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Define any specific actions related to Admin (if needed)
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchChart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });



    },
});

export const { } = ChartSlice.actions;
export default ChartSlice.reducer;
