<template>
    <h1 >DEVICE SHOP</h1>
    <h2 id="listHeader">CHOOSE YOUR DEVICE</h2>   
    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" 
                id="searchInput"
                v-focus
                v-model="searchQuery"
                placeholder="Enter the product CODE or name">
            <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Search">
        </div>
        <select class="sort_btn btn btn-light"
            v-model="selectedCategoryName"
            @change="handleCategoryChange"
            :options="categories"
            id="categorySelect" >
                <option value="">Select a category</option>
                <option 
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.name"
                >                            
                    {{ category.name }}
                </option>
        </select>
        <my-select class="sort_btn btn btn-light"
            v-model="selectedSort"
            :options="sortOptions"                
            id="sortButton" >
        </my-select>
    </div>

    <!-- <button @click="fetchProducts"> Завантажити продукти</button> -->

    <div class="products-grid" id="productsList">
      <div v-if="!isProductsLoading" class="card-container" >
        <div 
            v-for="product in filteredAndSortedProducts"
            :key="product.id">
            <transition-group name="flip-list">
                <product-item 
                    :product="product"
                    :discount="discount"
                    :category="categoryId">
                </product-item>                
            </transition-group>

        </div>
      </div>
      <div v-else class="temporary">Loading</div>

        <div class="empty-list" 
            v-if="!isProductsLoading && filteredAndSortedProducts.length === 0">
            Nothing was found for your search query
        </div>
    </div>
    <div v-intersection="() => loadMorePages(selectedCategoryId)" class="observer"></div>

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

export default {
    components: {
        ProductItem,
    },

    data() {
        return {
            currentPage: 0,
            itemsPerPage: 14,
            totalPages: 0,
            isProductsLoading: false,
            selectedSort: '',            
            products:[],
            categories: [],     
            selectedCategoryName: '',
            selectedCategoryId: null,
            categoryIdMap: {},
            categoryId: null,            
            searchQuery: '',
            searchResults: [],
            sortOptions: [
                {value: 'name', name: 'name'},
                {value: 'price', name: 'price'},
                {value: 'id', name: 'code'},
                // {value: 'category', name: 'category'},
                // {value: 'discount', name: 'discount'},
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

                this.discount = (await axios.get('http://localhost:8081/discount')).data;
                this.categories = (await axios.get('http://localhost:8081/product-categories')).data;

                this.categories.forEach(category => {
                    this.categoryIdMap[category.name] = category.id;
                });

            } catch (e) {
            console.error('Error Fetching:', e);
                this.hasErrorFetching = true;
            } finally {
                this.isProductsLoading = false; 
            }
        },
        async loadMorePages(selectedCategoryId) {
            try {
                if (!this.isProductsLoading) {
                    this.currentPage += 1;

                    const response = selectedCategoryId
                       ? response = await axios.get(`http://localhost:8081/products/category/${selectedCategoryId}`, {
                            params: {
                                page: this.currentPage,
                                pageSize: this.itemsPerPage
                            }
                        })
                        : await axios.get('http://localhost:8081/products', {
                                params: {
                                    page: this.currentPage,
                                    pageSize: this.itemsPerPage
                                }                    
                            });                   

                        this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage);
                        this.products.push(...response.data.content);
                        
                        console.log(response);
                }
            } catch (e) {
            console.error('Error Fetching:', e);
                this.hasErrorFetching = true;
            }
        },
        handleCategoryChange() {
            this.selectedCategoryId = this.categoryIdMap[this.selectedCategoryName];
            console.log('Selected category name:', this.selectedCategoryName);
            console.log('Selected category id:', this.selectedCategoryId);
            console.log('Products before filter:', this.products);
            this.filterByCategory();
            this.currentPage = 0;
        },
        async filterByCategory() {
            if (this.selectedCategoryId) {
                try {
                    const response = await axios.get(`http://localhost:8081/products/category/${this.selectedCategoryId}`);
                    this.products = response.data;
                } catch (error) {
                    console.error('Error filtering by category:', error);
                } 
            } else {
                this.fetchProducts();
            }                         
        }
    },
    watch: {
    },
    computed: {
        filteredAndSortedProducts() {
            if (!Array.isArray(this.products) || this.products.length === 0) {
                return [];
            }
                const allProducts = this.currentPage > 0 ? this.products : this.products.slice(0, this.itemsPerPage);

                const filteredProducts = allProducts.filter(product => {
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

                // if (this.selectedSort === 'category') {
                // const category1 = product1.category?.name || '';
                // const category2 = product2.category?.name || '';
                // return category1.localeCompare(category2);
                // }

                // if (this.selectedSort === 'discount') {
                //     const parseDiscount = (discount) => {
                //         if (discount && discount.discountPercent) {
                //             return parseInt(discount.discountPercent.replace("%", ""), 10) || 0;
                //         }
                //         return 0;
                //     }
                // const discount1 = parseDiscount(product1.discount?.discountPercent) || 0;
                // const discount2 = parseDiscount(product2.discount?.discountPercent) || 0;
                // return discount1 - discount2;
                // }
            });
        },

        handleSearchResults(results) {
            this.searchResults = results;
        },  
    },

    mounted() {
        this.fetchProducts();
        console.log('observer point', this.$refs.observer);
    },
}
</script>

<style scoped>
    .card-container{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 2px;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    h1 {
        text-align: center;
        margin-top: 50px;
    }
    h2 {
        margin-left: 40px;
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
        min-width: 325px;
        left: 20px;
        margin-right: 15px;
    }
    .serch_block input {
        width: 100%;
        padding: 5px;
        border: 2px solid #ccc;
        border-radius: 5px;
        outline: none;
    }
    .serch_block img {
        position: absolute;
        right: 10px;
        top: 11px;
        width: 16px;
        height: 16px;
    }
    .sort_btn{
        padding: 5px 25px;
        margin-right: 100px;
        border: 2px solid #ccc;
    }
    .flip-list-move {
       transition: transform 0.5s ease;
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
        height: 2px;
    }
    .temporary{
        font-weight: 500;
        color: red;
        }
</style>