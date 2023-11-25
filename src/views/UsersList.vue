<template>
    <admin-menu> </admin-menu>
    <div class="second-line">
        <h2>USERS LIST</h2>
        <div class="add-button-block">
            <div class="btn btn-secondary add-button" 
                @click="$router.push('/add-user')">
                Add user
            </div>             
        </div>
    </div>

    <div class="btn_container">
        <div for="searchInput" class="serch_block">
            <input type="text" 
                id="searchInput"
                v-focus
                v-model="searchQuery"
                placeholder="Enter the user CODE or name">
            <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Search">
        </div>
        <my-select class="sort_btn btn btn-light"
            v-model="selectedSort"
            :options="sortOptions"                
            id="sortButton" >
            Sort by
        </my-select>
    </div>

    <div class="users-grid" id="usersList">
      <div v-if="!isUsersLoading" class="card-container" >
        <div 
            v-for="user in filteredAndSortedUsers"
            :key="user.id">
            <transition-group name="flip-list">
              <user-item 
                  :user="user"
                  @delete="deleteUser">
              </user-item>            
            </transition-group>
        </div>
      </div>
      <div v-else class="temporary">Loading</div>

        <div class="empty-list" 
            v-if="!isUsersLoading && filteredAndSortedUsers.length === 0">
            Nothing was found for your search query
        </div>
    </div>
    <!-- <div v-intersection="loadMorePages" class="observer"> </div> -->
</template>

<script>
  import axios from 'axios';
  import UserItem from "@/components/UserItem";

  export default {
    components: {
      UserItem,
    },

    data(){
      return {
        accessToken: localStorage.getItem('token'),
        // currentPage: 0,
        // itemsPerPage: 10,
        // totalPages: 0,
        isUsersLoading: false,
        selectedSort: '',            
        users:[],
        searchQuery: '',
        sortOptions: [
          {value: 'id', name: 'id'},
          {value: 'name', name: 'name'},
          {value: 'surname', name: 'surname'},
          {value: 'phone', name: 'phone'},
          {value: 'email', name: 'email'},
        ],
      }
    },

    methods:{
      async fetchUsers() {
        try {
          this.isUsersLoading = true;
          const response = await axios.get('http://localhost:8081/users', {
            headers:{
                'Authorization': `Bearer ${this.accessToken}`
            },             
            params: {
                page: this.currentPage,
                pageSize: this.itemsPerPage
            }, 
          });
          this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
          this.users = response.data;
console.log('Fetched users:', this.users);
        } catch (e) {
console.error('Error Fetching:', e);
          this.hasErrorFetching = true;
        } finally {
          this.isUsersLoading = false;
        }
      },

//       async loadMorePages() {
//         try {
//           if (!this.isUsersLoading) {
//             this.currentPage += 1;
//             let response= await axios.get('http://localhost:8081/users', {
//               headers:{
//                 'Authorization': `Bearer ${this.accessToken}`
//               },  
//               params: {
//                   page: this.currentPage,
//                   pageSize: this.itemsPerPage
//               }
//             });                 
//             this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
//             this.users.push(...response.data);
// console.log('Updated users:', this.users); 
//           }
//         } catch (e) {
// console.error('Error Fetching:', e);
//           this.hasErrorFetching = true;
//         }
//       },

      async deleteUser(userToDelete) {
        try {
          await axios.delete(`http://localhost:8081/users/${userToDelete.id}`, {
            headers:{
                'Authorization': `Bearer ${this.accessToken}`
            },
          });
            alert(`The element code ${userToDelete.id} was deleted successfully`);
            this.users = this.users.filter(element => element.id !== userToDelete.id);
        } catch (e) {
          console.error('Error deleting user:', e);
        }
      },
    },
    watch: {
    },
    computed: {
      filteredAndSortedUsers() {
            if (!Array.isArray(this.users) || this.users.length === 0) {
                return [];
            }
            const allUsers = this.currentPage > 0 ? this.users : this.users.slice(0, this.itemsPerPage);
            const filteredUsers = allUsers.filter(user => {
                const nameMatches = user.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const codeMatches = user.id.toString().includes(this.searchQuery.toString());
                return nameMatches || codeMatches;
            });

            return [...filteredUsers].sort((element1, element2) => {
                const value1 = element1[this.selectedSort];
                const value2 = element2[this.selectedSort];
                if (typeof value1 === 'number' && typeof value2 === 'number') {
                return value1 - value2;
                } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                return value1.localeCompare(value2);
                }
            });
        },
    },

    mounted() {
      this.fetchUsers();
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
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      grid-gap: 5px;
      margin: 10px;
      /* margin-bottom: 15px; */
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