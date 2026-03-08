import { createContext, useContext, useState, useEffect } from 'react'
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase'
import { authAPI, setToken, removeToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await authAPI.getMe()
        setUser(data.user)
        setIsAuthenticated(true)
      } catch {
        removeToken()
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  // Set up invisible reCAPTCHA
  const setupRecaptcha = (elementId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
      })
    }
    return window.recaptchaVerifier
  }

  // Send OTP via Firebase
  const sendOtp = async (phone) => {
    const appVerifier = setupRecaptcha('recaptcha-container')
    const fullPhone = `+91${phone}`
    const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, appVerifier)
    window.confirmationResult = confirmationResult
    return { message: 'OTP sent successfully!' }
  }

  // Verify OTP and authenticate with backend
  const verifyOtp = async (otp) => {
    if (!window.confirmationResult) {
      throw new Error('Please send OTP first')
    }

    // Verify OTP with Firebase
    const result = await window.confirmationResult.confirm(otp)
    const firebaseUser = result.user

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken()

    // Send to our backend for JWT
    const data = await authAPI.firebaseLogin(idToken)
    setToken(data.token)
    setUser(data.user)
    setIsAuthenticated(true)

    return data
  }

  const updateProfile = async (profileData) => {
    const data = await authAPI.updateProfile(profileData)
    setUser(data.user)
    return data
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsAuthenticated(false)
    // Clean up recaptcha
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
    window.confirmationResult = null
    // Sign out from Firebase too
    auth.signOut().catch(() => {})
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      sendOtp,
      verifyOtp,
      updateProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
