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
                    @input="updateSelectedNumber($event.target.value)"
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
                <button class="btn btn-primary"
                    @click="toBuy"> Buy the product </button>
                <button class="btn btn-danger"
                @click="() => removeFromCart(getCartItem.productId)"> Remove </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
    components: {
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
            itemAmount: Number,
        }
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
                this.selectedNumber = this.getCartItem.selectedNumber;
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
         ...mapGetters(['getCartItems', 'getSelectedNumber']),

        discountPrice() {            
            const price = this.product.price;
            if (this.productDiscount && this.productDiscount.discountPercent !== undefined) {
          const discount = parseFloat(this.productDiscount.discountPercent.replace('%', ''));
                return (price - (price * discount / 100)).toFixed(2);
            } else {
                return 0;
            }
        },
        itemAmount() {
            return (this.discountPrice * this.selectedNumber).toFixed(2);
        },
    },
    methods:{
        updateSelectedNumber(newValue) {
            const numericValue = Number(newValue);
            this.$store.commit('setSelectedNumber', numericValue);
            this.$store.commit('updateCartItemQuantity', {
                productId: this.getCartItem.productId,
                quantity: numericValue,
            });
            this.recalculateTotals();
        },
        removeFromCart(productId) {
            this.$store.commit('removeFromCart', productId);
            this.recalculateTotals(); 
            alert (`The product code ${productId} was successfully removed from the cart`)
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
        }
    }
}
</script>

<style scoped>
    h1{
        margin: 40px 25px;
    }
    .card-item {
        width:95%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;        
        margin: auto;
        margin-top: 20px;
        padding: 10px;
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
        max-height: 200px;
        width: auto;
    }
    .card-body{
        max-width: 40%;
        padding: 10px;
        margin-left: 10px;
    }
    h5 {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px; 
    }
    p {
        font-size: 18px;
    }
    .item-count-block{
        padding: 10px;
    }
    .count{
        display: flex;
        justify-content: end;
        font-size: 18px;
        padding: 5px;
    }
    .item-calculation, .input-calculation{
        width: 80px;
        margin-left: 12px;
        font-weight: 500;
        text-align: end;
    }
    .input-calculation{
        text-align: center;
    }
    .button-block {
        display: flex;
        justify-content: space-between;
        padding: 5px;
    }
    .button-block *{
        padding: 4px 12px;
    }
    .cansel{
        background-color: red;
    }

    @media only screen and (max-width: 768px) {
        .card-img-block{
            width: 100%;
        }
        .card-img-top {
            padding: 20px;
        }
        .card-body{
            width: 100%;
        }
    }
    @media only screen and (max-width: 576px) {
        h5 {
            font-size: 20px;
            margin-bottom: 16px; 
        }
        p {
            font-size: 16px;
        }
        .last {
            margin-bottom: 5px;            
        }
        span {
            font-size: 12px;
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
</style>
