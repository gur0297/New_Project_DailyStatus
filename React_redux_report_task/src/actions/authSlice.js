import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for registration
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await fetch("https://your-dotnet-api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      let data = await response.json();
      console.log("response", data);

      // if (response.status === 200) {
      //   localStorage.setItem('token', data.token);
      //   return { ...data, username: user.username };
      // } else {
      //   return thunkAPI.rejectWithValue(data);
      // }
    } catch (e) {
      console.log("Error", e.response.data);
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
//   try {
//     const response = await fetch(
//       "https://localhost:44385/api/user/authenticateViaRandomPassword",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user),
//       }
//     );

//     let data = await response.json();

//     if (response.status === 200) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("id", data.id); // Set the user ID in local storage
//       return { ...data, username: user.username };
//     } else {
//       return thunkAPI.rejectWithValue(data);
//     }
//   } catch (e) {
//     thunkAPI.rejectWithValue(e.response.data);
//   }
// });

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    // Fetch password change status
    const statusResponse = await fetch(
      `https://localhost:44385/api/user/getPasswordChangeStatus/${user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    const passwordChangeStatus = await statusResponse.json();

    const authUrl = passwordChangeStatus
      ? "https://localhost:44385/api/user/authenticateViaEncryptPassword"
      : "https://localhost:44385/api/user/authenticateViaRandomPassword";

    // Authenticate
    const response = await fetch(
      authUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    let data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id); // Set the user ID in local storage
      return { ...data, username: user.username };
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    thunkAPI.rejectWithValue(e.response.data);
  }
});


// Async thunk for updating password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ password }, thunkAPI) => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(`https://localhost:44385/api/user/updateUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, password }),
      });

      let data = await response.json();

      if (response.status === 200) {
        return data; 
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      thunkAPI.rejectWithValue(e.message);
    }
  }
);




// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    username: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("id");
    },
  },
  extraReducers: {
    // Register
    [register.fulfilled]: (state, { payload }) => {
      state.isAuthenticated = true;
      state.token = payload.token;
      state.username = payload.username;
      state.isLoading = false;
      state.error = null;
    },
    [register.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload.error;
    },
    [register.pending]: (state) => {
      state.isLoading = true;
    },
    [updatePassword.pending]: (state) => {
      state.isLoading = true;
    },
    [updatePassword.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
    },
    [updatePassword.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload.error;
    },

    // Login
    [login.fulfilled]: (state, { payload }) => {
      state.isAuthenticated = true;
      state.token = payload.token;
      state.username = payload.username;
      state.isLoading = false;
      state.error = null;
    },
    [login.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload.error;
    },
    [login.pending]: (state) => {
      state.isLoading = true;
    },
  },
});

// Exports
export const { logout } = authSlice.actions;
export default authSlice.reducer;
