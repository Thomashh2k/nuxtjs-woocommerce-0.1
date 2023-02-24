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
  },
  getters: {
    getToken() {
        return this.jwt
    },

    getUser() {
        return this.user
    }
  },
  persist: true,
});
