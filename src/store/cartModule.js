export default {
    state: () => ({
      cartItems: [],
      totalNumber: 0,
      totalAmount: 0,
      selectedNumber: Number,
      itemAmount: 0,
    }),
    mutations: {
      addToCart(state, cartItem) {
        cartItem.selectedNumber = cartItem.quantity;
        state.cartItems.push(cartItem);
        this.commit('recalculateTotals');
      },
      removeFromCart (state, productId) {
        const index = state.cartItems.findIndex(item => item.productId === productId);
        if (index !== -1) {
          state.cartItems.splice(index, 1);
          this.commit('recalculateTotals');
        }
      },
      updateCartItemQuantity(state, { productId, quantity }) {
        const cartItem = state.cartItems.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.selectedNumber = quantity;
        }
        this.commit('recalculateTotals');
      },
      recalculateTotals(state) {
        const stateTotalNumber = state.cartItems.reduce((total, cartItem) => {
          console.log('CartItem selectedNumber:', cartItem.selectedNumber);
          return total + cartItem.selectedNumber;
        }, 0);
        const stateTotalAmount = state.cartItems.reduce((total, cartItem) => total + cartItem.itemAmount, 0);
        console.log('Total Number:', stateTotalNumber);
        console.log('Total Amount:', stateTotalAmount);
        state.totalNumber = stateTotalNumber;
        state.totalAmount = stateTotalAmount;
      },
      setSelectedNumber(state, value) {
        console.log('Setting selectedNumber to:', value);
        state.selectedNumber = value;
      },
      setItemAmount(state, value) {
        state.itemAmount = value;
      },
      setTotalNumber(state, totalNumber) {
        state.totalNumber = totalNumber;
      },
      setTotalAmount(state, totalAmount) {
        state.totalAmount = totalAmount;
      }
    },
    actions: {
      addProductToCart({ commit }, cartItem) {
        commit('addToCart', cartItem);
        commit('recalculateTotals');
      },
      removeFromCart({commit, dispatch}, productId) {
        commit ('removeFromCart', productId);
        dispatch ('recalculateTotals');
      },
      recalculateTotals({ commit }) {
        commit('recalculateTotals');
      },

    },
    getters: {
      getCartItems: (state) => state.cartItems,
      stateTotalNumber: (state) => state.totalNumber,
      stateTotalAmount: (state) => state.totalAmount,
      getSelectedNumber: (state) => state.selectedNumber,
    },
  }