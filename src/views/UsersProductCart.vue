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
         v-for="(getCartItem, productId) in getCartItems"
         :key="productId">
         <cart-item
            :getCartItem="getCartItem"
            :productId="productId"
            @removeFromCart="removeFromCart"
         >
         </cart-item>         
      </div>


         <hr class="border border-primary border-3 opacity-75 line">
         <div class="count-block">

            <div class="count">
               <div class="count-text">
                  Number of selected products            
               </div>
               <div class="calculation"> {{ totalNumber }} </div>
            </div>

            <div class="count">
               <div class="count-text">
                  Total purchase amount            
               </div>
               <div class="calculation"> {{ totalAmount }} $ </div>
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
            // cartItems: [],
            // getCartItem: {
            //    quantity: 1,
            //    productId: Number,
            // },
            // product: null,
            // productDiscount: null,
            totalNumber: Number,
            totalAmount: Number,
         }
      },

      computed: {
         ...mapGetters(['getCartItems']),
      //    totalNumber() {
      //       return this.cartItems.reduce((total, cartItem) => total + cartItem.selectedNumber, 0);
      //    },
      //    totalAmount() {
      //       return this.cartItems.reduce((total, cartItem) => total + cartItem.itemAmount, 0);
      //    }
      },
      methods: {
         removeFromCart(productId) {
            this.$store.dispatch('removeProductFromCart', productId);
            alert(`The product code ${productId} was successfully removed from the cart`)
         },

         addToCart(cartItem) {
            this.$store.dispatch('addProductToCart', cartItem);
         },
      },
      created () {
         console.log('getCartItems in UsersProductCart:', this.getCartItems);
      },
      mounted() {
        console.log('CartItem in UsersProductCart:', this.getCartItem);
      },
   }
</script>

<style scoped>
   h1{
      text-align: center;
      margin-top: 50px;
   }
   header{
      display: flex;
      justify-content: space-between;
      margin: auto 25px;
   }
   .right-button{
      float: right;
   }
   .cart-container{
      background-color: beige;
      margin: 25px 40px;
      padding: 10px;
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
</style>