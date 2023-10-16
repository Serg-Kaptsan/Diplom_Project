<template>
    <navbar class="navbar" @show-dialog="showDialog"/>
    <main>
      <!-- <div class="app_container">
      </div>    -->
      <router-view></router-view>
        
        <my-dialog v-model:show="dialogVisible">

          <!-- <login-page v-model:show="isLoginPageVisible" />
          <registr-page v-if="!isLoginPageVisible" /> -->

          <login-page v-model:show="isLoginPageVisible"
            @close-registration-page="closeRegistrationPage" />
          <registr-page v-if="!isLoginPageVisible" 
            @close-registration-page="closeRegistrationPage" />
        </my-dialog>
 
    </main>

</template>

<script>
import Navbar from "@/components/Navbar";
import ProductsPage from "@/components/ProductsPage";
import MyDialog from "@/components/UI/MyDialog";
import LoginPage from "@/components/LoginPage";
import RegistrPage from "@/components/RegistrPage";
import showMixin from "@/mixins/showMixin";

export default {
  components: {
    Navbar,
    ProductsPage,
    MyDialog,
    LoginPage,
    RegistrPage,
  },
  data() {
    return {
      dialogVisible: false,
      isLoginPageVisible: true,
    };
  },
  props: {
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.isLoginPageVisible = true;
    },
    openRegistration() {
      this.isLoginPageVisible = false;
    },
    closeRegistrationPage() {
        this.isLoginPageVisible = true;
    }
  },
  mixins: [showMixin]  
}
</script>

<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .navbar {
      margin: 0 auto;
      z-index: 1;
      width: 100%;
    }
</style>