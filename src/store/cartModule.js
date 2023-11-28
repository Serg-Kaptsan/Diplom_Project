export default {
    state: () => ({
      cartItems: [],
    }),
    mutations: {
      addToCart(state, cartItem) {
        state.cartItems.push(cartItem);
      }
    },
    actions: {
      addProductToCart({ commit }, cartItem) {
        commit('addToCart', cartItem);
      } 
    },
    getters: {
      getCartItems: (state) => state.cartItems,
    }
  }