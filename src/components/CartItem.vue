<template >
    <div class="card-item">

        <div class="large-image"
            v-if="isLargeImageVisible" 
            @click.stop="closeLargeImage"
        >
            <img
                :src="largeImageSrc" :alt="product.name" 
                @click="closeLargeImage" />
        </div>

        <div class="card-img-block"
            @click="openLargeImage"
        >
            <img class="card-img" 
                :src="'data:image/jpeg;base64,' + product.imageData" 
                :alt="product.name"
                v-focus
            />
        </div>
        <div class="card-body">
            <h5 class="card-title"> {{ product.name }} </h5>
            <p class="card-text"> <strong> Code: </strong> {{ product.id }}</p>
            <p class="card-text" v-if="productCategory"> <strong> Category: </strong> 
                {{ productCategory.name }}
            </p>
            <p class="card-text"> <strong> Price: </strong> {{ product.price }} $</p>       
            <p class="card-text"> <strong> Discount percent: </strong> 
                {{ productDiscount.discountPercent }}
            </p> 
        </div>
        <div class="item-count-block">

            <div class="count">
               <div class="count-text"> Select quantity </div> 
                <input class="form-controle input-calculation"
                    type="number"
                    min="1" 
                    v-model="selectedNumber"
                    @input="updateSelectedNumber"
                />
            </div>

            <div class="count">
               <div class="item-text"> Price:</div>
               <div class="item-calculation"> {{ product.price }} $</div>
            </div>

            <div class="count">
               <div class="item-text"> Price including discount: </div>
               <div class="item-calculation"> {{ discountPrice }} $</div>
            </div>

            <div class="count">
               <div class="item-text"> Sum: </div>
               <div class="item-calculation"> {{ itemAmount }} $</div>
            </div>
            <div class="button-block">
                <!-- <button class="btn btn-primary"
                    @click="openWindow"> Buy the product 
                </button> -->
                <button class="btn btn-danger"
                    @click="removeFromCart(getCartItem.productId)"> Remove
                </button>
            </div>
        </div>
        <!-- <my-notification ref="noteMessage"></my-notification> -->
    </div>
    <!-- <div class="dialog-window"
      v-if="isWindowVisible"
      @click.stop="closeWindow"
   >
    <div class="window__content">
         <dialogue-payment
            @click.stop 
            :stateTotalNumber="stateTotalNumber"
            :stateTotalAmount="stateTotalAmount"
         >
         </dialogue-payment>      
      </div>
    </div>   -->
</template>

<script>
import axios from 'axios';
import DialoguePayment from '@/components/DialoguePayment';
// import MyNotification from '@/components/UI/MyNotification';
import { mapGetters } from 'vuex';

