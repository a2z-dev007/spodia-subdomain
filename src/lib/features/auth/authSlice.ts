/* ---------------------------------------------------------------
   Auth slice ‒ Redux Toolkit with real API integration
---------------------------------------------------------------- */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { loginApi } from "@/services/api"

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  profile_image: string | null
  permissions: string[]
  role_id: string
  is_superuser: boolean
  user_type: string
  city_id: number | null
  region_id: number | null
  address_line1: string | null
  address_line2: string | null
  country_id: number | null
  company_name: string | null
  secondary_phone_ext: string | null
  city: string | null
  secondary_phone: string | null
  gender: string | null
  languages_spoken: string | null
  language: string
  about_me: string | null
  hometown: string | null
  school: string | null
  created_at: string
  region: string | null
  country: string | null
  pin_code: string | null
  latitude: number | null
  longitude: number | null
  office: string | null
  parent: string | null
  status: boolean
  status_remark: string | null
  role_name: string
  full_name: string
  url: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true to prevent flash
  error: null,
  accessToken: null,
  refreshToken: null,
}

/* async thunks ---------------------------------------------------- */
export const loginUser = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginApi({ email, password })
      const { user, access, refresh } = response.data

      // Store tokens in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("spodia_access_token", access)
        localStorage.setItem("spodia_refresh_token", refresh)
        localStorage.setItem("spodia_user", JSON.stringify(user))
      }

      return {
        user,
        accessToken: access,
        refreshToken: refresh,
      }
    } catch (error: any) {
      let errorMessage = "Login failed. Please check your credentials."
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        // Extract error message from various possible fields
        const apiErrorMessage = data?.detail || data?.message || data?.error
        
        switch (status) {
          case 400:
            errorMessage = apiErrorMessage || "Invalid request. Please check your input."
            break
          case 401:
            // Handle the specific "No active account found" message
            if (apiErrorMessage?.toLowerCase().includes("no active account")) {
              errorMessage = "No active account found with the given credentials. Please check your email and password."
            } else {
              errorMessage = apiErrorMessage || "Invalid credentials. Please check your email and password."
            }
            break
          case 403:
            errorMessage = apiErrorMessage || "Account access denied. Please contact support."
            break
          case 404:
            errorMessage = apiErrorMessage || "Account not found. Please check your email or sign up."
            break
          case 422:
            errorMessage = apiErrorMessage || "Invalid data provided. Please check your input."
            break
          case 429:
            errorMessage = apiErrorMessage || "Too many login attempts. Please try again later."
            break
          case 500:
            errorMessage = "Server error. Please try again later."
            break
          case 502:
          case 503:
          case 504:
            errorMessage = "Service temporarily unavailable. Please try again later."
            break
          default:
            errorMessage = apiErrorMessage || `Login failed (${status}). Please try again.`
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection."
      } else {
        // Other error
        errorMessage = error.message || "An unexpected error occurred."
      }
      
      return rejectWithValue(errorMessage)
    }
  },
)

export const initializeAuth = createAsyncThunk<{
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}>("auth/initializeAuth", async () => {
  if (typeof window !== "undefined") {
    const userRaw = localStorage.getItem("spodia_user")
    const accessToken = localStorage.getItem("spodia_access_token")
    const refreshToken = localStorage.getItem("spodia_refresh_token")
    
    if (userRaw && accessToken) {
      try {
        const user = JSON.parse(userRaw) as User
        return { user, accessToken, refreshToken }
      } catch {
        // Clear corrupted data
        localStorage.removeItem("spodia_user")
        localStorage.removeItem("spodia_access_token")
        localStorage.removeItem("spodia_refresh_token")
      }
    }
  }
  return { user: null, accessToken: null, refreshToken: null }
})

/* slice ----------------------------------------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
      state.accessToken = null
      state.refreshToken = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("spodia_user")
        localStorage.removeItem("spodia_access_token")
        localStorage.removeItem("spodia_refresh_token")
      }
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("spodia_user", JSON.stringify(action.payload))
      }
    },
    clearError(state) {
      state.error = null
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      if (typeof window !== "undefined") {
        localStorage.setItem("spodia_access_token", action.payload.accessToken)
        localStorage.setItem("spodia_refresh_token", action.payload.refreshToken)
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginUser.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading = false
        s.user = a.payload.user
        s.accessToken = a.payload.accessToken
        s.refreshToken = a.payload.refreshToken
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload ?? "Login failed"
      })
      .addCase(initializeAuth.pending, (s) => {
        s.isLoading = true
      })
      .addCase(initializeAuth.fulfilled, (s, a) => {
        s.isLoading = false
        s.user = a.payload.user
        s.accessToken = a.payload.accessToken
        s.refreshToken = a.payload.refreshToken
      })
      .addCase(initializeAuth.rejected, (s) => {
        s.isLoading = false
        s.user = null
        s.accessToken = null
        s.refreshToken = null
      }),
})

export const { logout, updateUser, clearError, setTokens } = authSlice.actions
export default authSlice.reducer
