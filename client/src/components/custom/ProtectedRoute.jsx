import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { pathname } = useLocation(); // Get the current path
    const { user, role } = useSelector((state) => state.auth); // Get authentication state from Redux
    const { cartItems } = useSelector((state) => state.cart); // Get the cart items from Redux

    // 1. Prevent authenticated admin from accessing admin login page
    if (user && role === 1 && pathname === '/admin/login') {
        return <Navigate to='/admin/dashboard' replace />;
    }

    // 2. Prevent regular users from accessing admin routes
    if (user && role === 0 && 
        (pathname.startsWith('/admin/dashboard') || pathname === '/admin/login')) {
        return <Navigate to='/' replace />;
    }

    // 3. Protect the admin dashboard from unauthenticated users
    if (!user && pathname.startsWith('/admin/dashboard')) {
        return <Navigate to='/login' replace />;
    }

    // 4. Redirect authenticated users away from auth pages (login, signup)
    if (user && (pathname === '/login' || pathname === '/signup')) {
        return <Navigate to='/' replace />;
    }

    // 5. Protect the orders page from unauthenticated users
    if (!user && pathname === '/orders') {
        return <Navigate to='/login' replace />;
    }

    // 6. Prevent users with empty carts from proceeding to checkout
    if (user && cartItems.length === 0 && pathname === '/checkout') {
        return <Navigate to='/' replace />;
    }

    return children; // If none of the conditions are met, render the children components (protected content)
};

export default ProtectedRoute;
