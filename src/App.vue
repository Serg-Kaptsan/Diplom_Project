<template>
    <navbar class="navbar" @show-dialog="showDialog"/>
    <main>
      <div class="app_container">

      <products-page
        v-if="!isProductsLoading"
        :products="products"
        @filtered-products="updateFilteredProducts"
      />
      <div v-else class="temporary">Loading</div>
        
        <my-dialog v-model:show="dialogVisible">
          <login-page v-model:show="isLoginPageVisible" />
          <registr-page v-if="!isLoginPageVisible" />
        </my-dialog>
      </div>    
    </main>

</template>

<script>
import Navbar from "@/components/Navbar";
import ProductsPage from "@/components/ProductsPage";
import MyDialog from "@/components/UI/MyDialog";
import LoginPage from "@/components/LoginPage";
import RegistrPage from "@/components/RegistrPage";
import showMixin from "@/mixins/showMixin";
import axios from 'axios';
import MySelect from "@/components/UI/MySelect";

export default {
  components: {
    Navbar,
    ProductsPage,
    MyDialog,
    LoginPage,
    RegistrPage,
    MySelect
  },
  data() {
    return {
      dialogVisible: false,
      isLoginPageVisible: true,
      // currentPage: 1,
      // itemsPerPage: 14,
      products:[],
      isProductsLoading: false,
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
      
      async fetchProducts() {
        try {
          this.isProductsLoading = true;
        //   await new Promise(resolve => setTimeout(resolve, 1000));
          const response = await axios.get('http://localhost:8081/products?_limit=10');
          // , {
          //   params: {
          //     page: this.currentPage,
          //     perPage: this.itemsPerPage,
          //   },         
          // });

          // this.products = this.products.concat(response.data);
          this.products = response.data;
          // this.$emit('products-loaded', this.products);
          console.log(response)
        } catch (e) {
          alert('Error Fetching')
        } finally {
          this.isProductsLoading = false;          
        }
      },

      onProductsLoaded(products) {
        this.products = products;
        this.isProductsLoading = false;
      },
    },
    updateFilteredProducts(filteredProducts) {
      this.products = filteredProducts;
  },
    mounted() {
      this.fetchProducts();
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

.temporary{
  margin-top: 50px;
  color: red;
}

</style>