export default {
    components: {
        DialoguePayment,
        // MyNotification,
    },
    props: {
        getCartItem: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            accessToken:localStorage.getItem('token'),
            product: Object,
            isLargeImageVisible: false,
            largeImageSrc: String,
            productCategory: Object,
            productDiscount: Object,
            selectedNumber: 1,
            // isWindowVisible: false,
        }
    },
    created() {
        this.itemAmount = (this.discountPrice * this.selectedNumber).toFixed(2);        
    },

    mounted() {
        const productId = this.getCartItem.productId;
console.log(`productId: ${productId}`)
        axios.get(`http://localhost:8081/product/${productId}`)
        .then(response => {
            this.product = response.data;
            const discountId = this.product.discountId;            
            const categoryId = this.product.categoryId;
    console.log(`productId: ${productId}`);         
    console.log(`discountId: ${discountId}`);
    console.log(`categoryId: ${categoryId}`);

            axios.get(`http://localhost:8081/discount/${discountId}`, {
                headers:{
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.productDiscount = response.data;
console.log(`discountPercent: ${this.productDiscount.discountPercent}`);
                this.discountPrice;
            })
            .catch(error => {
                console.error('Error fetching discount:', error);
            });

            axios.get(`http://localhost:8081/product-categories/${categoryId}`, {
                headers:{
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }                
            })
            .then(response => {
                this.productCategory = response.data;
                this.selectedNumber = this.getCartItem.selectedNumber || 1;
            })
            .catch(error => {
                console.error('Error fetching category:', error);
            });            
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
    },
    computed: {
        ...mapGetters(['getCartItems', 'stateTotalAmount', 'getItemAmount']),

        itemAmount() {
            const productId = this.getCartItem.productId;
            return this.getItemAmount(productId);
        },

        discountPrice() {
            const price = this.product.price;
            if (this.productDiscount && this.productDiscount.discountPercent !== undefined) {
          const discount = parseFloat(this.productDiscount.discountPercent.replace('%', ''));
                return (price - (price * discount / 100)).toFixed(2);
            } else {
                return 0;
            }
        },
    },

    methods:{
        updateSelectedNumber() {
            this.$store.commit('updateCartItemQuantity', {
                productId: this.getCartItem.productId,
                quantity: this.selectedNumber,
            });

            this.$store.dispatch('recalculateItemAmount', {
                productId: this.getCartItem.productId,
                discountPrice: this.discountPrice,
                selectedNumber: this.selectedNumber,
            });
        },

        removeFromCart() {
            this.$emit('removeFromCart', this.getCartItem.productId);
            // this.$refs.noteMessage.showNotification(`The product code ${productId} was successfully removed from the cart`);
        },
        recalculateTotals() {
            this.$store.dispatch('recalculateTotals');
        },
        openLargeImage() {
            this.isLargeImageVisible = true;
            this.largeImageSrc = `data:image/jpeg;base64, ${this.product.imageData}`;
        },
        closeLargeImage() {
            this.isLargeImageVisible = false;
        },
        // openWindow() {
        //     this.isWindowVisible = true;
        //  },
        //  closeWindow() {
        //     this.isWindowVisible = false;
        //  },
    }
}
</script>

<style scoped>
    .card-item {
        width:95%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;        
        margin: auto;
        margin-top: 20px;
        padding: 5px;
        background-color: white;
    }
    .card-img-block{
        width: 20%;
        height: 100%;
        padding: 10px;
        text-align: center;  
        cursor: pointer;
    }
    .card-img {
        margin: auto;
        max-height: 175px;
        width: auto;
    }
    .card-body{
        max-width: 40%;
        padding: 10px;
    }
    h5 {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        margin-top: 3px;
        margin-bottom: 15px; 
    }
    p {
        font-size: 18px;
        margin-bottom: 8px;
    }
    .item-count-block{
        padding: 5px;
        margin-right: 38px;
    }
    .count{
        display: flex;
        justify-content: end;
        font-size: 18px;
        padding: 4px;
    }

    .item-calculation {
        width: 105px;
        margin-left: 12px;
        font-weight: 500;
        text-align: end;
    }
    .input-calculation{
        text-align: center;
        width: 80px;
        margin-left: 37px;
        font-weight: 500;
    }
    .button-block {
        display: flex;
        justify-content: space-between;
        padding: 5px;
    }
    .button-block *{
        padding: 4px 12px;
    }

    @media only screen and (max-width: 960px) {
        .card-item {
            flex-wrap: wrap;
            justify-content: center;
            width:90%;
            margin-top: 10px;
        }
        .card-img-block{
            width: 40%;
            text-align: left;
        }
        .item-count-block{
            margin-right: 0;
        }
    }
    @media only screen and (max-width: 768px) {
        .card-body{
            max-width: 60%;
            padding: 10px;
        }

    }
    @media only screen and (max-width: 576px) {
        .card-item {
            width:100%;
            margin-top: 10px;
        }
        .card-img-block{
            /* width: 20%; */
            /* height: 100%; */
            padding: 5px;
        }
        .card-img {
            max-height: 125px;
        }
        .card-body{
            padding: 5px;
        }
        h5 {
            font-size: 14px;
            margin-bottom: 10px; 
        }
        p {
            font-size: 12px;
            margin-bottom: 6px;
        }
        .item-count-block{
            font-weight: 600;
        }
        .count{
            font-size: 12px;
            padding: 2px;
        }
        .item-calculation {
            width: 80px;
            margin-left: 0;
            font-weight: 700;
        }
        .input-calculation{
            width: 60px;
            margin-left: 20px;
        }
        .button-block *{
            font-size: 10px;
            padding: 3px 10px;
        }
    }

    .large-image{
        position: fixed;
        display: flex;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2;
    }
    .large-image img{
        margin: 50px auto auto;
        max-width: 90%;
        max-height: 90%;
    }
    .dialog-window{
      position: fixed;
      display: flex;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.7);
   }
   .window__content {
      margin: 100px auto auto;
      background: white;
      border-radius: 12px;
      min-height: 200px;
      min-width: 350px;
      padding: 20px;
   }
</style>
