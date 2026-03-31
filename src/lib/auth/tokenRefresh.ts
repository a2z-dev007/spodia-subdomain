import apiClient from "@/lib/api/apiClient"
import { store } from "@/lib/store"
import { setTokens, logout } from "@/lib/features/auth/authSlice"

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("spodia_refresh_token")
    
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    // ✅ Call API directly instead of importing from services/api
    const response = await apiClient.post("/token/refresh/", { refresh: refreshToken })
    const { access } = response.data
    
    // Update tokens in store and localStorage
    const currentRefreshToken = localStorage.getItem("spodia_refresh_token")
    store.dispatch(setTokens({ 
      accessToken: access, 
      refreshToken: currentRefreshToken || refreshToken 
    }))

    return access
  } catch (error: any) {
    // If refresh token is expired (401), logout immediately
    if (error.response?.status === 401) {
      console.log("Refresh token expired. Logging out...")
      handleLogout()
    }
    return null
  }
}

export const handleLogout = () => {
  store.dispatch(logout())
  
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

// Enhanced fetch wrapper with 401 handling
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("spodia_access_token")
  
  // Don't set Content-Type for FormData (let browser set it with boundary)
  const isFormData = options.body instanceof FormData
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
    ...(token && { Authorization: `Bearer ${token}` })
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  // Handle 401 Unauthorized
  if (response.status === 401) {
    if (isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        // Retry with new token
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`
        }
        return fetch(url, {
          ...options,
          headers: retryHeaders
        })
      })
    }

    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()
      
      if (newToken) {
        processQueue(null, newToken)
        isRefreshing = false
        
        // Retry original request with new token
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`
        }
        return fetch(url, {
          ...options,
          headers: retryHeaders
        })
      } else {
        processQueue(new Error("Token refresh failed"), null)
        isRefreshing = false
        handleLogout()
        throw new Error("Authentication failed")
      }
    } catch (error) {
      processQueue(error, null)
      isRefreshing = false
      handleLogout()
      throw error
    }
  }

  return response
}

// Add response interceptor to handle token refresh for axios
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // ✅ IMPORTANT: Don't intercept 401 errors for login/signup/public endpoints
    // These should be handled by the component, not the interceptor
    const publicEndpoints = ["/token/", "/registration/", "/activation/", "/verify-email/", "/send-password-recovery-link/", "/set-new-password/"]
    const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))

    // Don't retry if this is already a token refresh request or a public endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint && originalRequest.url !== "/token/refresh/") {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            }, 
            reject 
          })
        })
      }

      isRefreshing = true

      try {
        const newAccessToken = await refreshAccessToken()
        
        if (newAccessToken) {
          processQueue(null, newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } else {
          processQueue(new Error("Token refresh failed"), null)
          handleLogout()
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleLogout()
      } finally {
        isRefreshing = false
      }
    } else if (error.response?.status === 401 && originalRequest.url === "/token/refresh/") {
      // If refresh token itself returns 401, logout immediately
      handleLogout()
    }

    return Promise.reject(error)
  }
)