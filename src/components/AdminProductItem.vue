<template>
    <div class="card">

        <div class="large-image"
            v-if="isLargeImageVisible" 
            @click.stop="closeLargeImage">
            <img 
                :src="largeImageSrc" :alt="product.name" 
                @click="closeLargeImage" />
        </div>
        <div class="card-img-block">
            <img class="card-img-top" 
                :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" 
                @click="viewProduct" />                
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
            <div class="special">
                <p class="card-text ">
                    <strong> discount name: </strong> {{ productDiscount.name }}
                </p>                
                <img 
                    @click="$router.push('discount')"
                    title="Open discount card"
                    src="https://cdn-icons-png.flaticon.com/512/483/483356.png"
                    alt="Search">                   
            </div>
            <p class="card-text"> <strong> photoId: </strong> {{ product.photoId }} </p> 
            <p class="empty-line"></p>                                   
            <p class="card-text"> <strong> created: </strong> {{ product.createdAt }} </p>
            <p class="card-text"> <strong> modified: </strong> {{ product.modifiedAt }} </p>
            <!-- <p class="card-text"> <strong> deleted: </strong> {{ product.deletedAt }} </p> -->
            <!-- <p class="card-text"> <strong> discountId: </strong> {{ discount.id }}</p> -->

            <div class="button-block">
                <button class="btn btn-secondary inside-button"
                    @click="viewEdit"
                > 
                    Edit data </button>
                <button class="btn btn-danger inside-button delete--button"
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
        viewEdit() {
            this.$router.push({name: 'edit-product', params: {id: this.product.id} });
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
        max-height: 100%;
        margin: 10px auto;
        padding: 10px;
        border: 1px solid rgb(48, 48, 48);
        border-radius: 0;
    }
    h6, h5{
        margin-bottom: 10px;
        text-align: center;
        font-weight: 700;
    }
    p {
        font-size: 14px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }
    .special{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .special img{
        margin: auto;
        width: 14px;
        height: 14px;
        cursor: pointer;
    }
    .empty-line{
        height: 10px;
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
    .card-body {
        width: 50%;
        padding: 10px;
    }
    .inform-block {
        position: relative;        
        width: 30%;
        padding: 10px;
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
    @media only screen and (max-width: 1200px){
        .inside-button{
            font-size: 14px;
            margin-left: 10px;
        }
    }
    @media only screen and (max-width: 960px){
        h5{
            font-size: 18px;
        }
        h6{
            font-size: 16px;
        }
        .card-body{
            padding: 5px 10px;
        }
        .inform-block{
            padding: 5px 10px;        
        }
        .button-block{    
            bottom: -1px;
        }
        .inside-button{
            font-size: 12px;
            margin-left: 5px;
        }
    }
    @media only screen and (max-width: 768px) {
        .card{
            flex-wrap: wrap;
        }
        .card-img-block{
            width: 30%;
        }
        h5{
            font-size: 16px;
        }
        .card-body{
            width: 70%;
            max-height: 100%;
        }
        .inform-block{
            width: 65%;
        }
        .button-block{
            bottom: 10px;
            right: -225px;
            left: 270px;
        }
    }
    @media only screen and (max-width: 575px){
        .card-img-block{
            width: 100%;
        }
        .inform-block{
            width: 100%;
        }
        .button-block{
            position: static;
            justify-content: space-between;
            margin: auto 30px;
        }
    }
</style>