<template>
    <div class="card-item" v-if="product" >

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
            <p class="card-text" v-if="productDiscount"> <strong> Discount percent: </strong> 
                {{ productDiscount.discountPercent }}
            </p> 
        </div>
        <div class="item-count-block">

            <div class="count">
               <div class="count-text"> Select quantity </div> 
                <input class="form-controle item-calculation"
                    type="number"
                    v-model="selectedNumber"
                    min="1"
                />
            </div>

            <div class="count">
               <div class="item-text"> Price:</div>
               <div class="item-calculation"> {{ product.price }} $</div>
            </div>

            <div class="count">
               <div class="item-text"> Price including discount: </div>
               <div class="item-calculation"> {{ discountPrice }} </div>
            </div>

            <div class="count">
               <div class="item-text"> Sum: </div>
               <div class="item-calculation"> {{ itemAmount }} $</div>
            </div>
            <button @click="removeFromCart">Remove</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components: {
    },
    data() {
        return {

            accessToken: localStorage.getItem('token'),
            product: Object,
            isLargeImageVisible: false,
            largeImageSrc: '',
            productCategory: null,
            productDiscount: null,
            selectedNumber: Number,
            itemAmount: Number,
            removeFromCart: Function,            
        }
        
    },

    mounted() {
        const productId = this.$route.params.id;

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
        discountPrice() {

        },
        itemAmount() {

        },
    },
    methods:{
        openLargeImage() {
            this.isLargeImageVisible = true;
            this.largeImageSrc = `data:image/jpeg;base64, ${this.product.imageData}`;
        },
        closeLargeImage() {
            this.isLargeImageVisible = false;
        }
    }
};
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
        cursor: pointer;
    }
    .card-img {
        margin: auto;
        max-height: 160px;
    }
    .card-body{
        max-width: 40%;
        padding: 10px;
        margin-left: 50px;
    }
    h5 {
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 15px; 
    }
    p {
        font-size: 20px;
    }
    .item-count-block{
        padding: 10px;
        margin-right: 10px;
    }
    .count{
        display: flex;
        justify-content: end;
        font-size: 20px;
        padding: 5px;
    }
    .item-calculation{
        width: 100px;
        margin-left: 20px;
        font-weight: 500;
        text-align: center;
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
    }
    .large-image img{
        margin: 50px auto auto;
        max-width: 90%;
        max-height: 90%;
    }

</style>
