<template>
    <div class="card">
        <div class="card-img-block">
            <img class="card-img-top" 
            :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" 
            @click="viewProduct"
            />                
        </div>
        <div class="card-body">
            <h5 class="card-title"> Name: {{ product.name }} </h5>
            <p class="card-text"> <strong> ID: </strong> {{ product.id }} </p>
            <p class="card-text"> <strong> Description: </strong>
                <span> {{ product.description }} </span> </p>
            <p class="card-text"> <strong> SKU: </strong> {{ product.sku }}</p>        
            <p class="card-text"> <strong> Price: </strong> {{ product.price }}</p>
            <p class="card-text discount"> <strong> Discount: </strong> {{ product.discountPercent }} </p>
            <p class="card-text last"> <strong> quantity: </strong> {{ product.quantity }} </p>
            <p class="card-text discount"> <strong> discountId: </strong> {{ discount.id }}</p>      
        </div>
        <div class="inform-block">
            <p class="card-title"> <strong> Name: {{ product.name }} </strong> </p>
            <p class="card-text"> <strong> ID: </strong> {{ product.id }} </p>
            <p class="card-text"> <strong> created: </strong> {{ product.createdAt }} </p>
            <p class="card-text"> <strong> modified: </strong> {{ product.modifiedAt }} </p>
            <p class="card-text"> <strong> deleted: </strong> {{ product.deletedAt }} </p>
            <p class="card-text"> <strong> photoId: </strong> {{ product.photoId }} </p>
            <!-- <p class="card-text"> <strong> category: </strong> {{ categories.categoryId }} </p> -->

        </div>
        <div class="button-block">
            <my-button class="btn btn-btn"> Update </my-button>
            <my-button class="btn btn-btn"> Delete </my-button>
            <my-button class="btn btn-btn"> Add information </my-button>
        </div>
    </div>         
</template>

<script>

export default {

    props: {
        product: {
            type: Object,
            required: true,
        },
        discount: {
            type: Object,
            required: true,
        },
        categories:{
            type: Object,
            required: true,
        }
    },

    methods: {
        viewProduct() {
            this.$router.push({ name: 'product', params: { id: this.product.id } });
        },
    },
    }
</script>

<style scoped >
    .card {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 2%;
        width: 100%;
        height: 300px;
        margin: 10px auto;
        padding: 10px;
        border: 1px solid rgb(48, 48, 48);
        border-radius: 0;
    }
    h5 {
        font-size: 16px;
        font-weight: 700;
    }
    p {
        font-size: 14px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }
    span {
        font-size: 12px;        
    }
    .card-img-block{
        width: 20%;
        height: 100%;
        padding: 5px;
        cursor: pointer;        
    }
    .card-img-top {
        object-fit: contain;
        max-height: 270px;
        padding: 2px;
    }
    .card-body, .inform-block {
        width: 40%;
        max-height: 270px;
        padding: 16px 5px 10px;
    }
    .inform-block {
        width: 25%;
    }
    .button-block{
        margin: 20px 10px 20px auto;
        width: 12%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
    }
    .btn-btn{
        margin-left: auto;
    }
</style>