import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/cart/api/`);
            const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(total);
        } catch (error) {
            console.error("Error updating cart counter:", error);
        }
    };

    useEffect(() => {
        updateCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
