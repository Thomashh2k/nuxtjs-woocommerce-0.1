import { defineStore } from "pinia";


const state = {
  user: {
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    freshlyRegistered: false,
    isLoggedIn: false
  },
  customer: {
    billing: {
      address1: '',
      address2: '',
      city: '',
      country: '',
      firstName: '',
      lastName: '',
      postcode: ''
    },
    shipping: {
      address1: '',
      address2: '',
      city: '',
      country: '',
      firstName: '',
      lastName: '',
      postcode: ''
    }
  },
};

export const useAuth = defineStore("userState", {
  state: () => state,
  actions: {
    setUser(user) {
        this.user = user
    },
    setCustomer(customer) {
      this.customer = customer
    },
    logout() {
      this.user = {}
      this.customer = {}
      Object.assign(state, {
        user: {
          email: null,
          firstName: null,
          lastName: null,
          username: null,
          freshlyRegistered: false,
          isLoggedIn: false
        },
        customer: {
          billing: {
            address1: '',
            address2: '',
            city: '',
            country: '',
            firstName: '',
            lastName: '',
            postcode: ''
          },
          shipping: {
            address1: '',
            address2: '',
            city: '',
            country: '',
            firstName: '',
            lastName: '',
            postcode: ''
          }
        }
      })
    },
    setLoginStatus(status) {
      this.user.isLoggedIn = status
    }
  },
  watch: {

  },
  getters: {
    getUser() {
      return this.user
    },
    getCustomer() {
      return this.customer
    },
    getBilling() {
      return this.customer.billing
    },
    getShipping() {
      return this.customer.shipping
    },
    isUserLoggedIn() {
      return this.user.isLoggedIn
    }
  },
  persist: true,
});
