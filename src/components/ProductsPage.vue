<template>
    <h1 >DEVICE SHOP</h1>
    <h2 id="listHeader">CHOOSE YOUR DEVICE</h2>   
    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" id="searchInput"
                v-focus
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

    <!-- <button @click="fetchProducts"> Завантажити продукти</button> -->

    <div class="products-grid" id="productsList">
      <div v-if="!isProductsLoading" class="card-container" >
        <div v-for="(product, index) in filteredAndSortedProducts" :key="index">
        <product-item :product="product"> </product-item>
        </div>
      </div>
      <div v-else class="temporary">Loading</div>

        <div class="empty-list" v-if="!isProductsLoading && filteredAndSortedProducts.length === 0">
            Nothing was found for your search query
        </div>
    </div>
    <div v-intersection="loadMorePages" class="observer"></div>

    <!-- <div class="page__wrapper">
        <div 
            v-for="pageNumber in totalPages" 
            :key="pageNumber"
            class="page"
            :class="{
                'current-page': currentPage === pageNumber
            }"
            :style="currentPage === pageNumber ? { 'background': 'blue' } : {}"
            @click="changePage(pageNumber)"
        >
            {{ pageNumber }}
        </div>
    </div>          -->
</template>

<script>
import axios from 'axios';
import ProductItem from "@/components/ProductItem";
import MySelect from '@/components/UI/MySelect';

export default {
    components: {
        ProductItem,
        MySelect,
    },

    data(){
        return {
            currentPage: 0,
            itemsPerPage: 7,
            totalPages: 0,
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
        // changePage(pageNumber){
        //     this.currentPage = pageNumber
        // },
        async fetchProducts() {
            try {
                this.isProductsLoading = true;
                const response = await axios.get('http://localhost:8081/products', {
                    params: {
                        page: this.currentPage,
                        pageSize: this.itemsPerPage
                    }                    
                });
                this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
                this.products = response.data.content;
                console.log(response);
            } catch (e) {
            console.error('Error Fetching:', e);
                this.hasErrorFetching = true;
            } finally {
                this.isProductsLoading = false; 
            }
        },
        async loadMorePages() {
            try {
                if (!this.isProductsLoading) {
                    this.currentPage += 1;
                    const response = await axios.get('http://localhost:8081/products', {
                        params: {
                            page: this.currentPage,
                            pageSize: this.itemsPerPage
                        }                    
                    });                    
                
                this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
                this.products.push(...response.data.content);
            console.log(response);
                }
            } catch (e) {
            console.error('Error Fetching:', e);
                this.hasErrorFetching = true;
            }
        },        
    },
    watch: {
    },
    computed: {
        filteredAndSortedProducts() {
            if (!Array.isArray(this.products) || this.products.length === 0) {
                return [];
            }
            const filteredProducts = this.products.filter(product => {
                const nameMatches = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const codeMatches = product.id.toString().includes(this.searchQuery.toString());
                return nameMatches || codeMatches;
            });

            return [...filteredProducts].sort((product1, product2) => {
                const value1 = product1[this.selectedSort];
                const value2 = product2[this.selectedSort];

                if (typeof value1 === 'number' && typeof value2 === 'number') {
                return value1 - value2;
                } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                return value1.localeCompare(value2);
                }
            });
        },

        handleSearchResults(results) {
            this.searchResults = results;
        },  
    },

    mounted() {
        this.fetchProducts();
        console.log(this.$refs.observer);
    },
}
</script>

<style scoped>
    #productsList{
        display: flex;
    }
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
    .card-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
        margin-bottom: 15px;
        gap: 2px;
    }
    .empty-list {
        width: 100%;
        text-align: center;
        font-weight: bold;
        color: black;
        padding: 10px;
        border: 1px solid red;
        background-color: #f0f8f0;
        margin-top: 10px;
    }
    .observer{
        height: 15px;
        background: green;
    }
    .temporary{
        font-weight: 500;
        color: red;
        }
</style>