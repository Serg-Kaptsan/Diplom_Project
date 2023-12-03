<template>
  <div class="head-line">
    <h1> ADMIN PAGE </h1>
    <button class="navbar-toggler btn d-sm-none switcher"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#menu"
      aria-controls="menu"
      aria-expanded="false"
    >
      <i class="burger"
        v-if="!isMenuActive"            
        @click="toggleMenu"        
      >
      <img class="img-bur"
        src='/icon-bar-7131131.png' alt="bur">
      </i>
      <i class="img-close"
        v-else
        @click="toggleMenu"
      > &#x1F7AA; </i>
    </button>
        
    <div id="menu"
      class="menu collapse d-sm-block navbar-collapse"
      :class="{ show: isMenuActive }"
    >
      <div class="menu-container">

        <!-- <div class="btn btn-dark menu-button" 
          @click="goPosts">
          Posts
        </div> -->
        <!-- <div class="btn btn-dark menu-button" 
          @click="goOrders">
          Orders
        </div> -->

        <div class="btn btn-dark menu-button" 
          @click="goUsers">
          Users
        </div>
        <div class="btn btn-dark menu-button" 
          @click="goCategories">
          Categories
        </div>
        <div class="btn btn-dark menu-button" 
          @click="goDiscounts">
          Discounts
        </div>
        <div class="btn btn-dark menu-button" 
          @click="goAdmin">
          Products
        </div>
      </div>
    </div>        
  </div>
</template>

<script>
  export default {
    name: 'admin-menu',
    props: ['isMenuActive'],
    data() {
      return {
        isMenuActive: false,
      }
    },

    methods: {
      toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
      },
      goAdmin() {
        if (this.$route.path !== '/admin') {
          this.$router.push('/admin');
        }
        else {
          location.reload();
        }
      },
      goUsers() {
        if (this.$route.path !== '/users') {
          this.$router.push('/users');
        }
        else {
          location.reload();
        }
      },
      goCategories() {
        if (this.$route.path !== '/categories') {
          this.$router.push('/categories');
        }
        else {
          location.reload();
        }
      },
      goDiscounts() {
        if (this.$route.path !== '/discounts') {
          this.$router.push('/discounts');
        }
        else {
          location.reload();
        }
      },
      // goOrders() {
      //   if (this.$route.path !== '/orders') {
      //     this.$router.push('/orders');
      //   }
      //   else {
      //     location.reload();
      //   }
      // },
      // goPosts() {
      //   if (this.$route.path !== '/posts') {
      //     this.$router.push('/posts');
      //   }
      //   else {
      //     location.reload();
      //   }
      // },
    }
  }
</script>

<style scoped>
  .head-line {
    display: flex;
    margin-top: 50px;
    margin-bottom:16px;
    height: 50px;
    align-items: center;
    padding: 0 15px;
    max-width: 1460px;
    justify-content: space-between;
  }
  h1{
    margin: auto;
    padding-bottom: 0;
    width: 50%;
    text-align: center;
  }
  .menu{
    margin-right: 50px;
  }
  .menu *{
    margin-left: 20px;
    float: right;
  }
  @media only screen and (max-width: 1200px) {
    .menu{
    margin-right: 10px;
  }
    .menu *{
    margin-left: 12px;
    }
  }
  @media only screen and (max-width: 960px) {
    h1{
      width: 40%;
      font-size: 28px;
    }
    .menu{
        margin: 0;
    }
    .menu *{
        margin-left: 5px;
    }
    .menu-button{
      font-size:14px;
      padding: 5px 12px;
    }
  }
  @media only screen and (max-width: 768px) {
    .head-line{
      padding: 0;
      margin-top: 25px;
      margin-bottom: 8px;
      align-items: center;         
    }
    h1{
      width: 27%;
      font-size: 18px;
    }
    .menu-container{
      margin-left: 0;
      padding-left: 4px;
    }
    .menu-button{
      padding: 3px 6px;
    }
  }
  @media only screen and (max-width: 575px) {
    .head-line{
    margin-top: 10px;
    height: 25px;       
    }
    h1{
      width: 50%;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.03em;
    }
    .switcher{
      position: relative;
      display: flex;
      width: 30%;
      justify-content: flex-end;
      margin-right: -10px;
    }
    .img-bur{
      width: 16px;
      height: 16px;
      margin-right: 20px;
    }
    .img-close{
      font-size: 10px;
    }
    .menu{
      max-width: 75px;
      margin-top: 35px;
      margin-right: 10px;         
      max-height: 60px;
      overflow-y: auto;
    }      
    .menu-container{
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-end;
      background-color: rgb(241, 254, 255);
    }
    .menu-button{
      background: transparent;
      border: none;
      color: black;
      font-size: 12px;
      padding: 2px 7px;
      text-align: right;
    }
  }
</style>