import { createSlice } from "@reduxjs/toolkit";

// Get cart state from localStorage or initialize empty
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// Format price to 2 decimal places
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Helper function to update cart prices
const updateCart = (state) => {
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  state.taxPrice = addDecimals(0.15 * state.itemsPrice);

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x._id !== action.payload
      );

      updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.Payment = action.payload;
      updateCart(state);
    },
    clearCartItems:(state,action)=>{
      state.cartItems = [];
      updateCart(state);
    }
  },
});

export const { addToCart, removeFromCart, clearCartItems, saveShippingAddress,savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
