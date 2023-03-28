import { defineStore } from "pinia";

const state = {
  cart: [],
  loading: true,
  error: null,
};

export const useCart = defineStore("cartState", {
  state: () => state,
  actions: {
    addToCart(product) {
      const foundProductInCartIndex = this.cart.findIndex(
        (cartproduct) => product.slug === cartproduct.slug
      );

      if (foundProductInCartIndex > -1) {
        this.cart[foundProductInCartIndex].quantity += 1;
      } else {
        product.quantity = 1;
        this.cart.push(product);
      }
    },
    removeProductFromCart(product) {
      debugger
      this.cart.splice(this.cart.indexOf(el => el.key === product.key), 1);
    },
    clearCart() {
      this.cart.length = 0;
    },
  },
  getters: {
    getCartQuantity() {
      return this.cart.reduce((total, product) => total + product.quantity, 0);
    },
    getCartItems() {
      return this.cart
    },
    getCartTotal() {
      const currencySymbol = useRuntimeConfig().public.currencySymbol || "kr";

      return this.cart.reduce(
        (total, product) =>
          total +
          Number(product.price.replace(currencySymbol, "")) * product.quantity,
        0
      );
    },
  },
  persist: true,
});
