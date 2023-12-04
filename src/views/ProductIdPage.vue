<template>
        <div class="card-item" v-if="product" >
            <close-form title="back to product list"
                @click="$router.push('/')" >
            </close-form>

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
                <img class="card-img-top" 
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
                <p class="card-text"> <strong> Product Description: </strong>
                    <br> <span> {{ product.description }} </span>
                </p>
                <p class="card-text"> <strong> Price: </strong> {{ product.price }} $</p>
                <p class="card-text" v-if="productDiscount"> <strong> Discount name: </strong> 
                    {{ productDiscount.name }}
                </p>                
                <p class="card-text" v-if="productDiscount"> <strong> Discount percent: </strong> 
                    {{ productDiscount.discountPercent }}
                </p>
                <!-- <p class="card-text last"> <strong> Quantity in stock: </strong> 
                    {{ product.quantity }}
                </p> -->
                <img class="cart" 
                    title="add to cart"
                    src='/trolley.png' 
                    alt="cart"
                    @click="addToCart"
                />   
            </div>
        </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import MyDialog from '@/components/UI/MyDialog';
// import showMixin from "@/mixins/showMixin";

export default {
    components: {
        // MyDialog
    },
    data() {
        return {
            token: localStorage.getItem('token'),
            product: null,
            isLargeImageVisible: false,
            largeImageSrc: '',
            productCategory: null,
            productDiscount: null,
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

            axios.get(`http://localhost:8081/discount/${discountId}`)
            .then(response => {
                this.productDiscount = response.data;
            })
            .catch(error => {
                console.error('Error fetching discount:', error);
            });

            axios.get(`http://localhost:8081/product-categories/${categoryId}`)
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
    methods:{
        ...mapActions('cart',['addProductToCart']),

        addToCart() {
            if (!this.isAuthorization) {
                alert('To add an item to your cart, you must log in.');
                this.showDialog();
            } else {
                this.createSession();
            }
        },

        async createSession() {
            try {
                const userId = localStorage.getItem('userId');
                const sessionId = localStorage.getItem('sessionId');

                if (!sessionId) {
                    const shoppingSession = await axios.post('http://localhost:8081/create', {
                        userId: userId,
                        createdAt: new Date().toISOString(),
                    });

                if (shoppingSession.status >= 200 && shoppingSession.status < 300) {
                    const session = shoppingSession.data;
                    localStorage.setItem('sessionId', session.id);
                    this.createUserProductCart();                                       
                }
                } else {
                    this.createUserProductCart();
                    console.log(`sessionId: ${sessionId}`);
                    console.log(`userId: ${userId}`);
                }
            } catch (error) {
            console.error('Error creating shopping session:', error);               
            }
        },

        async createUserProductCart() {
            try {
                const sessionId = localStorage.getItem('sessionId');
                const cartItem = {
                    quantity: 1,
                    shoppingSessionId: sessionId,
                    productId: this.product.id
                };

                const response = await axios.post(`http://localhost:8081/cart/${sessionId}/items`, cartItem, { 
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                    }
                });

console.log('Request for cart:', response.config);
console.log('Response for cart:', response.data);

                if (response.status >= 200 && response.status < 300) {
                    console.log('CartItem created succeccfully');
                    alert('Product successfully added to cart');
                    this.$store.dispatch('addProductToCart', cartItem);
                    this.$router.push('/cart');
                    console.log('cartItem:', cartItem);
                }
            } catch (error) {
                console.error('Error creating user product cart:', error);
            }
        },

        openLargeImage() {
            this.isLargeImageVisible = true;
            this.largeImageSrc = `data:image/jpeg;base64, ${this.product.imageData}`;
        },
        closeLargeImage() {
            this.isLargeImageVisible = false;
        }
    },
    computed: {
        isAuthorization() {
            return !!localStorage.getItem('token');
        }
    },
    // mixins: [showMixin]
}
</script>

<style scoped>
    h1{
        margin-top: 40px;
        margin-left: 20px;
    }
     .card-item {
        position: relative;
        width: 85%;
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
        cursor: pointer;
    }
    .card-img-top {
        width: 100%;
        padding: 10px;
        max-height: 550px;
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
        width: 48px;
        height: 48px;
        float: right;
        cursor: pointer;
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
