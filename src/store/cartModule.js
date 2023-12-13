import axios from 'axios';

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
        cartItem.selectedNumber = 1;
        state.cartItems.push(cartItem);
        this.commit('recalculateTotals');
      },

      removeFromCart (state, productId) {
        console.log('Removing product with id:', productId);
        const index = state.cartItems.findIndex(item => item.productId === productId);
        if (index !== -1) {
          state.cartItems.splice(index, 1);
          this.commit('recalculateTotals');
        }
      },

      setItemAmount(state, { productId, itemAmount }) {
        const cartItem = state.cartItems.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.itemAmount = itemAmount;
        }
      },

      updateCartItemQuantity(state, { productId, quantity }) {
        const cartItem = state.cartItems.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.selectedNumber = quantity;
          cartItem.itemAmount = (cartItem.discountPrice * quantity).toFixed(2);
        }
        this.commit('recalculateTotals');
      },

      recalculateTotals(state) {
        state.totalNumber = state.cartItems.reduce((total, cartItem) => {
          console.log('CartItem selectedNumber:', cartItem.selectedNumber);
          return total + cartItem.selectedNumber;
        }, 0);
    
        state.totalAmount = state.cartItems.reduce((total, cartItem) => total + parseFloat(cartItem.itemAmount) || 0, 0);
    
        console.log('Total Number:', state.totalNumber);
        console.log('Total Amount:', state.totalAmount);
      },
      removeAllFromCart(state) {
        state.cartItems = [];
        this.commit('recalculateTotals');
      }
    },
    actions: {
      addProductToCart({ commit }, cartItem) {
        commit('addToCart', cartItem);
        commit('recalculateTotals');
      },

      recalculateItemAmount({ commit }, { productId, discountPrice, selectedNumber }) {
        const itemAmount = (discountPrice * selectedNumber).toFixed(2);
        commit('setItemAmount', { productId, itemAmount });
      },

      removeFromCart({commit, dispatch}, productId) {
        commit ('removeFromCart', productId);
        dispatch ('recalculateTotals');
      },

      recalculateTotals({ commit }) {
        commit('recalculateTotals');
      },

      removeAllFromCart({commit}) {
        commit('removeAllFromCart');
      },
      
      async deleteProductsFromServer({ commit, state }) {
        try {
          const token = localStorage.getItem('token');
          const sessionId = localStorage.getItem('sessionId');

          if (!sessionId || state.cartItems.length === 0) {
            console.log('No sessionId or no items in the cart. Skipping delete request.');
            return;
          }
          const response = await axios.delete(`http://localhost:8081/cart/${sessionId}/items`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (response.status >= 200 && response.status < 300) {
            commit('removeAllFromCart');
            console.log('Cart successfully deleted from the server.');
          } else {
            console.error(`Failed to delete cart from the server. Status: ${response.status}`);
            throw new Error('Failed to delete cart from the server.');
          }
      
          commit('recalculateTotals');
        } catch (error) {
          console.error('Error during the request:', error.message);
          throw new Error('Error during the request.');
        }
      }
    },

    getters: {
      getCartItems: (state) => state.cartItems,
      stateTotalNumber: (state) => state.totalNumber,
      stateTotalAmount: (state) => state.totalAmount,
      getItemAmount: (state) => (productId) => {
        const cartItem = state.cartItems.find(item => item.productId === productId);
        return cartItem ? cartItem.itemAmount : 0;
      },
    },
  }