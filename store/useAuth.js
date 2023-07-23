import { defineStore } from "pinia";


const state = {
  user: {
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    freshlyRegistered: false
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
    },
    orders: {

    }
  },
  refreshJwt: '',
  jwt: ''
};

export const useAuth = defineStore("userState", {
  state: () => state,
  actions: {
    setRefreshToken(token) {
      this.refreshJwt = token
    },
    setAuthToken(token) {
      this.jwt = token
    },
    setUser(user) {
        this.user = user
    },
    setCustomer(customer) {
      this.customer = customer
    },
    logout() {
      Object.assign(state, {
        user: {
          email: null,
          firstName: null,
          lastName: null,
          username: null,
          freshlyRegistered: false
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
          },
          orders: {
      
          },
          refreshJwt: '',
          jwt: ''
        }
      })
      this.jwt = ''
      this.refreshJwt = ''
      this.customerJwt = ''
      this.user = {}
      this.customer = {}
    }
  },
  watch: {

  },
  getters: {
    getRefreshToken() {
      return this.refreshJwt
    },
    getAuthToken() {
      return this.jwt
    },
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
    getOrders() {
      return this.customer.orders
    },
    isLoggedIn() {
      const isLoggedIn = this.refreshJwt !== ''
      return isLoggedIn
    }
  },
  persist: true,
});
