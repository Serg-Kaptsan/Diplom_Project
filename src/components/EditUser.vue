<template>
    <admin-menu> </admin-menu>
    <div class="container">
        <div class="header">
            <h2>Edit user</h2>
        </div>
        <form class="edit-form" id="edition">
            
            <div class="information">
                <div class="information-input">
                    <label for="name" class="form-label">Name:</label>
                    <input class="form-group user_name"
                        type="text"
                        id="name"
                        v-focus
                        v-model="user.name"    
                        placeholder="Enter User Name" >                    
                </div>             

                <div class="information-input">
                    <label for="sku" class="form-label"> SKU: </label>                    
                    <input class="form-group sku"
                        type="text"
                        id="sku"
                        v-model="product.sku"> 
                </div>
                <div class="information-input">
                    <label for="price" class="form-label"> Price: </label>                    
                    <input class="form-group price"
                        type="number"
                        id="price"
                        v-model="product.price"> 
                </div>
                <div class="information-input">
                    <label for="quantity" class="form-label"> Quantity: </label>                    
                    <input class="form-group quantity"
                        type="number"
                        id="quantity"
                        v-model="product.quantity">
                </div>
            </div>

            <div class="button_group">
                <button class="main_button cancel"
                    type="button" 
                    @click="createProduct"
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
                    @click="viewProduct">
                    Data edited successfully.
                    <br>Click for back to product.
                </div>                
            </div>
        </form>
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
    #photo_box{
        display: flex;
        align-items: center;
    }
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .main_input {
        width: 100%;
        padding: 5px;
    }
    #image-preview{
        max-width: 65px;
        max-height: 100px;
        margin-right: 15px;
    }
    #discount, #category {
        text-align: center;
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
        width: 102px;
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
       justify-content: space-between;
       margin-top: 10px;
    }
    .button_group button{
        margin: auto 0;
    }
    .cancel {
        background-color: red;
    }
    .create_Success {
        text-align: center;
        font-weight: bold;
        color: #4CAF50;
        padding: 10px;
        border: 1px solid #4CAF50;
        background-color: #f0f8f0;
        margin-top: 10px;
        cursor: pointer;
    }
    textarea {
        margin-top: 14px; 
    }
    textarea:hover {
        background-color: transparent;
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
        .form-group button,
        .form-group textarea {
            font-size: 14px;
        }
        .form-group input {
            font-size: 14px;
        }
        .discount_button{
            min-width: 124px;
            padding: 6px;
        }
    }
</style>