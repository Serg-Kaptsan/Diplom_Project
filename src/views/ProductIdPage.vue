<template>
    <h1>Card of product CODE = {{ $route.params.id }} </h1>
        <!-- <div class="card">
            <div class="card-img-block">
                <img class="card-img-top" :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name"/>                
            </div>
            <div class="card-body">
                <h5 class="card-title"> {{ product.name }} </h5>
                <p class="card-text"> <strong> Code:</strong> {{ product.id }}</p>
                <p class="card-text"> <strong>Price:</strong> {{ product.price }}</p>
                <p class="card-text discount"> <strong>Discount:</strong> {{ product.discountPercent }}</p>      
            </div>
        </div>           -->
</template>

<script>
export default {

};
</script>

<style scoped>
    h1{
        margin-top: 50px;
        margin-left: 20px;
    }
     .card {
        width: 200px;
        height: 100%;
        padding: 10px;
        border: 1px solid rgb(233,233,233);
        border-radius: 0;
    }
    .card-img-block{
        height: 250px;
        cursor: pointer;        
    }
    .card-img-top {
        object-fit: contain;
        max-height: 250px;
    }
    .card-body{
        padding: 16px 5px 10px;
    }
    h5 {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;    
    }
    p {
        font-size: 14px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }

</style>
