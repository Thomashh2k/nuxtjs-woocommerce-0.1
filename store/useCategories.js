import { defineStore } from "pinia";

const state = {
  categories: [],
  selectedCategory: null
};

export const useCategories = defineStore("categoriesState", {
  state: () => state,
  actions: {
    setCategories(categories) {
        this.categories = categories
    },
    setActiveCategory(category) {
      this.selectedCategory = category
    }
  },
  getters: {
    getAllCategories() {
        return this.categories
    },
    getActiveCategory() {
      return this.selectedCategory
    },
    getChildCategories() {
      return this.categories
    }
  },
  persist: true,
});
