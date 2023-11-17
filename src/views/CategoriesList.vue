<template>
  <admin-menu> </admin-menu>
  <div class="second-line">
      <h2>CATEGORIES LIST</h2>
      <div class="add-button-block">
          <div class="btn btn-secondary add-button" 
              @click="$router.push ('/add-category')" > 
              Add category
          </div>             
      </div>
  </div>

  <div class="btn_container">
      <div for="searchInput" class="serch_block">
          <input type="text" 
              id="searchInput"
              v-focus
              v-model="searchQuery"
              placeholder="Enter the Category CODE or name">
          <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Search">
      </div>
      <my-select class="sort_btn btn btn-light"
          v-model="selectedSort"
          :options="sortOptions"                
          id="sortButton" >
          Sort by
      </my-select>
  </div>

  <div class="categories-grid" id="categoriesList">
    <div v-if="!isCategoriesLoading"
      class="card-container" >
      <div 
          v-for="category in filteredAndSortedCategories"
          :key="category.id">
        <category-item 
            :category="category"
            @delete="deleteCategory">
        </category-item>
      </div>
    </div>
    <div v-else class="temporary">Loading</div>

      <div class="empty-list" 
          v-if="!isCategoriesLoading
           && filteredAndSortedCategories.length === 0">
          Nothing was found for your search query
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryItem from "@/components/CategoryItem";
import MySelect from '@/components/UI/MySelect';
import AdminMenu from '@/components/UI/AdminMenu';

export default {
  components: {
    CategoryItem,
    AdminMenu,
    MySelect,
  },

  data(){
    return {
      accessToken: localStorage.getItem('token'),
      isCategoriesLoading: false,
      selectedSort: '',            
      categories:[],
      searchQuery: '',
      sortOptions: [
        {value: 'name', name: 'name'},
        {value: 'id', name: 'id'},
        {value: 'description', name: 'description'},
        {value: 'createdAt', name: 'created date'},
        {value: 'modifiedAt', name: 'modification date'},
      ],
    }
  },

  methods:{
    async fetchCategories() {
      try {
        this.isCategoriesLoading
         = true;
        const response = await axios.get('http://localhost:8081/product-categories', {
          headers:{
              'Authorization': `Bearer ${this.accessToken}`
          },             
        });
        this.categories = response.data;
console.log('Fetched categories:', this.categories);
      } catch (e) {
console.error('Error Fetching:', e);
        this.hasErrorFetching = true;
      } finally {
        this.isCategoriesLoading
         = false;
      }
    },

    async deleteCategory(categoryToDelete) {
      try {
        await axios.delete(`http://localhost:8081/product-categories/${categoryToDelete.id}`, {
          headers:{
              'Authorization': `Bearer ${this.accessToken}`
          },
        });
          alert(`The element code ${categoryToDelete.id} was deleted successfully`);
          this.categories = this.categories.filter(element => element.id !== categoryToDelete.id);
      } catch (e) {
        console.error('Error deleting category:', e);
      }
    },
  },
  watch: {
  },
  computed: {
    filteredAndSortedCategories() {
      if (!Array.isArray(this.categories) || this.categories.length === 0) {
          return [];
      }
      const filteredCategories = this.categories.filter(category => {
          const nameMatches = category.name.toLowerCase().includes(this.searchQuery.toLowerCase());
          const codeMatches = category.id.toString().includes(this.searchQuery.toString());
          return nameMatches || codeMatches;
      });

      return [...filteredCategories].sort((element1, element2) => {
        const value1 = element1[this.selectedSort];
        const value2 = element2[this.selectedSort];
        const date1 = new Date(value1);
        const date2 = new Date(value2);

        if (typeof value1 === 'number' && typeof value2 === 'number') {
          return value1 - value2;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
          return value1.localeCompare(value2);
        } else {
          return date1 - date2;
        }
      });
    }
  },
  mounted() {
    this.fetchCategories();
  }  
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 10px;
    margin: 10px;
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
      margin-right: 250px;   
  }

  @media only screen and (max-width: 960px) {
      .btn_container {
          padding: 7px 10px;
      }
      .serch_block {
          min-width: 300px;
          left: 15px;          
      }
      .sort_btn{
         padding: 5px 15px;
      }
      .sort_btn:last-child{
         margin-right: 150px;
      }
      .card-container{
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        margin: 7px;
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
      .card-container{
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
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
    .sort_btn{
      padding: 5px 2px;
      font-size: 10px;
    }
    .sort_btn:last-child{
      width: 70px;
    }
    .card-container{
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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