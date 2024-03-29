import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchDocument = createAsyncThunk('Document/fetchDocument', async (companyId) => {
    const response = await api.fetchDocumentData(companyId);
    return response;
});
export const filterDocument = createAsyncThunk(
    'Document/filterDocument',
    async ({ company, dateFrom, dateTo, sta, cli, status, role }) => {
        const response = await api.filterDocument(company, dateFrom, dateTo, sta, cli, status, role);
        return response;
    }
);

const DocumentSlice = createSlice({
    name: 'Document',
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
            .addCase(fetchDocument.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterDocument.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = DocumentSlice.actions;
export default DocumentSlice.reducer;
