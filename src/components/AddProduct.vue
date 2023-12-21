<template> 
       <admin-menu> </admin-menu>      

    <div class="container">
        <div class="header">
            <h2>Create Product</h2>
        </div>

        <form class="edit-form" id="edition">            
            <div class="section mb-4" id="photo_box">
                <div>
                    <label for="image" class="form-label">Select photo:</label>
                    <input class="form-group main_input"
                        type="file"
                        id="image"
                        ref="image" 
                        accept=".jpg, .jpeg, .png" 
                        data-placeholder="Choose a photo"
                        @change="handleImageChange"
                    >
                </div>
                <div>
                    <img
                        id="image-preview"
                        :src="imagePreview"
                        alt="Preview"
                        v-if="imagePreview"
                    >
                </div>
            </div>
            <div class="select mb-3" id="discount_box">
                <div>
                    <label for="discount" class="form-label">Discount:</label>
                    <select class="form-group main_input"
                        id="discount"
                        v-model="selectedDiscountName"
                        @change="handleDiscountChange"
                        @focus="loadDiscounts"
                    >
                        <option value="">Select a discount</option>
                        <option 
                            v-for="discount in discounts"
                            :key="discount"
                            :value="discount"
                        >                            
                            {{ discount }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="select mb-3" id="category_box">
                <div>
                    <label for="category" class="form-label">Category:</label>
                    <select class="form-group main_input"
                        id="category"
                        v-model="selectedCategoryName"
                        @change="handleCategoryChange"
                        @focus="loadCategory"
                    >
                        <option value="">Select a category</option>
                        <option 
                            v-for="category in categories"
                            :key="category.id"
                            :value="category"
                        >                            
                            {{ category }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="information">
                <input class="form-group product_name"
                    type="text"
                    id="name"
                    v-focus
                    v-model="product.name"    
                    placeholder="Enter Product Name" >

                <textarea class="form-group description"
                    id="description"
                    v-model="product.description"
                    placeholder="Enter Product Description"
                    autocomplete="on"
                    @input="checkDescriptionLength"
                    aria-describedby="remain">
                </textarea>
                    <p class="form-text" id="remain">
                        Remaining characters: {{ remainingCharacters }}
                    </p>

                <input class="form-group sku"
                    type="text"
                    id="sku"
                    v-model="product.sku"
                    placeholder="SKU" >

                <input class="form-group price"
                    type="number"
                    id="price"
                    v-model="product.price"
                    placeholder="Enter Price of this Product" >

                <input class="form-group quantity"
                    type="number"
                    id="quantity"
                    v-model="product.quantity"
                    placeholder="Enter quantity of products" >
            </div>
            <div class="button_group">
                <button class="main_button cancel"
                    title="Back to Admin Page"
                    type="button" 
                    @click="$router.push('/admin')"
                    v-if="buttonVisible">
                    Cancel changes
                </button>
                <button class="main_button submit"
                    type="button" 
                    @click="createProduct"
                    v-if="buttonVisible"
                    >
                    Save data
                </button>
            </div>
            <div class="create_Success"
                id="editSuccess"
                v-if="createSuccess"
                @click="clearForm">
                Data saved successfully.
                <br>Click for create next product.
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
            return this.maxLength - this.product.description.length;
        }
    },
    methods: {
        checkDescriptionLength() {
          if (this.product.description.length > this.maxLength) {
            this.product.description = this.product.description.slice(0, this.maxLength);
          }
        },

        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.imagePreview = URL.createObjectURL(file);
            } else {
                this.imagePreview = null;
            }
        },

        async loadDiscounts() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/discount`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                if (response.status >= 200 && response.status < 300) {
                    this.discounts = response.data.map(discount => discount.name);
                    response.data.forEach(discount => {
                    this.discountIdMap[discount.name] = discount.id;
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
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/product-categories`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                
                if (response.status >= 200 && response.status < 300) {
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

        async createProduct() {
            if (!this.product.name) {
                alert("Product name is required.");
                return;
            }

            this.product.price = parseFloat(this.product.price);
            if (!isNaN(this.product.price)) {
                this.product.price = this.product.price.toString().replace(',', '.');
            }

            if (!this.selectedDiscountName) {
                alert('You cannot create a product without Discount name. \nIf the product does not have a discount, then select "no discount".');
                return;
            } else {
                this.product.discountId = this.selectedDiscountId;
            }
            if (!this.selectedCategoryName) {
                alert('You cannot create a product without Category.');
                return;
            } else {
                this.product.categoryId = this.selectedCategoryId;
            }

            try {
                const fileInput = this.$refs.image.files[0];
                let photoId = null;

                if (!fileInput) {
                    alert ('You cannot create a product without a photo.');
                    return;
                    } else {
                    const formData = new FormData();
                    formData.append('image', fileInput);

                    const uploadResponse = await axios.post(`${process.env.VUE_APP_API_URL}/photos/upload`, formData, {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
                        console.log('File uploaded successfully.');
                        photoId = uploadResponse.data;
                    }
                }
               
                const productData = {
                    name: this.product.name,
                    description: this.product.description,
                    sku: this.product.sku,
                    price: this.product.price,
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                    discountId: this.product.discountId,
                    categoryId: this.product.categoryId,
                    quantity: this.product.quantity,
                    photoId: photoId,
                };

                const createResponse = await axios.post(`${process.env.VUE_APP_API_URL}/product/`, productData, {
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
                console.error('Error sending data to /product/', error);
            }
        },

        clearForm() {
            this.product = {
                name: '',
                description: '',
                sku: '',
                price: null,
                discountId: null,                
                quantity: null,
                photoId: null
                };
            this.selectedDiscountName = '';
            this.selectedCategoryName = '';
            this.createSuccess = false;
            this.buttonVisible = true;
            this.$refs.image.value = '';
            this.imagePreview = null;
        },
    },
    mounted() {
        this.loadDiscounts();
        this.loadCategory();
    }
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
    .main_button {
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 14px;
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
        margin-bottom:1.2rem !important;
    }
    #photo_box{
        display: flex;
        align-items: center;
    }
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }
    .select{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .select label{
        text-align: left;
        width: 102px;
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
        margin: 7px;
        padding: 5px;
        width: 100%;
    }
    .description {
        text-align: left;
        white-space: pre-line;
    }
    #remain {
        text-align: left;
        margin-left: 5;
        margin-top: -15px;
    }
    .submit {
        float: right;
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
    textarea:hover {
        background-color: transparent;
    }

    @media only screen and (max-width: 768px) {
        .header h2 {
            font-size: 20px;
        }
    }

    @media only screen and (max-width: 576px) {
        .header h2 {
            font-size: 18px;
        }
        .form-group button,
        .form-group textarea {
            font-size: 14px;
        }
        .form-group input {
            font-size: 14px;
        }
    }
</style>
