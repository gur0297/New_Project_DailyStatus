import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://localhost:44385/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// export const createUser = createAsyncThunk(
//   "user/createUser",
//   async (userData, thunkAPI) => {
//     try {
//       const response = await fetch("https://localhost:44385/api/user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       let data = await response.json();

//       if (response.status === 201) {
//         return data;
//       } else {
//         return thunkAPI.rejectWithValue(data);
//       }
//     } catch (e) {
//       return thunkAPI.rejectWithValue(e.response.data);
//     }
//   }
// );

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData }, thunkAPI) => {
    try {
      const response = await fetch(`https://localhost:44385/api/user/updateUserDetail`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      let data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ( id,thunkAPI) => {
    try {
      const response = await fetch(`https://localhost:44385/api/user/${id}`, {
        method: "DELETE",
      });

      let data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Additional reducers specific to the user slice can be defined here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear error when fetchUsers is pending
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.users = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
    //   .addCase(createUser.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(createUser.fulfilled, (state, { payload }) => {
    //     state.users.push(payload);
    //     state.isLoading = false;
    //     state.error = null;
    //   })
    //   .addCase(createUser.rejected, (state, { payload }) => {
    //     state.isLoading = false;
    //     state.error = payload;
    //   })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const index = state.users.findIndex((user) => user.id === payload.id);
        if (index !== -1) {
          state.users[index] = payload;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.users = state.users.filter((user) => !payload.includes(user.id));
        state.isLoading = false;
        state.error = null;
      })     
      
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const {} = userSlice.actions; // Additional actions can be exported if needed

export default userSlice.reducer;
