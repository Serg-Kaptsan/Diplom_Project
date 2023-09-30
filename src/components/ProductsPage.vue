<template>
    <h1 >DEVICE SHOP</h1>
    <h2 id="listHeader">CHOOSE YOUR DEVICE</h2>   
    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" id="searchInput"
                v-model="searchProduct"
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

    <div class="card-container">
        <div class="card"
        v-for="(product, index) in products"
        :key="index">
            <div class="card-img-block">
                <img class="card-img-top" :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" />                
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text"> <strong> Code:</strong> {{ product.id }}</p>
                <p class="card-text"> <strong>Price:</strong> {{ product.price }}</p>
                <p class="card-text discount"> <strong>Discount:</strong> {{ product.discountPercent }}</p>      
            </div>
        </div>          
    </div>
<!-- Результати пошуку -->
    <div>
        <div class="products-grid" id="productsList"></div>
        <div v-for="product in filteredProducts" :key="product.id">
            {{ product.name }}
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
    props: {
        products: {
            type: Array,
            required: true,
        }
    },
    data(){
        return {
            // currentPage: 1,
            // itemsPerPage: 14,
            // products:[],
            // isProductsLoading: false,
            searchProduct: '',
            selectedSort: '',
            sortOptions: [
                {value: 'name', name: 'name'},
                {value: 'price', name: 'price'},
                {value: 'id', name: 'code'},
                {value: 'discaunt', name: 'discaunt'},
            ],
            filteredProducts: [],            
        }
    },

    methods:{
    //     async fetchProducts() {
    //     try {
    //       this.isProductsLoading = true;
    //     //   await new Promise(resolve => setTimeout(resolve, 1000));
    //       const response = await axios.get('http://localhost:8081/products?_limit=10');
    //       // , {
    //       //   params: {
    //       //     page: this.currentPage,
    //       //     perPage: this.itemsPerPage,
    //       //   },         
    //       // });

    //       // this.products = this.products.concat(response.data);
    //       this.products = response.data;
    //       this.isProductsLoading = false;
    //       this.$emit('products-loaded', this.products);

    //       console.log(response)
    //     } catch (e) {
    //       alert('Error Fetching')
    //     }
    //   }
        search() {
            this.filteredProducts = this.products.filter(product =>
                product.name.includes(this.searchProduct)
            );
            this.$emit('filtered-products', this.filteredProducts);
            console.log("Filtered products:", this.filteredProducts);
        },
    },
    // mounted() {
    //   this.fetchProducts();
    // },
    // computed: {
    //     sortedProducts() {
    //         return [...this.products].sort((product1, product2) => {
    //         const value1 = product1[this.products];
    //         const value2 = product2[this.products];

    //         if (typeof value1 === 'number' && typeof value2 === 'number') {
    //             return value1 - value2;
    //         } else if (typeof value1 === 'string' && typeof value2 === 'string') {
    //             return value1.localeCompare(value2);
    //         }
    //         });
    //     }
    // },
    watch: {
        // selectedSort(newValue) {
        //     this.products.sort((product1, product2) => {
        //         return product1[newValue]?. localeCompare(product2[newValue]);
        //     });
        // },
        selectedSort(newValue) {
            this.products.sort((product1, product2) => {
            const value1 = product1[newValue];
            const value2 = product2[newValue];

            if (typeof value1 === 'number' && typeof value2 === 'number') {
                return value1 - value2;
            } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                return value1.localeCompare(value2);
            }
            });
        },
    },

    // created() {
    //     this.fetchProducts(); 
    // },

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
/* Стилі для картки: */
    .card-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
        margin-bottom: 15px;
        gap: 2px;
    }
    .card {
        width: 200px;
        padding: 10px;
        border: 1px solid rgb(233,233,233);
        border-radius: 0;
    }
    .card-img-block{
        height: 250px;
        cursor: pointer;        
    }
    .card-img-top {
        object-fit: contain;
        max-height: 250px;
    }
    .card-body{
        padding: 16px 5px 10px;
    }
    h5 {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;    
    }
    p {
        font-size: 14px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }
</style>