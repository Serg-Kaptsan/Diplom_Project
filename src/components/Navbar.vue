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
      <!-- <button v-is="userRole:ADMIN" 
        @click="$router.push('/admin')"
        > 
        ADMIN 
      </button> -->
      <button @click="goAccaunt"> 
        ACCAUNT
      </button>
      <button @click="logout"> 
        GO OUT
      </button>
    </div>
    <my-notification ref="noteMessage"></my-notification>
  </div>
</template>

<script>
import MyNotification from '@/components/UI/MyNotification';

export default {
  components: {
    MyNotification,
  },
    data() {
      return {
        accessToken: localStorage.getItem('token'),        
      }
    },
    props: {},

    methods: {
      async logout () {
        const sessionId = localStorage.getItem('sessionId');
        try {
          if (sessionId) {
            await axios.delete(`http://localhost:8081/product/${sessionId}`, {
              headers:{
                'Authorization': `Bearer ${this.accessToken}`
              },
            });
              localStorage.removeItem('sessionId');
            } else {
              console.warn('No sessionId found in localStorage.');
            }
        } catch (e) {
            console.error('Error deleting session:', e);
            console.warn('Session not found on the server.');

        } finally {
          localStorage.removeItem('sessionId');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          this.$refs.noteMessage.showNotification('You have successfully logged out of your account');
          this.$router.push('/');               
        }
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
        } else {
          location.reload();
        }
        } else {
          alert('To add an item to your cart, you must be logged in.');
          this.showDialog();
        }
      },

      goAccaunt() {
        if (this.isAuthorization) {
          const userId = localStorage.getItem('userId');
          this.$router.push({ name: 'edit-user', params: { id: parseInt(userId) } });
        } else {
          alert('To open your account, you must be logged in.');
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
      font-size: 12px;
      height: 27px;  
    }
    button {      
      margin-left: 10px;
    }
  }

</style>