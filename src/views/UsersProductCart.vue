<template>
   <h1> 
      Your shopping cart
   </h1>
   <div class="cart-container">

      <header>
         <h3>
            List of selected products                
         </h3>
         <button class="btn btn-primary right-button"
            @click="$router.push('/')" 
         >
            Back to Product List
         </button>
      </header>

      <div class="list-body">
         <div class="product-list"
            v-if="getCartItems.length">
            <cart-item
               v-for="(getCartItem, productId) in getCartItems"
               :key="productId"
               :getCartItem="{ ...getCartItem, selectedNumber: getCartItem.quantity }"
               :productId="productId"
               @removeFromCart="removeFromCart"
            >
            </cart-item>
         </div>
         <div v-else class="alter-head">
            <h3> Your grocery cart is empty </h3>
         </div>

         <hr class="border border-primary border-3 opacity-75 line">
         <div class="count-block">

            <div class="count">
               <div class="count-text">
                  Number of selected products            
               </div>
               <div class="calculation"> {{ stateTotalNumber  }} </div>
            </div>

            <div class="count">
               <div class="count-text">
                  Total purchase amount            
               </div>
               <div class="calculation"> {{ stateTotalAmount  }} $ </div>
            </div>

         </div>
      </div>
   </div>
</template>

<script>
   import axios from 'axios';
   import CartItem from '@/components/CartItem';
   import { mapGetters } from 'vuex';

   export default{
      components: {
         CartItem,
      },
      // props: {
      //    cartItem: {
      //       type: Object,
      //       default: () => ({}),
      //    }
      // },
      data() {
         return {
            accessToken:localStorage.getItem('token'),
            cartItems: [],
            getCartItem: {
               quantity: Number,
               productId: Number,
            },
            // totalNumber: 0,
            // totalAmount: 0,
         }
      },

      computed: {
         ...mapGetters(['getCartItems', 'stateTotalNumber', 'stateTotalAmount']),
         // totalNumber() {
         //    return this.getCartItems.reduce((total, cartItem) => total + cartItem.selectedNumber, 0);
         // },
         // totalAmount() {
         //    return this.getCartItems.reduce((total, cartItem) => total + cartItem.itemAmount, 0);
         // }
      },
      methods: {
         addToCart(cartItem) {
            this.$store.dispatch('addProductToCart', cartItem);
            this.$store.dispatch('recalculateTotals');
         },
         removeFromCart(productId) {
            this.$store.dispatch('removeFromCart', productId);
         },
      },
      created () {
         // this.cartItems = this.getCartItems;
         console.log('getCartItems in UsersProductCart:', this.getCartItems);
      },
      mounted() {
         // this.cartItems = this.getCartItems;
        console.log('CartItem in UsersProductCart:', this.getCartItem);
        console.log('this.stateTotalNumber in Component:', this.stateTotalNumber);
        console.log('this.stateTotalAmount in Component:', this.stateTotalAmount);
      },
   }
</script>

<style scoped>
   h1{
      text-align: center;
      margin-top: 50px;
   }
   .cart-container{
      background-color: beige;
      margin: 25px 40px;
      padding: 10px;
   }   
   header{
      display: flex;
      justify-content: space-between;
      margin: auto 25px;
   }
   .right-button{
      float: right;
   }
   .line {
      display: flex;
      width: 75%;
      margin-left: auto;
      }
   .count-block{
      width: 95%;
      padding: 10px;     
   }
   .count{
      display: flex;
      justify-content: end;
      font-size: 24px;
      padding: 5px;
   }
   .calculation{
      width: 150px;
      font-weight: 500;
      text-align: center;
   }
   .alter-head{
        width:95%;
        height: 50px;
        margin: 20px auto;
        padding-top: 8px;
        text-align: center;
        color: red;
        background-color: white;
        font-weight: 600;
    }
</style>