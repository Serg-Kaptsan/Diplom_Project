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
      <button v-show="isAdminButton"
        @click="goAdmin"
      > 
        <strong> ADMIN </strong>  
      </button>
      <button @click="goAccount">
        ACCOUNT
      </button>
      <button @click="logout"> 
        GO OUT
      </button>
    </div>
    <my-notification ref="noteMessage"></my-notification>
  </div>
</template>

<script>
import axios from 'axios';
import MyNotification from '@/components/UI/MyNotification';
import { mapActions } from 'vuex';

export default {
  components: {
    MyNotification,
  },
  data() {
  },
  computed: {
    isAdminButton() {
      return this.$store.state.isAdminButton;
    },
  },
  props: {},

  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },

  methods: {
    ...mapActions('cart', ['deleteProductsFromServer']),

    goHome() {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      } else {
        location.reload();
      }
    },

    showDialog() {
      this.$emit('show-dialog');
    },

    async logout() {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const accessToken = localStorage.getItem('token');
        await this.$store.dispatch('deleteProductsFromServer');

        if (sessionId && accessToken) {
          await axios.delete(`${process.env.VUE_APP_API_URL}/${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
          });
          localStorage.removeItem('sessionId');
        } else {
          console.warn('No sessionId or accessToken found in localStorage.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('sessionId');
        this.$store.commit('setAdminButtonVisible', false);
        this.$refs.noteMessage.showNotification('You have successfully logged out of your account');
        this.$router.push('/');
      }
    },
    goAdmin() {
      if (this.isAuthorization()) {
        this.navigate('/admin');
      } else {
        alert('To open Admin page, you must be logged in.');
        this.showDialog();
      }
    },

    goCart() {
      if (this.isAuthorization()) {
        this.navigate('/cart');
      } else {
        alert('To open your cart, you must be logged in.');
        this.showDialog();
      }
    },

    goAccount() {
      if (this.isAuthorization()) {
        const userId = localStorage.getItem('userId');
        this.navigate({ name: 'edit-user', params: { id: parseInt(userId) } });
      } else {
        alert('To open your account, you must be logged in.');
        this.showDialog();
      }
    },

    isAuthorization() {
      const token = localStorage.getItem('token');
      return !!token && token.trim() !== '';
    },

    navigate(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      } else {
        location.reload();
      }

    },
    // handleBeforeUnload(event) {
    //   this.logout();
    // },
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