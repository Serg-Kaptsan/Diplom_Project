<template>
    <div class="container">
        <div class="header">
            <h1>Create product</h1>
            <div class="back-to-product">
                <button class="main_button" 
                    @click="$router.push ('/admin')" >
                    Back to Products
                </button>
            </div>
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
                        :src="selectedImage"
                        alt="Preview"
                        v-if="selectedImage"
                    >
                </div>
            </div>
            <div class="section mb-4" id="discount_box">
                <div>
                    <label for="discount" class="form-label">Discount:</label>
                    <input class="form-group main_input"
                        type="number"
                        id="discount"
                        placeholder="Enter Discount" >
                </div>
            </div>
            <div class="section mb-4" id="category_box">
                <div>
                    <label for="category" class="form-label">Category:</label>
                    <input class="form-group main_input"
                        type="number"
                        id="category"
                        placeholder="Enter Category" >
                </div>
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
                    <p>Remaining characters: {{ remainingCharacters }}</p>

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
            <div class="form-group">
                <button class="main_button submit"
                    type="button" 
                    @click="createProduct">
                    Save data
                </button>
            </div>
            <div class="create_Success"
                id="editSuccess"
                v-if="createSuccess">
                Data saved successfully.
                <br>Click for create next product.
            </div>
        </form>
    </div>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            product: {
                name: '',
                description: '',
                sku: '',
                price: '',
                discountId: '',                
                quantity: '',
            },
            createSuccess: false,
            maxLength: 255,
            // imagePreview: null,
            selectedImage: null
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
                this.selectedImage = URL.createObjectURL(file);
            } else {
                this.selectedImage = null;
            }
        },

        async createProduct() {
            if (!this.product.name) {
                alert("Product name is required.");
                return;
            }

            try {
                const accessToken = localStorage.getItem('token');
                const fileInput = this.$refs.image.files[0];
                let photoId = null;

                if (fileInput) {
                    const formData = new FormData();
                    formData.append('image', fileInput);

                    const uploadResponse = await axios.post('http://localhost:8081/upload', formData, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
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
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                    discountId: null,
                    quantity: this.product.quantity,
                    photoId: photoId,
                };

                const createResponse = await axios.post('http://localhost:8081/product/', productData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (createResponse.status === 200) {
                    this.createSuccess = true;
                    console.log('Data sent successfully.');
                } else {
                    console.error('Error sending data.');
                }
            } catch (error) {
                console.error('Error sending data to /product/', error);
            }
        }
    }
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
        text-align: center;
        margin-bottom: 20px;
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
        max-width: 50px;
        max-height: 100px;
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
        margin: 10px;
        padding: 5px;
        width: 100%;
    }
    .information textarea {
        text-align: left;
    }
    .main_button {
        margin-top: 10px;
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
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
        .back-to-product button,
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