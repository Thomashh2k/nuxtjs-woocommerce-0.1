import { defineStore } from "pinia";

const state = {
  cart: [],
  cartDetails: null,
  cartId: null,
};

export const useCart = defineStore("cartState", {
  state: () => state,
  actions: {
    addToCart(product) {
      
      const foundProductInCartIndex = this.cart.findIndex(
        (cf) => product.slug === cf.slug
      );

      if (foundProductInCartIndex > -1) {
        this.cart.push(product);
        this.cart[foundProductInCartIndex].quantity += 1;
      } else {
        product.quantity = 1;
        this.cart.push(product);
      }
    },
    addCartDetails(details) {
      this.cartDetails = details
    },
    addCartId(cartId) {
      this.cartId = cartId
    },
    removeProductFromCart(product) {
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
    getCartDetails() {
      return this.cartDetails
    },
    getCartId() {
      return this.cartId
    },
    getCartTotal() {
      return this.cart.reduce(
        (total, item) => {
          // Remove '&nbsp;€' because we need a Number not a string
          const noSpecialCharacter = item.price.replace('&nbsp;€', "")
          // Replace commas with dots because javascript is too stupid for commas...
          const noCommas = noSpecialCharacter.replace(',', ".")
          // Convert to Number
          const number = Number(noCommas) * item.quantity
          return total + Number(number) * item.quantity
        },
        0
      );
    },
  },
  persist: true,
});
