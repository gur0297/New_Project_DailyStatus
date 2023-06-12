import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching departments
export const fetchDepartments = createAsyncThunk(
  "auth/fetchDepartments",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://localhost:44385/api/department", {
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
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk(
  "auth/fetchRoles",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://localhost:44385/api/role", {
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
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// Async thunk for registration
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await fetch(
        "https://localhost:44385/api/user/register",
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
        return { ...data, username: user.username };
      } else {
        return thunkAPI.rejectWithValue({ error: data });
      }
    } catch (e) {
      console.log("Error", e);
      return thunkAPI.rejectWithValue({ error: e.message });
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    // Fetch password change status
    const statusResponse = await fetch(
      `https://localhost:44385/api/user/getPasswordChangeStatus/${user.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const passwordChangeStatus = await statusResponse.json();

    const authUrl = passwordChangeStatus
      ? "https://localhost:44385/api/user/authenticateViaEncryptPassword"
      : "https://localhost:44385/api/user/authenticateViaRandomPassword";

    // Authenticate
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    let data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("token", data.token);
      if (!passwordChangeStatus) {
        localStorage.setItem("id", data.id); // Set the user ID in local storage if passwordChangeStatus is false
      }
      return { ...data, passwordChangeStatus, username: user.username };
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    thunkAPI.rejectWithValue(e.message);
  }
});

// Async thunk for updating password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ password }, thunkAPI) => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://localhost:44385/api/user/updateUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, password }),
        }
      );

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

// Async thunk for verifying user
export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async ({ username, email }, thunkAPI) => {
    try {
      const response = await fetch(
        `https://localhost:44385/api/user/verify?username=${username}&email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// Async thunk for resetting password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({id, username, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `https://localhost:44385/api/user/updateUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id, username, password }),
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    username: null,
    isAuthenticated: localStorage.getItem("token") ? true : false,
    isLoggingIn: false, // Separate loading state for logging in
    isRegistering: false, // Separate loading state for registering
    error: null,
    departments: [],
    roles: [],
    isLoading: false,
    isVerifying: false,
    isResetting: false,
    verifyError: null,
    resetError: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoggingIn = true;
    },
    loginFailure: (state, action) => {
      state.isLoggingIn = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isRegistering = true;
    },
    registerFailure: (state, action) => {
      state.isRegistering = false;
      state.error = action.payload;
    },
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
      // state.isAuthenticated = true;
      // state.token = payload.token;
      state.username = payload.username;
      state.isRegistering = false;
      state.error = null;
    },
    [register.rejected]: (state, { payload }) => {
      state.isRegistering = false;
      state.error = payload.error;
    },
    [register.pending]: (state) => {
      state.isRegistering = true;
    },
    [updatePassword.pending]: (state) => {
      state.isLoading = true;
      state.error = null; // Clear error when updatePassword is pending
    },
    [updatePassword.fulfilled]: (state, { payload }) => {
      state.error = null;
    },
    [updatePassword.rejected]: (state, { payload }) => {
      state.error = payload.error;
    },
    // Login
    [login.fulfilled]: (state, { payload }) => {
      state.isAuthenticated = true;
      state.token = payload.token;
      state.username = payload.username;
      state.isLoggingIn = false;
      state.error = null;
    },
    [login.rejected]: (state, { payload }) => {
      state.isLoggingIn = false;
      state.error = payload;
    },
    [login.pending]: (state) => {
      state.isLoggingIn = true;
    },
    // Departments fetch
    [fetchDepartments.fulfilled]: (state, { payload }) => {
      state.departments = payload; // assuming payload is the list of departments
    },
    [fetchDepartments.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload.error;
    },
    [fetchDepartments.pending]: (state) => {
      state.isLoading = true;
    },
    // Roles fetch
    [fetchRoles.fulfilled]: (state, { payload }) => {
      state.roles = payload; // assuming payload is the list of roles
    },
    [fetchRoles.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload.error;
    },
    [fetchRoles.pending]: (state) => {
      state.isLoading = true;
    },
    [verifyUser.pending]: (state) => {
      state.isVerifying = true;
      state.verifyError = null;
    },
    [verifyUser.fulfilled]: (state) => {
      state.isVerifying = false;
    },
    [verifyUser.rejected]: (state, { payload }) => {
      state.isVerifying = false;
      state.verifyError = payload;
    },
    [resetPassword.pending]: (state) => {
      state.isResetting = true;
      state.resetError = null;
    },
    [resetPassword.fulfilled]: (state) => {
      state.isResetting = false;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      state.isResetting = false;
      state.resetError = payload;
    },
  },
});

// Exports
export const {
  loginStart,
  loginFailure,
  registerStart,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
