<template>
    <!-- <h2>Card of product CODE = {{ $route.params.id }} </h2> -->
        <div class="card-item" v-if="product">
            <close-form title="back to product list"
                @click="$router.push('/')">
            </close-form>
            <div class="card-img-block"
            v-focus>
                <img class="card-img-top" 
                :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name"/>                
            </div>
            <div class="card-body">
                <h5 class="card-title"> {{ product.name }} </h5>
                <p class="card-text"> <strong> Code:</strong> {{ product.id }}</p>
                <p class="card-text"> <strong> Product Description:</strong>
                    <br> <span> {{ product.description }} </span>
                </p>
                <p class="card-text"> <strong> Price:</strong> {{ product.price }} </p>
                <p class="card-text discount"> <strong> Discount:</strong> {{ product.discountPercent }} </p>
                <p class="card-text last"> <strong> Quantity in stock:</strong> {{ product.quantity }} </p>
                <img class="cart" title="add to cart" src='/trolley.png' alt="cart">   
            </div>
        </div> 
</template>

<script>
import axios from 'axios';
import CloseForm from "@/components/UI/CloseForm"

export default {
    components: {
      CloseForm  
    },

    data() {
        return {
            product: null,
        };
    },
    created() {
        const productId = this.$route.params.id;
        axios.get(`http://localhost:8081/product/${productId}`)
            .then(response => {
                this.product = response.data;
            })
            .catch(error => {
            console.error('Error fetching product:', error);
        });
    },
};
</script>

<style scoped>
    h1{
        margin-top: 40px;
        margin-left: 20px;
    }
     .card-item {
        position: relative;
        width: 85%;
        /* height: 100%; */
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        margin: auto;
        margin-top: 50px;
        padding: 25px;
        border: 1px solid rgb(120, 116, 116);
        border-radius: 10px;
        background-color: white;
    }
    .card-img-block{
        width: 40%;
        height: 100%;
        /* margin-right: 25px; */
        cursor: pointer;
    }
    .card-img-top {
        width: 100%;
        padding: 10px;
        object-fit: contain;        
        vertical-align: middle;
    }
    .card-body{
        width: 40%;
        padding: 10px;
        padding-left: 50px;
    }
    h5 {
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 25px; 
    }
    p {
        font-size: 20px;
    }
    .last {
        margin-bottom: 5px;            
    }
    span {
        font-size: 16px;
    }
    .cart{
        width: 36px;
        height: 36px;
        float: right;
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
   
</style>
