<template>
  <div class="navbar">
    <div class="home" @click="goHome"> 
      HOME
    </div>

    <div class="navbar__btns">
      <button @click="goCart">
        CART 
      </button>
      <button @click="$router.push ('/about')">
        CONTACT US 
      </button>
      <button @click="showDialog"> 
        LOG IN
      </button>
      <button 
        @click="$router.push('/admin')"
        > 
        ADMIN 
      </button>
      <button @click="goAccaunt"> 
        ACCAUNT
      </button>
      <button @click="logout"> 
        GO OUT
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {},
    // data() {
    //   return {
    //     accessToken: localStorage.getItem('token')
    //   };
    // },

    methods: {
      logout() {
        localStorage.removeItem('token');
          alert('You have successfully logged out of your account. \nWould you like to log in under a different name?');
          this.showDialog();
          this.$router.push('/');
      },

      goHome() {
        if (this.$route.path !== '/') {
          this.$router.push('/');
        } else {
          location.reload();
        }
      },

      goCart() {
        if (this.isAuthorization) {
        if (this.$route.path !== '/cart') {
          this.$router.push('/cart');
          // this.$store.dispatch('recalculateTotals');          
        } else {
          this.$forceUpdate();
        }
      } else {
        alert('To add an item to your cart, you must be logged in.');
        this.showDialog();
      }
      },

      goAccaunt() {
        if (this.isAuthorization) {
          this.$router.push('/accaunt');
        } else {
            alert('To open your account, you must be logged in.'),
            this.showDialog();          
        }
      },

      showDialog() {
        this.$emit('show-dialog');
      }
    },

    computed: {
      isAuthorization() {
        return !!localStorage.getItem('token');
      }
    }
  }
</script>
  
<style scoped>
  .navbar {
    position:fixed;
    height: 50px;
    background-color: lightgray;
    box-shadow: 2px 2px 4px gray;
    display: flex;
    align-items: center;
    padding: 0 15px;
    max-width: 1460px;
  }
  .navbar__btns {
    margin-left: auto;
  }
  .home{
    cursor: pointer;
  }
  button{
    background: transparent;
    border: none;
    margin-left: 25px;      
  }
  @media only screen and (max-width: 768px){
    .navbar{
      height: 40px;
    }
  }
  @media only screen and (max-width: 576px) {
    .navbar{
      font-size: 13px;
      height: 27px;  
    }
    button {      
      margin-left: 10px;
    }
  }

</style>