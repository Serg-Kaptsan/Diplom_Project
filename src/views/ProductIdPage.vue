<template>
    <!-- <h2>Card of product CODE = {{ $route.params.id }} </h2> -->
        <div class="card-item" v-if="product">
            <div class="card-img-block">
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
                <p class="card-text"> <strong> Quantity in stock:</strong> {{ product.quantity }} </p>    
            </div>
        </div> 
</template>

<script>
import axios from 'axios';

export default {
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
        width: 1200px;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: auto;
        margin-top: 50px;
        padding: 25px;
        border: 1px solid rgb(120, 116, 116);
        border-radius: 5px;
        background-color: white;
    }
    .card-img-block{
        width: 600px;
        height: 100%;
        margin-right: 25px;
        cursor: pointer;
    }
    .card-img-top {
        object-fit: contain;
        width: 100%;
        vertical-align: middle;
    }
    .card-body{
        padding: 30px;
    }
    h5 {
        text-align: center;
        font-size: 24px;
        font-weight: 700;  
    }
    p {
        font-size: 20px;
    }
    span {
        font-size: 16px;
    }
</style>
