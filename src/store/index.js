import { createStore } from 'vuex';
import cartModule from '@/store/cartModule.js';

export default createStore({
  state: {
    isAdminButton: false,
  },
  getters: {

  },
  mutations: {
    setAdminButtonVisible(state, isVisible) {
      state.isAdminButton = isVisible;
    },
  },
  actions: {

  },
  modules: {
    cart: cartModule,
  },
})
