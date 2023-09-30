<template>

<div class="product-details-container" id="productDetailsContainer">
    <h1> PRODUCT DETAILS </h1>
    <div id="productDetails"></div>
    <div class="back-button">
        <button onclick="goBack()">Back</button>
    </div>

    <div class="form-g">
        <button class="quantity-arrow" id="decrement" onclick="decrementQuantity()">-</button>
        <span class="quantity-value" id="quantityValue">1</span>
        <button class="quantity-arrow" id="increment" onclick="incrementQuantity()">+</button>
        <button id="addToCartButton" style="background-color: #4CAF50; color: white;">Add to cart</button>
    </div>
</div>
</template>

<script>
    export default {

    }
</script>

<style scoped>
 .product-details-container {
        display: none;
        max-width: 600px;
        width: 200%;
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        margin-top: 50px;
        position: relative;
    }

    .product-details-container h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    .product-details-container div {
        text-align: left;
    }

    .product-item img {
        max-width: 100%;
        max-height: 300px;
        margin: 0 auto;
        display: block;
        object-fit: contain;
    }

    .back-button {
        position: absolute;
        top: 20px;
        left: 20px;
    }

    .back-button button {
        padding: 5px 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
    }
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        justify-content: center;
        margin-top: 20px;
    }
    @media (max-width: 767px) {
        .product-details-container {
            max-width: 100%;
            padding: 10px;
        }
        .product-details-container h1 {
            font-size: 24px;
        }
    }

</style>