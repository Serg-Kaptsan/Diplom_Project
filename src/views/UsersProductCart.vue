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

      <div class="product-list">

         <cart-item
            v-for="(cartItem, index) in cartItems"
            :key="index"
            :product="cartItem.product"
            :selectedNumber="cartItem.selectedNumber"
            :itemAmount="cartItem.itemAmount"
            v-bind="cartItem"
            @removeFromCart="removeFromCart(index)"
         >
         </cart-item>

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
   
   export default{
      components: {
         CartItem
      },
      props: {
         cartItem: {
            type: Object,
            default: () => ({}),
         }
      },
      data() {
         return {
            accessToken:localStorage.getItem('token'),
            cartItems: [],
            product: null,
            productDiscount: null,
            totalNumber: Number,
            totalAmount: Number,
         }
      },

      // computed: {
      //    totalNumber() {
      //       return this.cartItems.reduce((total, cartItem) => total + cartItem.selectedNumber, 0);
      //    },
      //    totalAmount() {
      //       return this.cartItems.reduce((total, cartItem) => total + cartItem.itemAmount, 0);
      //    }
      // },
      methods: {
         removeFromCart() {
            const index = this.cartItems.findIndex(item => item.product.id === productId);
   if (index !== -1) {
      this.cartItems.splice(index, 1);
   }
         }
      },
      mounted() {
        // Теперь вы можете использовать this.cartItem, чтобы получить объект корзины
        console.log('CartItem in UsersProductCart:', this.cartItem);
      },
      created () {
         console.log('cartItem in UsersProductCart:', this.$route.params.cartItem);
      }
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