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
                  v-for="item in getCartItems"
                  :key="item.productId"
                  :getCartItem="item"
                  :productId="productId"
                  @removeFromCart="handleRemove"
               >
               </cart-item>            
            <!-- <transition-group name="list" tag="p" mode="out-in">

            </transition-group> -->

         </div>
         <div v-else class="alter-head">
            <h3> Your grocery cart is empty </h3>
         </div>

         <hr class="border border-primary border-3 opacity-75 line">

         <div class="under-line">
            <div class="button-block">
               <button class="btn btn-primary"
                  @click="openWindow"> Buy all
               </button>
               <button class="btn btn-danger"
                  @click="removeAllFromCart"> Remove all
               </button>
            </div>

            <div class="count-block">
               <div class="count">
                  <div class="count-text">
                     Number of selected products:           
                  </div>
                  <div class="calculation"> <strong>{{ stateTotalNumber  }}</strong> </div>
               </div>

               <div class="count">
                  <div class="count-text">
                     Total purchase amount:            
                  </div>
                  <div class="calculation"> <strong>{{ stateTotalAmount.toFixed(2) }} $</strong> </div>
               </div>
         </div>
         </div>
      </div>
   </div>
   <div class="dialog-window"
      v-if="isWindowVisible"
      @click.stop="closeWindow"
   >
      <div class="window__content">
         <dialogue-payment
            @click.stop 
            :stateTotalNumber="stateTotalNumber"
            :stateTotalAmount="stateTotalAmount"
         >
         </dialogue-payment>      
      </div>
   </div>   
</template>

<script>
   import CartItem from '@/components/CartItem';
   import DialoguePayment from '@/components/DialoguePayment';
   import { mapGetters } from 'vuex';

   export default {
      components: {
         CartItem,
         DialoguePayment,
      },

      data() {
         return {
            accessToken:localStorage.getItem('token'),
            cartItems: [],
            getCartItem: {
               quantity: Number,
               productId: Number,
            },
            totalAmount: 0,
            isWindowVisible: false,
         }
      },

      computed: {
         ...mapGetters(['getCartItems', 'stateTotalNumber', 'stateTotalAmount']),
      },

      methods: {
         handleRemove(productId) {
            this.$store.dispatch('removeFromCart', productId);
         },
         openWindow() {
            this.isWindowVisible = true;
         },
         closeWindow() {
            this.isWindowVisible = false;
         },
         removeAllFromCart() {
            alert("All products will be removed from the cart. \nAre you sure you want this?");
            this.$store.dispatch('removeAllFromCart');
         }
      },
      
      created () {
         console.log('getCartItems in UsersProductCart:', this.getCartItems);
      },
      mounted() {
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

   /* .list-item {
      display: inline-block;
      margin-right: 100px;
   }
   .list-enter-active,
   .list-leave-active {
      transition: all 0.5s ease;
   }
   .list-enter-from,
   .list-leave-to {
      opacity: 0;
      transform: translateX(100px);
   } */

   .line {
      display: flex;
      width: 75%;
      margin-left: auto;
   }
   .under-line{
      display: flex;
      justify-content: space-between;
      padding: 0 25px;
   }
   .button-block {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px auto;
   }
   .button-block *{
      width: 200px;
      margin:10px;
      font-size: 18px;
      padding: 6px 12px;
   }
   .count-block{
      width: 50%;
      padding: 5px 10px;     
   }
   .count{
      display: flex;
      justify-content: end;
      font-size: 24px;
      padding: 5px;
   }
   .calculation{
      width: 150px;
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
   @media only screen and (max-width: 1200px) {
      .count-block{
         width: 65%;
         padding: 5px 10px;     
      }
      .button-block {
         width: 35%;
      }
   }
   @media only screen and (max-width: 960px){
      .under-line{
         justify-content: center;
         padding: 0 10px;
      }
      .button-block *{
         width: 170px;
         margin:10px;
         font-size: 16px;
         padding: 6px 10px;
      }
      .count-block{
         width: 67%;
         padding: 5px;
      }
      .count{
         font-size: 20px;
      }
      .calculation{
         width: 118px;
      }
   }
   @media only screen and (max-width: 768px){
      h1{
      margin-top: 25px;
      }
      header{
         margin: auto 10px;
      }
      h3{
         font-size: 22px;
         margin-top: 6px;
      }
      .button-block *{
         width: 105px;
      }
      .count{
         font-size: 18px;
      }
   }
   @media only screen and (max-width: 576px){
      .cart-container{
         margin: 0;
         padding: 5px;
      }
      h1{
      margin-top: 15px;
      font-size: 20px;
      }
      header{
         margin: auto 5px;
      }
      h3{
         font-size: 18px;
      }
      .right-button{
         font-size: 10px;
         padding: 3px 8px;
      }
      .under-line {
         padding: 0 5px;
      }
      .button-block *{
         width: 72px;
         font-size: 10px;
         padding: 3px 8px;
      }
      .count{
         font-size: 12px;
      }
   }
   .dialog-window{
      position: fixed;
      display: flex;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.7);
   }
   .window__content {
      margin: 100px auto auto;
      background: white;
      border-radius: 12px;
      min-height: 200px;
      min-width: 350px;
      padding: 20px;
   }
</style>