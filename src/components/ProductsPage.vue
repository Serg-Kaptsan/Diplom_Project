<template>
    <h1 >DEVICE SHOP</h1>
    <h2 id="listHeader">CHOOSE YOUR DEVICE</h2>   
    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" id="searchInput"
                v-model="searchQuery"
                placeholder="Enter the product CODE or name">
            <button @click="search">
            <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Search">
            Search
            </button>
        </div>
        <div class="dropdown">
            <my-select 
                v-model="selectedSort"
                :options="sortOptions"                
                id="sortButton" class="sort_btn btn btn-light">
                Sort by
            </my-select>
        </div>
    </div>
<!-- 
    <button @click="fetchProducts"> Завантажити продукти</button> -->

    <div class="products-grid" id="productsList">
      <div v-if="!isProductsLoading">
        <ProductItem
            :products="products"
            :selectedSort="selectedSort"
            :searchQuery="searchQuery"
            @search-results="handleSearchResults"
        >
    </ProductItem>
      </div>
      <div v-else class="temporary">Loading</div>
        <div class="empty-list" v-if="isProductsLoading === false && searchResults.length === 0">
            Nothing was found for your search query
        </div>      
    </div>
</template>

<script>
import axios from 'axios';
import ProductItem from "@/components/ProductItem";
import MySelect from '@/components/UI/MySelect';

export default {
    components: {
        ProductItem,
        MySelect
    },

    data(){
        return {
            // currentPage: 1,
            // itemsPerPage: 14,
            products:[],
            isProductsLoading: false,
            selectedSort: '',
            searchQuery: '',
            searchResults: [],
            sortOptions: [
                {value: 'name', name: 'name'},
                {value: 'price', name: 'price'},
                {value: 'id', name: 'code'},
                {value: 'discount', name: 'discount'},
            ],      
        }
    },

    methods:{
        onProductsLoaded(products) {
            this.products = products;
            this.isProductsLoading = false;
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

            console.log(response)
            } catch (e) {
            alert('Error Fetching')
            }
            finally { this.isProductsLoading = false; }
        },

        handleSearchResults(results) {
            this.searchResults = results;
        },

    },

    mounted() {
      this.fetchProducts();
    },
}
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 50px;
    }
    h2 {
        margin-left: 20px;
    }

    .btn_container {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        padding: 20px;
    }
    .serch_block {
        display: flex;
        position: relative;
        min-width: 400px;
        left: 20px;
    }
    .serch_block input {
        width: 100%;
        padding: 5px;
        border: 2px solid #ccc;
        border-radius: 5px;
        outline: none;
    }
    .serch_block button {
        position: absolute;
        right: 0;
        top: 0;
        padding: 7px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 0 5px 5px 0;
    }
    .serch_block button img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .sort_btn{
        padding: 5px 25px;
        margin-right: 100px;
        border: 2px solid #ccc;
    }
    @media only screen and (max-width: 900px) {
        .serch_block {
            min-width: 350px;
            left: 15px;          
        }
        .sort_btn{
           margin-right: 40px; 
        }
    }
    @media only screen and (max-width: 768px) {
        .serch_block {
            min-width: 350px;
            left: 5px;          
        }
        .sort_btn{
           margin-right: 15px; 
        }
    }
    @media only screen and (max-width: 576px) {
        h1{
            font-size: 24px;
        }
        h2{
            font-size: 20px;            
        }
        .btn_container {
            padding: 0 0 10px 0;
        }
        *.btn_container {
            font-size: 12px;
        }        
        .serch_block {
            min-width: 260px;
            left: 0;          
        }
        .serch_block button {
            padding: 7px 5px;
        }
        .serch_block button img {
            width: 12px;
            height: 12px;
            margin-right: 3px;
        }
        .sort_btn{
            margin-right: 0;
            padding: 5px 5px;
            font-size: 12px;
        }
    }
    .empty-list {
        text-align: center;
        font-weight: bold;
        color: black;
        padding: 10px;
        border: 1px solid red;
        background-color: #f0f8f0;
        margin-top: 10px;
    }
    .temporary{
        font-weight: 500;
        color: red;
        }
</style>