// ── Firebase Client Config ─────────────────────────────
// Replace with your Firebase project config from Firebase Console
// Go to: Firebase Console → Project Settings → General → Your apps → Web app
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Disable app verification for testing (remove in production)
// auth.settings.appVerificationDisabledForTesting = true

export { auth, RecaptchaVerifier, signInWithPhoneNumber }
export default app
