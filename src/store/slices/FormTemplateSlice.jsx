import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchTemplate = createAsyncThunk('Template/fetchTemplate', async (companyId) => {
    const response = await api.fetchFormTemplate(companyId);
    return response;
});

const FormTemplateSlice = createSlice({
    name: 'Template',
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
            .addCase(fetchTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = FormTemplateSlice.actions;
export default FormTemplateSlice.reducer;
