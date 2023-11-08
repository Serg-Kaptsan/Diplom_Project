<template>
    <div class="container">
        <div class="header">
            <h1>Edit product</h1>
            <button class="main_button" 
                @click="$router.push ('/admin')" >
                Back to Products
            </button>
        </div>

        <form class="edit-form" id="edition">
            <div class="section mb-4" id="photo_box">
                <div>
                    <label for="image" class="form-label">Change photo:</label>
                    <a :href="imageUrl" target="_blank">{{ fileName }}</a>
                    <input class="form-group main_input"
                        type="file"
                        id="image"
                        ref="image" 
                        accept=".jpg, .jpeg, .png" 
                        data-placeholder="Product photo"
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
                <button class="btn btn-secondary upload">
                    Upload
                </button>
            </div>
            <div class="section mb-4" id="discount_box">
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
                            :key="discount.id"
                            :value="discount"
                        >                            
                            {{ discount }}
                        </option>
                    </select>
                </div>
                <button class="btn btn-secondary discount_button">
                    Save discount
                </button>
            </div>

            <div class="section mb-4" id="category_box">
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
                <button class="btn btn-secondary category_button">
                    Save category
                </button>
            </div>

            <div class="information">
                <input class="form-group product_name"
                    type="text"
                    id="name"
                    v-focus
                    v-model="product.name"    
                    placeholder="Enter Product Name" >

                <textarea class="form-group description" wrap="hard"
                    id="description"
                    v-model="product.description"
                    placeholder="Enter Product Description"
                    autocomplete="on">
                    @input="checkDescriptionLength">
                </textarea>
                    <p class="form-text" id="remain">
                        Remaining characters: {{ remainingCharacters }}
                    </p>
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
                    <br>Click for back to products.
                </div>                
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
// import MySelect from '@/components/UI/MySelect';

export default {
    component:{
        // MySelect,
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

                // if (this.product.photoId) {
                // try {

                //     const imageResponse = await axios.get(`http://localhost:8081/product/imageData/${this.product.photoId}`, {
                //     responseType: 'blob',
                //     headers: {
                //         'Authorization': `Bearer ${this.accessToken}`
                //     }
                //     });

                //     const imageBlob = new Blob([imageResponse.data]);
                //     const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' });

                //     this.$refs.image.files[0] = imageFile;

                //     this.imagePreview = URL.createObjectURL(imageFile);
                // } catch (error) {
                //     console.error('Error fetching product image:', error);
                // }
                // }
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
                const fileInput = this.$refs.image.files[0];
                let photoId = null;
            if (fileInput) {
                    const formData = new FormData();
                    formData.append('image', fileInput);

                    const uploadResponse = await axios.put('http://localhost:8081/upload', formData, {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (uploadResponse.status === 200) {
                        console.log('File uploaded successfully.');
                        photoId = uploadResponse.data;
                    }
                }

                const productData = {
                    name: this.product.name,
                    description: this.product.description,
                    sku: this.product.sku,
                    price: this.product.price,
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                    discountId: null,
                    quantity: this.product.quantity,
                    photoId: photoId,
                };

                const chengeResponse = await axios.put('http://localhost:8081/product/${productId}', productData, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    data: productData,
                });

                if (chengeResponse.status === 200) {
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
    .edit-form {
        width: 100%;
        max-width: 550px;            
        border: 1px solid black;
        padding: 20px;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        box-sizing: border-box;
        overflow: auto;
    }
    .header {
        width: 100%;
        max-width: 625px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        margin-top: 20px;
    }
    .header h1 {
        margin: 0;
        padding: 10px;
        word-wrap: break-word;
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
        .header h1 {
            font-size: 24px;
        }
    }

    @media only screen and (max-width: 576px) {
        .header h1 {
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