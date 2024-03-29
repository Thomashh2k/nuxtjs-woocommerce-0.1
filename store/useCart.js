import { defineStore } from "pinia";

export const useCart = defineStore("cartState", {
  state: () => ({
    details: null,
    items: [],
  }),
  actions: {
    addTemporary(product) {
      let _index = 0
      
      const foundProductInCartIndex = this.items.findIndex(
        (cf) => product.slug === cf.slug
      );

      if (foundProductInCartIndex > -1) {

        // Change to .splice() to make it reactive
        this.items[foundProductInCartIndex] = {
          quantity: this.items[foundProductInCartIndex].quantity += 1,
          product: this.items[foundProductInCartIndex].product,
          key: this.items[foundProductInCartIndex].key
        }
        return foundProductInCartIndex
      } else {
        let temp = {
          key: null,
          quantity: 1,
          product: product,
        }
        _index = this.items.push(temp);
      }
      // potentially retrun bug
      // return { index: _index-1, new: true }
      return _index-1
    },
    addAfterSuccess(key, addTempRes) {
      debugger

      // 
      // if(addTempRes.new) {
        this.items[addTempRes] = {
          key: key,
          quantity: this.items[addTempRes].quantity,
          product: this.items[addTempRes].product
        }
      // } else {
      //   this.items[addTempRes.index] = {
      //     key: key,
      //     quantity: this.items[addTempRes.index].quantity,
      //     product: this.items[addTempRes.index].product
      //   }
      // }
    },
    addDetails(details) {
      debugger
      this.details = details
    },
    removeItem(product) {
      this.items.splice(this.items.indexOf(el => el.key === product.key), 1);
    },
    clear() {
      this.details = null
      this.items = []
    },
  },
  getters: {
    getCartQuantity() {
      return this.items.reduce((total, product) => total + product.quantity, 0);
    },
    getItems() {
      return this.items
    },
    getDetails() {
      return this.details
    },
    getCartTotal() {
      let total = 0;
    
      for (const item of this.items) { // Hier wurde "items" zu "this.items" geändert
        // Remove '&nbsp;€' because we need a Number not a string
        const noSpecialCharacter = item.product.price.replace('&nbsp;€', ''); // Auch "item.price" wurde zu "item.product.price" geändert, da "price" unter "product" gespeichert ist
        // Replace commas with dots because javascript is too stupid for commas...
        const noCommas = noSpecialCharacter.replace(',', '.');
        // Convert to Number
        const number = Number(noCommas) * item.quantity;
        total += number;
      }
    
      return total;
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});
