<template>
        <div class="card">
            <div class="card-img-block">
                <img class="card-img-top" 
                :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" 
                @click="viewProduct"
                />                
            </div>
            <div class="card-body">
                <h5 class="card-title"
                    @click="viewProduct"
                >
                    {{ product.name }}
                </h5>
                <p class="card-text"> <strong> Code: </strong> {{ product.id }}</p>
                <p class="card-text"> <strong> Price: </strong> {{ product.price }} $</p>
                <p class="card-text discount"> <strong> Discount: </strong> {{ productDiscount.discountPercent}} </p>      
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
        category:{
        type: Object,
        required: true,      
        }
    },
    computed:{
        productDiscount() {
            const matchingDiscount = this.discount.find(discount => discount.id === this.product.discountId);
            return matchingDiscount || { discountPercent: "" };
        },
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
        /* width: 200px;
        height: 100%; */
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