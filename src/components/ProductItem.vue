<template>
        <div class="card">
            <div class="card-img-block">
                <img class="card-img-top" :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name" />                
            </div>
            <div class="card-body">
                <h5 class="card-title"> {{ product.name }} </h5>
                <p class="card-text"> <strong> Code:</strong> {{ product.id }}</p>
                <p class="card-text"> <strong>Price:</strong> {{ product.price }}</p>
                <p class="card-text discount"> <strong>Discount:</strong> {{ product.discountPercent }}</p>      
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
        // selectedSort: String,
        // searchQuery: [String, Number]  
    },
    // computed: {
    //     sortedProducts() {
    //         return [...this.products].sort((product1, product2) => {
    //             const value1 = product1[this.selectedSort];
    //             const value2 = product2[this.selectedSort];

    //             if (typeof value1 === 'number' && typeof value2 === 'number') {
    //                 return value1 - value2;
    //             } else if (typeof value1 === 'string' && typeof value2 === 'string') {
    //                 return value1.localeCompare(value2);
    //             }
    //         });
    //     },
    //     sortedAndSearchedProducts() {
    //         const results = this.sortedProducts.filter(product => {
    //             const nameMatches = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    //             const codeMatches = product.id.toString().includes(this.searchQuery.toString());
    //             return nameMatches || codeMatches;
    //         });
    //         this.$emit('search-results', results);

    //         return results;    
    //     },
    // },
}
</script>

<style scoped>
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