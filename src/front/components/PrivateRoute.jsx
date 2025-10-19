import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    return store.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;