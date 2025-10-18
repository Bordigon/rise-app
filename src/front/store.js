// src/front/store/store.js

const STORAGE_KEY = "rise_auth"; // Key for localStorage

// Function to load initial state from localStorage
export const initialStore = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        // If data exists, parse it. Otherwise, initialize with user: null
        return raw ? JSON.parse(raw) : { user: null, token: null };
    } catch (error) {
        console.error("Error loading auth data from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
        return { user: null, token: null };
    }
};

// The reducer function that handles state updates based on dispatched actions
export default function storeReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            // When login is successful, store the user data and token
            const authData = { user: action.payload.user, token: action.payload.token };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
            console.log("LOGIN_SUCCESS:", authData); // For debugging
            return { ...state, ...authData }; // Update the state

        case "LOGOUT":
            // When logging out, clear the stored data
            localStorage.removeItem(STORAGE_KEY);
            console.log("LOGOUT"); // For debugging
            return { user: null, token: null }; // Reset the state

        default:
            // For any other action, return the current state unchanged
            return state;
    }
}