import { defineStore } from "pinia";

const state = {
  user: {

  },
  jwt: ''
};

export const useAuth = defineStore("userState", {
  state: () => state,
  actions: {
    setToken(token) {
        this.jwt = token
    },
    setUser(user) {
        this.user = user
    },
    logout() {
      this.jwt = ''
      this.user = {}
    }
  },
  getters: {
    getToken() {
        return this.jwt
    },
    getUser() {
        return this.user
    },
    isLoggedIn() {
      return this.jwt !== ''
    }
  },
  persist: true,
});
