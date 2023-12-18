<template>
  <admin-menu> </admin-menu>
  <div class="container">
    <div class="header">
      <h2>Edit product</h2>
    </div>

    <form class="edit-form" id="edition">   
      <div class="top-section">
        <div class="left-box">

          <div class="section mb-3" id="discount_box">
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

          <div class="section mb-3" id="category_box">
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
        <div class="preview">
          <img
            id="image-preview"
            :src="'data:image/jpeg;base64,' + product.imageData"
            :alt="product.name"
          >          
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
            @click="$router.push('/admin')"
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
          @click="$router.push('/admin')">
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
        categoryIdMap: {},
        photoId: null
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
        checkDescriptionLength() {
          if (this.product.description.length > this.maxLength) {
            this.product.description = this.product.description.slice(0, this.maxLength);
          }
        },
        async loadDiscounts() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/discount`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                });
                if (response.status >= 200 && response.status <300) {
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
        async fetchData() {
            const productId = this.$route.params.id;
            try {
                await this.loadDiscounts();
                await this.loadCategory();
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/product/${productId}`);
                this.product = response.data;

                console.log('product.discountId:', this.product.discountId);
                console.log('product.categoryId:', this.product.categoryId);
                console.log('product.')

                if (this.product.discountId) {
                this.selectedDiscountName = Object.keys(this.discountIdMap).find(key => this.discountIdMap[key] === this.product.discountId);
                }

                if (this.product.categoryId) {
                this.selectedCategoryName = Object.keys(this.categoryIdMap).find(key => this.categoryIdMap[key] === this.product.categoryId);
                }
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

          this.product.discountId = this.selectedDiscountId !== null ? this.selectedDiscountId : this.product.discountId;
          if (!this.selectedDiscountName) {
              alert('Discount field cannot be empty');
              return;
          }

          this.product.categoryId = this.selectedCategoryId !== null ? this.selectedCategoryId : this.product.categoryId;
          if (!this.selectedCategoryName) {
              alert('Category field cannot be empty');
              return;               
          }
          
          try {
            const productId = this.$route.params.id;
            const productData = {
              id: `${productId}`,
              name: this.product.name,
              description: this.product.description,
              sku: this.product.sku,
              price: this.product.price,
              createdAt: this.product.createdAt,
              modifiedAt: new Date().toISOString(),
              deletedAt: null,
              discountId: this.product.discountId, 
              categoryId: this.product.categoryId,
              quantity: this.product.quantity,
              photoId: this.product.photoId
            };
              
              const changeResponse = await axios.post(`${process.env.VUE_APP_API_URL}/product/${productId}`, productData, {
                  headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                  },
              });

              if (changeResponse.status >= 200 && changeResponse.status < 300) {
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
    .top-section{
      display: flex;
      margin-bottom:15px;
    }
    .section {
        text-align: start;
        margin: auto;
    }
    #photo_box{
        display: flex;
        align-items: center;
    }
    label {
        font-weight: bold;
        margin-bottom: 7px;
    }

    .main_input {
      width: 100%;
      padding: 5px;
    }
    .preview{
      text-align: center;
      margin: auto;      
    }
    #image-preview{
      max-width: 200px;
      max-height: 150px;
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
        margin: auto 15px;
    }
    .button_group{
       display: flex;
       justify-content: space-between;
       margin-top: 10px;
    }
    .button_group button{
        margin: auto;
    }
    .cancel {
        background-color: red;
    }
    .create_Success {
      width: 100%;
      text-align: center;
      font-weight: bold;
      color: #4CAF50;
      padding: 10px;
      border: 1px solid #4CAF50;
      background-color: #f0f8f0;
      margin: 10px auto;
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
        #image-preview{
          margin-left: 20px;
        }
        .form-group button,
        .form-group textarea {
            font-size: 14px;
        }
        .form-group input {
            font-size: 14px;
        }
        .button_group button{
          font-size: 14px;
        }
    }
</style>