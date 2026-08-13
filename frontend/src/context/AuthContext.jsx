
import { createContext, useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

// Django backend
const API_URL = "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SEND FIREBASE USER TO DJANGO
  // =====================================================

  const sendTokenToDjango = async (firebaseUser) => {
    console.log("🔵 Sending Firebase token to Django...");

    try {
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      console.log("✅ Firebase ID token received");
      console.log("🆔 UID:", firebaseUser.uid);
      console.log("📧 Email:", firebaseUser.email);

      // Send token to Django
      const response = await fetch(
        `${API_URL}/api/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: idToken,
          }),
        }
      );

      console.log("🐍 Django status:", response.status);

      const data = await response.json();

      console.log("🐍 Django response:", data);

      if (!response.ok) {
        console.error(
          "❌ Django authentication failed"
        );

        return null;
      }

      console.log(
        "🟢 Firebase user successfully authenticated with Django"
      );

      return data;
    } catch (error) {
      console.error(
        "❌ Could not connect to Django"
      );

      console.error("Error:", error);

      // IMPORTANT:
      // Do NOT throw the error here.
      // Firebase login should remain successful even
      // while we are testing the Django connection.

      return null;
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (email, password) => {
    console.log("🔵 Register started");
    console.log("📧 Email:", email);

    try {
      // Firebase registration
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(
        "✅ Registration successful"
      );

      console.log(
        "👤 Firebase User:",
        result.user
      );

      console.log(
        "🆔 UID:",
        result.user.uid
      );

      console.log(
        "📧 Email:",
        result.user.email
      );

      // Send Firebase token to Django
      await sendTokenToDjango(result.user);

      // Return Firebase result exactly like
      // your original working code
      return result;
    } catch (error) {
      console.error(
        "❌ Registration failed"
      );

      console.error(
        "Error code:",
        error.code
      );

      console.error(
        "Error message:",
        error.message
      );

      throw error;
    }
  };

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const login = async (email, password) => {
    console.log("🔵 Email login started");
    console.log("📧 Email:", email);

    try {
      // ================================
      // STEP 1: FIREBASE LOGIN
      // ================================

      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(
        "✅ Email login successful"
      );

      console.log(
        "👤 Firebase User:",
        result.user
      );

      console.log(
        "🆔 UID:",
        result.user.uid
      );

      console.log(
        "📧 Email:",
        result.user.email
      );

      // ================================
      // STEP 2: DJANGO LOGIN
      // ================================

      console.log(
        "🔵 Now connecting Firebase user to Django..."
      );

      const djangoResponse =
        await sendTokenToDjango(
          result.user
        );

      if (djangoResponse) {
        console.log(
          "✅ Django authentication successful"
        );

        console.log(
          "👤 Django response:",
          djangoResponse
        );
      } else {
        console.log(
          "⚠️ Firebase login succeeded, but Django authentication did not complete"
        );
      }

      // ================================
      // IMPORTANT
      // ================================

      // Return Firebase result exactly
      // like your original working code.

      return result;
    } catch (error) {
      console.error(
        "❌ Email login failed"
      );

      console.error(
        "Error code:",
        error.code
      );

      console.error(
        "Error message:",
        error.message
      );

      throw error;
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const googleLogin = async () => {
    console.log("🔵 Google login started");

    try {
      // Firebase Google login
      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      console.log(
        "✅ Google login successful"
      );

      console.log(
        "👤 Firebase User:",
        result.user
      );

      console.log(
        "🆔 UID:",
        result.user.uid
      );

      console.log(
        "📧 Email:",
        result.user.email
      );

      console.log(
        "👨 Name:",
        result.user.displayName
      );

      console.log(
        "🖼️ Photo:",
        result.user.photoURL
      );

      // Send Firebase token to Django
      await sendTokenToDjango(
        result.user
      );

      // Return original Firebase result
      return result;
    } catch (error) {
      console.error(
        "❌ Google login failed"
      );

      console.error(
        "Error code:",
        error.code
      );

      console.error(
        "Error message:",
        error.message
      );

      throw error;
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    console.log("🔵 Logout started");

    try {
      await signOut(auth);

      console.log(
        "✅ Logout successful"
      );
    } catch (error) {
      console.error(
        "❌ Logout failed"
      );

      console.error(
        "Error code:",
        error.code
      );

      console.error(
        "Error message:",
        error.message
      );

      throw error;
    }
  };

  // =====================================================
  // AUTH STATE LISTENER
  // =====================================================

  useEffect(() => {
    console.log(
      "🟡 Setting up Firebase auth listener..."
    );

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          if (currentUser) {
            console.log(
              "🟢 User is authenticated"
            );

            console.log(
              "👤 User:",
              currentUser
            );

            console.log(
              "🆔 UID:",
              currentUser.uid
            );

            console.log(
              "📧 Email:",
              currentUser.email
            );

            console.log(
              "👨 Name:",
              currentUser.displayName
            );
          } else {
            console.log(
              "⚪ No authenticated user"
            );
          }

          setUser(currentUser);
          setLoading(false);
        }
      );

    return () => {
      console.log(
        "🔴 Firebase auth listener removed"
      );

      unsubscribe();
    };
  }, []);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}

