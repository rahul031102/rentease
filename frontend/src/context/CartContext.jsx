import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // {product, quantity, tenureMonths}

  const addToCart = (product, tenureMonths) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, tenureMonths }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const updateTenure = (productId, tenureMonths) => {
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, tenureMonths } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalMonthly = items.reduce(
    (sum, i) => sum + i.product.monthlyRent * i.quantity,
    0
  );
  const totalDeposit = items.reduce(
    (sum, i) => sum + i.product.securityDeposit * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateTenure,
        clearCart,
        totalMonthly,
        totalDeposit,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
