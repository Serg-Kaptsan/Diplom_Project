<template>
    <admin-menu> </admin-menu>
    <div class="second-line">
        <h2>PRODUCTS LIST</h2>
        <div class="add-button-block">
            <div class="btn btn-secondary add-button" 
                @click="$router.push('/add-product')">
                Add product
            </div>             
        </div>
    </div>

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
                <option value="">Select a Category</option>
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
            Sort by
        </my-select>
    </div>

    <div class="products-grid" id="productsList">
      <div v-if="!isProductsLoading" class="card-container" >
        <div 
            v-for="product in filteredAndSortedProducts"
            :key="product.id">
        <admin-product-item 
            :product="product"
            :discount="discount"
            :category="categories"
            @delete="deleteProduct">
        </admin-product-item>
        </div>
      </div>
      <div v-else class="temporary">Loading</div>

        <div class="empty-list" 
            v-if="!isProductsLoading && filteredAndSortedProducts.length === 0">
            Nothing was found for your search query
        </div>
    </div>
    <div v-intersection="() => loadMorePages(selectedCategoryId)" class="observer"> </div>
</template>

<script>
import axios from 'axios';
import AdminProductItem from "@/components/AdminProductItem";
import MySelect from '@/components/UI/MySelect';
import AdminMenu from '@/components/UI/AdminMenu';

export default {
    components: {
        AdminProductItem,
        AdminMenu,
        MySelect,
    },

    data(){
        return {
          accessToken: localStorage.getItem('token'),
          currentPage: 0,
          itemsPerPage: 10,
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
            {value: 'sku', name: 'SKU'},
            {value: 'name', name: 'name'},
            {value: 'id', name: 'code'},
            {value: 'category', name: 'category'},
            {value: 'price', name: 'price'},
            {value: 'quantity', name: 'quantity'},
            {value: 'discount', name: 'discount'},
            {value: 'createdAt', name: 'creation date'},
            {value: 'modifiedAt', name: 'modification date'},
          ],
        }
    },

    methods:{
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

                this.discount = (await axios.get('http://localhost:8081/discount')).data;
                this.categories = (await axios.get('http://localhost:8081/product-categories')).data;

                this.categories.forEach(category => {
                    this.categoryIdMap[category.name] = category.id;
                });

console.log('Category data:', this.category);
console.log('Categories:', this.categories);
console.log('CategoryIdMap:', this.categoryIdMap);
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
                    let response;
                    if (selectedCategoryId) {
                        response = await axios.get(`http://localhost:8081/products/category/${selectedCategoryId}`, {
                        params: {
                            page: this.currentPage,
                            pageSize: this.itemsPerPage
                        }
                    });
                } else {
                   response = await axios.get('http://localhost:8081/products', {
                        params: {
                            page: this.currentPage,
                            pageSize: this.itemsPerPage
                        }                    
                    });                   
                }                   
                
                this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
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
        async filterByCategory(){
            if (this.selectedCategoryId) {
                try {
                    const response = await axios.get(`http://localhost:8081/products/category/${this.selectedCategoryId}`);
                    this.products = response.data;
                } catch (error) {
                    console.error('Error filtering by category:', error);
                } 
            }else {
                this.fetchProducts();
            }                         
        },
        async deleteProduct(productToDelete) {
            try {
                await axios.delete(`http://localhost:8081/product/${productToDelete.id}`, {
                    headers:{
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                    alert(`The element code ${productToDelete.id} was deleted successfully`);
                    this.products = this.products.filter(product => product.id !== productToDelete.id);
            } catch (e) {
                console.error('Error deleting product:', e);
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
                
                if (this.selectedSort === 'category') {
                const category1 = product1.category?.name || '';
                const category2 = product2.category?.name || '';
                return category1.localeCompare(category2);
                }

                if (this.selectedSort === 'discount') {
                const discount1 = product1.discount?.discountPercent || 0;
                const discount2 = product2.discount?.discountPercent || 0;
                return discount1 - discount2;
                }    
            });
        },

        // handleSearchResults(results) {
        //     this.searchResults = results;
        // },  
    },

    mounted() {
        this.fetchProducts();
        console.log(this.$refs.observer);
    },
}
</script>

<style scoped>
    .second-line{
        display: flex;
        margin-bottom: 16px;
    }
    h2 {
        margin: 0 10px 0 40px;
    }
    .add-button-block{
        display: flex;
        justify-content: center;
        width: 50%;
    }
    .card-container{
        margin: 15px;   
    }
    .btn_container {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        padding: 10px 20px;
    }
    .serch_block {
        display: flex;
        position: relative;
        min-width: 325px;
        left: 20px;
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
        border: 2px solid #ccc;
    }
    .sort_btn:last-child {
        margin-right: 100px;   
    }

    @media only screen and (max-width: 960px) {
        .btn_container {
            padding: 7px 10px;
        }
        .serch_block {
            min-width: 280px;
            left: 15px;          
        }
        .sort_btn{
           padding: 5px 15px;
        }
        .sort_btn:last-child{
           margin-right: 40px;
        }
    }
    @media only screen and (max-width: 768px) {
        .second-line{
            margin-bottom: 8px;
            align-items: center;
        }
        h2{
            font-size: 16px;
            margin-bottom: 0;            
        }
        .btn_container {
            padding: 7px 10px;
        }
        .menu-button, .add-button{
            font-size: 12px;
            padding: 3px 6px;
        }
        .serch_block {
            font-size: 12px;
            min-width: 225px;
            left: 5px;          
        }
        .serch_block img{
            top: 9px;
        }
        .sort_btn{
           margin-right: 0;
           padding: 5px 7px;
           font-size: 12px;
        }
        .sort_btn:last-child{
           margin-right: 5px;
        }
    }
    @media only screen and (max-width: 575px) {
      h2{
        font-size: 12px;            
      }
      .add-button-block{
        justify-content: start;
      }
      .add-button {
        font-size: 10px;
        padding: 2px 5px;         
      }
      .btn_container {
        padding: 0;
      }
      *.btn_container {
        font-size: 10px;
      }        
      .serch_block {
        min-width: 162px;
        left: 0;
        font-size: 10px;
        line-height: 12px;     
      }
      .serch_block input{
        padding: 2px;
      }
      .serch_block img {
        display: none;
      }
      /* .serch_block button {
        padding: 7px 5px;
      } */
      .sort_btn{
        padding: 5px 2px;
        font-size: 10px;
      }
      .sort_btn:last-child{
        width: 70px;
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