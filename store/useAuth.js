import { defineStore } from "pinia";

const state = {
  user: {
    email: null,
    firstName: null,
    lasstName: null,
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
  jwt: '',
  refreshJwt: '',
  customerJwt: '',
};

export const useAuth = defineStore("userState", {
  state: () => state,
  actions: {
    setToken(token) {
      this.jwt = token
    },
    setRefreshToken(token) {
      this.refreshJwt = token
    },
    setCustomerJwt(token) {
      this.customerJwt = token
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
          lasstName: null,
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
        }
      })
      this.jwt = ''
      this.refreshJwt = ''
      this.customerJwt = ''
      this.user = {}
      this.customer = {}
    }
  },
  getters: {
    getToken() {
      return this.jwt
    },
    getRefreshToken() {
      return this.refreshJwt
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
      return this.jwt !== ''
    }
  },
  persist: true,
});
