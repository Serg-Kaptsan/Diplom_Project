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
        <select class="sort_btn btn btn-light"
            v-model="selectedUserRole"
            @change="handleRoleChange"
            :options="roles"
            id="categorySelect" >
                <option value="">Select a Role</option>
                <option 
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.name"
                >                            
                    {{ role.name }}
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
      <div v-if="!isUsersLoading" class="card-container" >
        <div 
            v-for="user in filteredAndSortedUsers"
            :key="user.id">
        <user-item 
            :user="user"
            :role="role"
            @delete="deleteUser">
        </user-item>
        </div>
      </div>
      <div v-else class="temporary">Loading</div>

        <div class="empty-list" 
            v-if="!isUsersLoading && filteredAndSortedUsers.length === 0">
            Nothing was found for your search query
        </div>
    </div>
    <div v-intersection="() => loadMorePages(selectedRole)" class="observer"> </div>
</template>

<script>
  import axios from 'axios';
  import UserItem from "@/components/UserItem";
  import MySelect from '@/components/UI/MySelect';
  import AdminMenu from '@/components/UI/AdminMenu';

  export default {
    components: {
      UserItem,
      AdminMenu,
      MySelect,
    },

    data(){
      return {
        accessToken: localStorage.getItem('token'),
        currentPage: 0,
        itemsPerPage: 10,
        totalPages: 0,
        isUsersLoading: false,
        selectedSort: '',            
        users:[],
        roles: [],
        selectedUserRole: '',
        selectedRole: null,
        searchQuery: '',
        searchResults: [],
        sortOptions: [
          {value: 'id', name: 'id'},
          {value: 'name', name: 'name'},
          {value: 'surname', name: 'surname'},
          {value: 'phone', name: 'phone'},
          {value: 'email', name: 'email'},
          {value: 'roles', name: 'roles'},
        ],
      }
    },

    methods:{
      async fetchUsers() {
        try {
          this.isUsersLoading = true;
          const response = await axios.get('http://localhost:8081/users', {
            params: {
                page: this.currentPage,
                pageSize: this.itemsPerPage
            }                    
          });
          this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
          this.products = response.data.content;

console.log('Role is:', this.role);
        } catch (e) {
console.error('Error Fetching:', e);
          this.hasErrorFetching = true;
        } finally {
          this.isUsersLoading = false;
        }
      },
      async loadMorePages() {
        try {
          if (!this.isUsersLoading) {
            this.currentPage += 1;
            let response;                 
          
            this.totalPages = Math.ceil(response.data.totalElements / this.itemsPerPage)
            this.products.push(...response.data.content);
console.log(response);
          }
        } catch (e) {
console.error('Error Fetching:', e);
          this.hasErrorFetching = true;
        }
      },
      handleRoleChange() {
        this.selectedRole = this.userRole[this.selectedUserRole];
        console.log('Selected role:', this.selectedUserRole);
        this.filterByRole();
        this.currentPage = 0;
      },
      async filterByRole(){
        if (this.selectedRole) {
          try {
            const response = await axios.get(`http://localhost:8081/users/roles/${this.selectedRole}`);
            this.role = response.data;
          } catch (error) {
            console.error('Error filtering by role:', error);
          } 
        }else {
          this.fetchUsers();
        }                         
      },
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
            const filteredUsers = allUsers.filter(element => {
                const nameMatches = element.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const codeMatches = element.id.toString().includes(this.searchQuery.toString());
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
                
                if (this.selectedSort === 'role') {
                const role1 = element1.users?.roles || '';
                const role2 = element2.users?.roles || '';
                return role1.localeCompare(role2);
                }  
            });
        },

        handleSearchResults(results) {
            this.searchResults = results;
        },  
    },

    mounted() {
        this.fetchUsers();
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
        height: 15px;
    }
    .temporary{
        font-weight: 500;
        color: red;
        }
</style>