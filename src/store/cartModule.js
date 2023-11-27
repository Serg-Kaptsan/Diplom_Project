export default {
    state: () => ({
      cartItems: [],
    //   quantity: 1,
    //   shoppingSessionId: sessionId,
    //   productId: product.id
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