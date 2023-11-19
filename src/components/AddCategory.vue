<template>
    <admin-menu> </admin-menu>
    <div class="container">
        <div class="header">
            <h2>Create Category</h2>
        </div>
        <form class="edit-form" id="edition">
            
            <div class="information">
                <div class="information-input">
                    <label for="name" class="form-label">Name:</label>
                    <input class="form-group category_name"
                        type="text"
                        id="name"
                        v-focus
                        v-model="category.name"    
                        placeholder="Enter category Name" >                    
                </div>
                <div class="description">
                    <label for="description" class="form-label label_description">Description:</label>
                    <textarea class="form-group description" wrap="hard"
                        v-model="category.description"
                        placeholder="Enter Category Description"
                        autocomplete="on">
                        @input="checkDescriptionLength">
                    </textarea>
                        <p class="form-text" id="remain">
                            Remaining characters: {{ remainingCharacters }}
                        </p>
                </div>
            </div>

            <div class="button_group">
                <button class="main_button cancel"
                    title="Back to Categories"
                    type="button"
                    @click="$router.push('/categories')"
                    v-if="buttonVisible">
                    Cancel changes
                </button>
                <button class="main_button submit"
                    type="button" 
                    @click="createCategory"
                    v-if="buttonVisible">
                    Save data
                </button>
                <div class="create_Success"
                    id="editSuccess"
                    v-if="createSuccess"
                    @click="clearForm">
                    Data edited successfully.
                    <br>Click for create next category.
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import AdminMenu from '@/components/UI/AdminMenu';

export default {
    components:{
        AdminMenu,
    },
    
    data() {
        return {
            accessToken: localStorage.getItem('token'),
            category: {
                name: '',
                description: '',
            },
            createSuccess: false,
            buttonVisible: true,
            maxLength: 255,
        }
    },
    computed: {
        remainingCharacters() {
            return this.maxLength - this.category.description.length;
        }
    },
    methods: {
        checkDescriptionLength() {
          if (this.category.description.length > this.maxLength) {
            this.category.description = this.category.description.slice(0, this.maxLength);
          }
        },        

        async createCategory() {
            if (!this.category.name) {
                alert("Category name is required.");
                return;
            }

            try {
                const categoryData = {
                    id: this.category.id,
                    name: this.category.name,
                    description: this.category.description,
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                };
                const createResponse = await axios.post('http://localhost:8081/product-categories/', categoryData, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (createResponse.status >= 200 && createResponse.status < 300) {
                    this.createSuccess = true;
                    this.buttonVisible = false;
                    console.log('Data sent successfully.');
                } else {
                    console.error('Error sending data.');
                }
            } catch (error) {
                console.error('Error sending data to /category/', error);
            }
        },
        clearForm() {
            this.category = {
                name: '',
                description: '',
                };
            this.createSuccess = false;
            this.buttonVisible = true;
        },
    },
    mounted() {
    },
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        overflow: auto;
    }
    .header {
        width: 100%;
        margin-bottom: 10px;
        margin-top: 0;
        text-align: center;
    }
    .edit-form {
        width: 100%;
        max-width: 550px;            
        border: 1px solid black;
        padding: 20px;
    }
    .section {
        display: flex;
        text-align: start;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom:1rem !important;
    }
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .information {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: auto;
    }
    .information *{
        text-align: center;
        padding: 5px;
        width: 100%;
    }
    .description {
        text-align: left;
        white-space: pre-line;
        padding: 5px;
    }    
    .label_description{
        text-align: left;
        margin-bottom: 0;
    }
    textarea {
        margin-top: 0; 
    }
    textarea:hover {
        background-color: transparent;
    }
    #remain {
        text-align: left;
        margin: -5px auto 5px 5px;
    }
    .information-input{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .information-input label{
        text-align: left;
        max-width: 150px;
    }
    .main_button {
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 13px;
        margin: auto 15px;
    }
    .button_group{
       display: flex;
       margin: 0;
       margin-top: 20px;
    }
    .button_group button{
        margin: auto;
    }
    .cancel {
        background-color: red;
    }
    .create_Success {
        width:100%;
        text-align: center;
        font-weight: bold;
        color: #4CAF50;
        padding: 10px;
        border: 1px solid #4CAF50;
        background-color: #f0f8f0;
        margin-top: 10px;
        cursor: pointer;
    }

    @media only screen and (max-width: 768px) {
        .header h2 {
            font-size: 24px;
        }
    }

    @media only screen and (max-width: 576px) {
        .header h2 {
            font-size: 20px;
        }
        .information *{
            font-size: 14px;
        }
        .form-label{
            width: 70%;
        }
        .button_group button{
            font-size: 14px;
        }
    }
</style>