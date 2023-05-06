import { defineStore } from "pinia";

const state = {
    message: null
};

export const useSnackbar = defineStore("useSnackbar", {
  state: () => state,
  actions: {
    setMessage(msg) {
        this.message = msg
    },
    removeMessage() {
        this.message = null
    },
  },
  getters: {
    getMessage() {
        return this.message
    }
  },
});
