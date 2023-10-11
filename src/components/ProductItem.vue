<template>
        <div class="card">
            <div class="card-img-block">
                <img class="card-img-top" 
                :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" 
                @click="$router.push(`/product/${product.id}`)"
                />                
            </div>
            <div class="card-body">
                <h5 class="card-title"
                    @click="$router.push(`/product/${product.id}`)"
                    >
                    {{ product.name }}
                </h5>
                <p class="card-text"> <strong> Code:</strong> {{ product.id }}</p>
                <p class="card-text"> <strong> Price:</strong> {{ product.price }}</p>
                <p class="card-text discount"> <strong> Discount:</strong> {{ product.discountPercent }}</p>      
            </div>
        </div>          
</template>

<script>
// import ProductIdPage from '@/views/ProductIdPage';

export default {
    // components:{
    //     ProductIdPage,
    // },
    props: {
        product: {
        type: Object,
        required: true,
        },
    },
}
</script>

<style scoped >
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