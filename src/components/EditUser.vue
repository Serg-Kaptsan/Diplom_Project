<template>
    <admin-menu> </admin-menu>
    <div class="container">
        <div class="header">
            <h2>Edit Users Data</h2>
        </div>    
        <div class="edit-form">
            <div class="form-group">
                <label for="input_name">name:</label>
                <input
                    v-model.trim="name"
                    v-focus
                    type="text" class="form-control" 
                    id="input_name" 
                    placeholder="Enter your name"
                    @blur="validateName"
                    required>
                <label for="input_surname">surname:</label>
                <input
                    v-model.trim="surname"
                    type="text" 
                    class="form-control" 
                    id="input_surname"
                    placeholder="Enter your surname">
                <label for="input_phone">phone:</label>
                <input
                    v-model.trim="phone"
                    type="text" 
                    class="form-control" 
                    id="input_phone"  
                    aria-describedby="phonHelp" 
                    placeholder="Your phone number"
                    @blur="validatePhone"
                    required >
                <div class="form-text" id="phonHelp">
                    phone number in the format +380XXXXXXXXX
                </div>
                <label for="email">email:</label>
                <input
                    v-model.trim="email"
                    type="email" 
                    class="form-control" 
                    id="regEmail" 
                    placeholder="Enter your email address"
                    @blur="validateEmail"
                    required>
                <!-- <label for="password">password:</label>
                <input
                    v-model.trim="password"
                    type="password" 
                    class="form-control" 
                    id="regPassword" 
                    placeholder="Create a password"
                    @blur = "validatePassword"
                    autocomplete="off"
                    required> -->
            </div>
            <div class="button_group">
                <button class="main_button cancel"
                    type="button" 
                    @click="viewDiscount"
                    v-if="buttonVisible">
                    Cancel changes
                </button>
                <button class="main_button submit"
                    type="button" 
                    @click="saveChanges"
                    v-if="buttonVisible">
                    Save changes
                </button>
                <div class="create_Success"
                    id="editSuccess"
                    v-if="editSuccess"
                    @click="viewDiscount">
                    Data edited successfully.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components:{
    },
    
    data() {
        return {
            accessToken: localStorage.getItem('token'),
            product: {
                name: '',
                description: '',
                sku: '',
                price: null,
                quantity: null,                
                discount: '',
                discountId: null,
                discountIdMap: {},
                category: '',
                categoryId: null,
                categoryIdMap: {}
            },
            createSuccess: false,
            buttonVisible: true,
            maxLength: 255,
            imagePreview: null,
            discounts: [],
            selectedDiscountName: '',
            selectedDiscountId: null,
            discountIdMap: {},
            categories: [],
            selectedCategoryName: '',
            selectedCategoryId: null,
            categoryIdMap: {},
        }
    },
    computed: {
        remainingCharacters() {
            if (this.product.description){
              return this.maxLength - this.product.description.length;  
            } else{
                return this.maxLength;
            }
        }
    },
    methods: {
        viewProduct() {
            this.$router.push({ name: 'product', params: { id: this.product.id } });
        },
        checkDescriptionLength() {
          if (this.product.description.length > this.maxLength) {
            this.product.description = this.product.description.slice(0, this.maxLength);
          }
        },
        async loadDiscounts() {
            try {
                const response = await axios.get('http://localhost:8081/discount', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                if (response.status === 200) {
                    this.discounts = response.data.map(discount => {
                this.discountIdMap[discount.name] = discount.id;
                return discount.name;
            });
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        },
        handleDiscountChange() {
            this.selectedDiscountId = this.discountIdMap[this.selectedDiscountName];
            console.log('Selected discount id:', this.selectedDiscountId);
        },
        async loadCategory() {
            try {
                const response = await axios.get('http://localhost:8081/product-categories', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                
                if (response.status === 200) {
                    this.categories = response.data.map(category => category.name);
                    response.data.forEach(category => {
                    this.categoryIdMap[category.name] = category.id;
                    });
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        handleCategoryChange() {
            this.selectedCategoryId = this.categoryIdMap[this.selectedCategoryName];
            console.log('Selected category id:', this.selectedCategoryId);
        },
        async fetchData() {
            const productId = this.$route.params.id;
            try {
                await this.loadDiscounts();
                await this.loadCategory();
                const response = await axios.get(`http://localhost:8081/product/${productId}`);
                this.product = response.data;

                console.log('product.discountId:', this.product.discountId);
                console.log('product.categoryId:', this.product.categoryId);

                if (this.product.discountId) {
                this.selectedDiscountName = Object.keys(this.discountIdMap).find(key => this.discountIdMap[key] === this.product.discountId);
                }
                console.log('product.discount.name:', this.selectedDiscountName);

                if (this.product.categoryId) {
                this.selectedCategoryName = Object.keys(this.categoryIdMap).find(key => this.categoryIdMap[key] === this.product.categoryId);
                }
                console.log('product.category.name:', this.selectedCategoryName);

            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        },

        async saveChanges() {
            if (!this.product.name) {
                alert("Product name is required.");
                return;
            }
            this.product.price = parseFloat(this.product.price);
            if (!isNaN(this.product.price)) {
                this.product.price = this.product.price.toString().replace(',', '.');
            }
            if (this.selectedDiscountName) {
                this.product.discountId = this.selectedDiscountId;
            } else {
                this.product.discountId = null;
            }
            if (this.selectedCategoryName) {
                this.product.categoryId = this.selectedCategoryId;
            } else {
                this.product.categoryId = null;
            }
            
            try {
                const productId = this.$route.params.id;

                const productData = {
                    id: this.product.id,
                    name: this.product.name,
                    description: this.product.description,
                    sku: this.product.sku,
                    price: this.product.price,
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                    // discountId: null,
                    // categoryId: null,
                    quantity: this.product.quantity,
                    // photoId: photoId,
                };
                console.log('Sending request with productId:', productId);
                const changeResponse = await axios.post(`http://localhost:8081/product/${productId}`, productData, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    data: productData,
                });

                if (changeResponse.status === 200) {
                    this.editSuccess = true;
                    this.buttonVisible = false;
                    console.log('Data sent successfully.');
                } else {
                    console.error('Error sending data.');
                }
            } catch (error) {
                console.error('Error sending data to /product/', error);
            }
        }
    },
    mounted() {
        this.fetchData();
        this.loadDiscounts();
        this.loadCategory();
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
    .edit-form {
        width: 100%;
        max-width: 550px;            
        border: 1px solid black;
        padding: 20px;
        margin: auto;
    }
    input{
        padding: 3px 12px;
    }
    label{
        font-weight: 500;
    }
    label + label{
        margin-top: 10px;        
    }
    .submit{
        /* display: none; */
        color: white;
        background-color: #00a046;
        transition: background-color 0.3s;
        float: right;
        width: 200px;
        margin-top: 15px;
    }
    .submit:hover{
        background-color: #00bc52;        
    }
    .button_group{
       display: flex;
       justify-content: space-between;
       margin-top: 10px;
    }
    .main_button {
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        margin: auto 15px;
    }
    .button_group button{
        margin: auto 0;
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

</style>
