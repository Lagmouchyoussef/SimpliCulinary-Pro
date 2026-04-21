import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        try {
            const { data } = await axios.get('http://127.0.0.1:8001/cart/api/');
            const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(total);
        } catch (error) {
            console.error("Erreur compteur panier:", error);
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
