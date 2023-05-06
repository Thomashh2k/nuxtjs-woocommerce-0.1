// Used when a non registered user successfully checksout and gets redirected to /order-received
//
import { defineStore } from "pinia";

const state = {
  order: {},
};

export const useOrderReceived = defineStore("useOrderReceived", {
  state: () => state,
  actions: {
    setOrder(order) {
        this.jwt = order
    },

  },
  getters: {
    getOrder() {
        return this.order
    },

  },
});
