<template>
    <admin-menu> </admin-menu>
    <up-arrow class="arrow"></up-arrow>
    <div class="second-line">
        <h2>DISCOUNTS LIST</h2>
        <div class="add-button-block">
            <div class="btn btn-secondary add-button" 
                @click="$router.push ('/add-discount')" > 
                Add discount
            </div>             
        </div>
    </div>
  
    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" 
                id="searchInput"
                v-focus
                v-model="searchQuery"
                placeholder="Enter the Discount CODE or name">
            <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Search">
        </div>
        <my-select class="sort_btn btn btn-light"
            v-model="selectedSort"
            :options="sortOptions"                
            id="sortButton" >
            Sort by
        </my-select>
    </div>
  
    <div class="discounts-grid" id="discountsList">
      <div v-if="!isDiscountsLoading"
        class="card-container" >
        <div
            v-for="discount in filteredAndSortedDiscounts"
            :key="discount.id">
            <transition-group name="flip-list">
              <discount-item 
                  :discount="discount"
                  @delete="deleteDiscount">
              </discount-item>            
            </transition-group>
        </div>
      </div>
      <div v-else class="temporary">Loading</div>
  
        <div class="empty-list" 
            v-if="!isDiscountsLoading
             && filteredAndSortedDiscounts.length === 0">
            Nothing was found for your search query
        </div>
        <my-notification ref="noteMessage"></my-notification>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import DiscountItem from "@/components/DiscountItem";
  import MyNotification from '@/components/UI/MyNotification';
  
  export default {
    components: {
      DiscountItem,
      MyNotification,
    },
  
    data(){
      return {
        accessToken: localStorage.getItem('token'),
        isDiscountsLoading: false,
        selectedSort: '',            
        discounts:[],
        searchQuery: '',
        sortOptions: [
          {value: 'id', name: 'id'},
          {value: 'name', name: 'name'},
          {value: 'description', name: 'description'},
          {value: 'discountPercent', name: 'discount percent'},
          {value: 'createdAt', name: 'created date'},
          {value: 'modifiedAt', name: 'modification date'},
        ],
      }
    },

    methods:{
      async fetchDiscounts() {
        try {
          this.isDiscountsLoading
           = true;
          const response = await axios.get(`${process.env.VUE_APP_API_URL}/discount`, {
            headers:{
                'Authorization': `Bearer ${this.accessToken}`
            },             
          });
          this.discounts = response.data;
  console.log('Fetched discounts:', this.discounts);
        } catch (e) {
  console.error('Error Fetching:', e);
          this.hasErrorFetching = true;
        } finally {
          this.isDiscountsLoading
           = false;
        }
      },
  
      async deleteDiscount(discountToDelete) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_URL}/discount/${discountToDelete.id}`, {
            headers:{
                'Authorization': `Bearer ${this.accessToken}`
            },
          });
            this.$refs.noteMessage.showNotification(`The element code ${discountToDelete.id} was deleted successfully`);
            this.discounts = this.discounts.filter(element => element.id !== discountToDelete.id);
        } catch (e) {
          console.error('Error deleting discount:', e);
        }
      },
    },
    watch: {
    },
    computed: {
      filteredAndSortedDiscounts() {
        if (!Array.isArray(this.discounts) || this.discounts.length === 0) {
            return [];
        }
        const filteredDiscounts = this.discounts.filter(discount => {
            const nameMatches = discount.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            const codeMatches = discount.id.toString().includes(this.searchQuery.toString());
            return nameMatches || codeMatches;
        });
  
        return [...filteredDiscounts].sort((element1, element2) => {
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
      this.fetchDiscounts();
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
    .flip-list-move {
      transition: transform 0.5s ease;
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
    .temporary{
        font-weight: 500;
        color: red;
    }
  </style>