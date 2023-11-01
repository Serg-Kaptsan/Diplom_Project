<template>
    <div class="card">

        <div class="large-image"
                v-if="isLargeImageVisible" 
                @click.stop="closeLargeImage"
            >
                <img 
                    :src="largeImageSrc" :alt="product.name" 
                    @click="closeLargeImage" />
            </div>

        <div class="card-img-block">
            <img class="card-img-top" 
            :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" 
            @click="viewProduct"
            />                
        </div>
        <div class="card-body">
            <h5 class="card-title"> {{ product.name }} </h5>
            <p class="card-text"> <strong> Code: </strong> {{ product.id }} </p>
            <p class="card-text"> <strong> Category: </strong> {{ productCategory.name }} </p>
            <p class="card-text"> <strong> Description: </strong>
                <br> <span> {{ product.description }} </span> </p>
            <p class="card-text"> <strong> SKU: </strong> {{ product.sku }}</p>        
            <p class="card-text"> <strong> Price: </strong> {{ product.price }} $</p>
            <p class="card-text"> <strong> Discount: </strong> {{ productDiscount.discountPercent }} </p>
            <p class="card-text last"> <strong> Quantity: </strong> {{ product.quantity }} </p> 
        </div>
        <div class="inform-block">
            <!-- <p class="card-title"> <strong> Name: {{ product.name }} </strong> </p>
            <p class="card-text"> <strong> ID: </strong> {{ product.id }} </p> -->
            <h6 class="card-title"> Additional information </h6>
            <p class="card-text"> <strong> created: </strong> {{ product.createdAt }} </p>
            <p class="card-text"> <strong> modified: </strong> {{ product.modifiedAt }} </p>
            <p class="card-text"> <strong> deleted: </strong> {{ product.deletedAt }} </p>
            <p class="empty-line"></p>
            <p class="card-text"> <strong> discount name: </strong> {{ productDiscount.name }} 
                <img 
                    title="Open discount card"
                    src="https://cdn-icons-png.flaticon.com/512/483/483356.png"
                    alt="Search">    
            </p>
            <!-- <p class="card-text"> <strong> discountId: </strong> {{ discount.id }}</p> -->
            <p class="card-text"> <strong> photoId: </strong> {{ product.photoId }} </p>
            <div class="button-block">
                <button class="btn btn-secondary"
                    @click="$router.push('/edit-product')"
                > 
                    Сhange data </button>
                <button class="btn btn-danger"
                    @click="$emit('delete', product)"
                >
                    Delete product
                </button>
            </div>
        </div>
    </div>         
</template>

<script>

export default {
    data () {
        return{
            isLargeImageVisible: false,
            largeImageSrc: ''
        }
    },
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
    computed: {
        productDiscount() {
            const matchingDiscount = this.discount.find(discount => discount.id === this.product.discountId);
            return matchingDiscount || { name: "", discountPercent: "" };
        },
        productCategory() {
            const matchingCategory = this.category.find(category => category.id === this.product.categoryId);
            return matchingCategory || { name: "" };
        },
    },
    methods: {
        viewProduct() {
            this.$router.push({ name: 'product', params: { id: this.product.id } });
        },

        openLargeImage() {
            this.isLargeImageVisible = true;
            this.largeImageSrc = `data:image/jpeg;base64, ${this.product.imageData}`;
        },
        closeLargeImage() {
            this.isLargeImageVisible = false;
        }
    },
}
</script>

<style scoped >
    .card {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        height: 305px;
        margin: 10px auto;
        padding: 10px;
        border: 1px solid rgb(48, 48, 48);
        border-radius: 0;
    }
    h6, h5{
        margin-bottom: 5px;
        text-align: center;
        font-weight: 700;
    }
    p {
        font-size: 14px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }
    .empty-line{
        height: 14px;
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
        max-height: 300px;
        padding: 10px;
    }
    .card-text img{
        float: right;
        width: 14px;
        height: 14px;
        cursor: pointer;
        margin-right: 15px;
    }
    .inform-block {
        width: 30%;
        position: relative;
    }
    .button-block{
        position: absolute;
        display: flex;        
        bottom: 10px;
        right: 15px;  
    }
    .button-block *{
        margin-left: 20px;
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