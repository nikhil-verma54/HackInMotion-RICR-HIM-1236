
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

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

// =====================================================
// DJANGO BACKEND
// =====================================================

const API_URL = "http://127.0.0.1:8000";

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SEND FIREBASE USER TO DJANGO
  // Used after Firebase login/register
  // =====================================================

  const sendTokenToDjango = async (firebaseUser) => {
    console.log("🔵 Sending Firebase token to Django...");

    try {
      if (!firebaseUser) {
        console.error("❌ No Firebase user provided.");
        return null;
      }

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken(true);

      console.log("✅ Firebase ID token received");
      console.log("🆔 UID:", firebaseUser.uid);
      console.log("📧 Email:", firebaseUser.email);
      console.log("🔑 Token exists:", Boolean(idToken));

      // Send token to Django login endpoint
      const response = await fetch(
        `${API_URL}/api/auth/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          // Include credentials so Django can set/read session cookies
          credentials: "include",

          body: JSON.stringify({
            idToken: idToken,
          }),
        }
      );

      console.log(
        "🐍 Django login status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "🐍 Django login response:",
        data
      );

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

      return null;
    }
  };

  // =====================================================
  // AUTHENTICATED DJANGO REQUEST
  // Used for dashboard and protected APIs
  // =====================================================

  const djangoRequest = useCallback(
    async (endpoint, options = {}) => {
      console.log(
        "🔵 Starting authenticated Django request..."
      );

      try {
        // ==============================================
        // GET CURRENT FIREBASE USER
        // ==============================================

        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error(
            "❌ No Firebase user is currently logged in."
          );

          throw new Error(
            "No Firebase user is currently logged in."
          );
        }

        console.log(
          "🟢 Firebase user found"
        );

        console.log(
          "🆔 Firebase UID:",
          currentUser.uid
        );

        console.log(
          "📧 Email:",
          currentUser.email
        );

        // ==============================================
        // GET FRESH FIREBASE ID TOKEN
        // true forces Firebase to refresh the token
        // ==============================================

        const idToken =
          await currentUser.getIdToken(true);

        if (!idToken) {
          throw new Error(
            "Firebase ID token could not be obtained."
          );
        }

        console.log(
          "✅ Fresh Firebase ID token obtained"
        );

        console.log(
          "🔑 Token exists:",
          Boolean(idToken)
        );

        console.log(
          "🔑 Token length:",
          idToken.length
        );

        // ==============================================
        // CREATE HEADERS
        // ==============================================

        const headers = new Headers(
          options.headers || {}
        );

        headers.set(
          "Authorization",
          `Bearer ${idToken}`
        );

        // Only set Content-Type if a body exists, is not FormData,
        // and caller hasn't already specified it.
        if (
          options.body &&
          !headers.has("Content-Type") &&
          !(options.body instanceof FormData)
        ) {
          headers.set(
            "Content-Type",
            "application/json"
          );
        }

        console.log(
          "📨 Authorization header prepared:",
          headers.has("Authorization")
        );

        // ==============================================
        // SEND REQUEST TO DJANGO
        // ==============================================

        console.log(
          "🌐 Request URL:",
          `${API_URL}${endpoint}`
        );

        const response = await fetch(
          `${API_URL}${endpoint}`,
          {
            ...options,
            headers,
            // Include credentials to allow session-based fallback
            credentials: "include",
          }
        );

        console.log(
          "🐍 Django status:",
          response.status
        );

        // ==============================================
        // READ RESPONSE
        // ==============================================

        const contentType =
          response.headers.get(
            "content-type"
          );

        let data;

        if (
          contentType &&
          contentType.includes("application/json")
        ) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        console.log(
          "🐍 Django response:",
          data
        );

        // ==============================================
        // HANDLE ERROR
        // ==============================================

        if (!response.ok) {
          console.error(
            "❌ Django request failed:",
            response.status
          );

          if (typeof data === "object") {
            throw new Error(
              data.detail ||
              data.error ||
              "Django request failed."
            );
          }

          throw new Error(
            data ||
            "Django request failed."
          );
        }

        // ==============================================
        // SUCCESS
        // ==============================================

        console.log(
          "🟢 Django request successful"
        );

        return data;

      } catch (error) {
        console.error(
          "❌ djangoRequest failed:"
        );

        console.error(error);

        throw error;
      }
    },
    []
  );

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (
    email,
    password
  ) => {
    console.log(
      "🔵 Register started"
    );

    console.log(
      "📧 Email:",
      email
    );

    try {
      // ==============================================
      // FIREBASE REGISTRATION
      // ==============================================

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

      // ==============================================
      // SEND USER TO DJANGO
      // ==============================================

      const djangoResponse =
        await sendTokenToDjango(
          result.user
        );

      if (djangoResponse) {
        console.log(
          "✅ Django user created/updated"
        );

        console.log(
          "👤 Django response:",
          djangoResponse
        );
      } else {
        console.log(
          "⚠️ Firebase registration succeeded, but Django sync failed"
        );
      }

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

  const login = async (
    email,
    password
  ) => {
    console.log(
      "🔵 Email login started"
    );

    console.log(
      "📧 Email:",
      email
    );

    try {
      // ==============================================
      // FIREBASE LOGIN
      // ==============================================

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

      // ==============================================
      // CONNECT USER TO DJANGO
      // ==============================================

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
    console.log(
      "🔵 Google login started"
    );

    try {
      // ==============================================
      // FIREBASE GOOGLE LOGIN
      // ==============================================

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

      // ==============================================
      // SEND USER TO DJANGO
      // ==============================================

      const djangoResponse =
        await sendTokenToDjango(
          result.user
        );

      if (djangoResponse) {
        console.log(
          "✅ Google user authenticated with Django"
        );
      } else {
        console.log(
          "⚠️ Google Firebase login succeeded, but Django sync failed"
        );
      }

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
    console.log(
      "🔵 Logout started"
    );

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

    // Protected Django API
    djangoRequest,
  };

  // =====================================================
  // PROVIDER
  // =====================================================

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

