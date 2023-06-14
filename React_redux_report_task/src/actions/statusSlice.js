import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks

// export const getStatuses = createAsyncThunk(
//   "status/getStatuses",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("https://localhost:44385/api/status");
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const getStatuses = createAsyncThunk(
  "status/getStatuses",
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://localhost:44385/api/status?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const addStatus = createAsyncThunk(
  "status/addStatus",
  async (newStatus, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://localhost:44385/api/status/addStatus",
        newStatus
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateStatus = createAsyncThunk(
  "status/updateStatus",
  async (updatedStatus, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://localhost:44385/api/status/updateStatus`,
        updatedStatus
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteStatus = createAsyncThunk(
  "status/deleteStatus",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://localhost:44385/api/status/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice

const statusSlice = createSlice({
  name: "status",
  initialState: { statuses: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatuses.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      .addCase(addStatus.fulfilled, (state, action) => {
        state.statuses.push(action.payload);
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.statuses.findIndex(
          (status) => status.id === action.payload.id
        );
        if (index !== -1) {
          state.statuses[index] = action.payload;
        }
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        const index = state.statuses.findIndex(
          (status) => status.id === action.payload
        );
        if (index !== -1) {
          state.statuses.splice(index, 1);
        }
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export default statusSlice.reducer;
