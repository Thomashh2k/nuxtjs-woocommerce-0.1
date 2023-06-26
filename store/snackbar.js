import { defineStore } from "pinia";

const state = {
    message: null,
    type: null
};

export const useSnackbar = defineStore("useSnackbar", {
  state: () => state,
  actions: {
    setMessage( msg, type ) {
      
        this.message = msg
        this.type = type
    },
    removeMessage() {
        this.message = null
    },
  },
  getters: {
    getMessage() {
        return this.message
    },
    getType() {
      return this.type
    }
  },
});
