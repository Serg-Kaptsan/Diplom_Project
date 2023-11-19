<template>
    <div class="card">

        <div class="card-body">
            <h5 class="card-title">
                <strong> Name: </strong> {{ category.name }} 
            </h5>
            <p class="card-text"> <strong> Id: </strong> {{ category.id }} </p>            
            <p class="card-text"> <strong> Description: </strong> 
                <br> {{ category.description }}</p>        
            <p class="card-text"> <strong> created date: </strong> {{ category.createdAt }} </p>
            <p class="card-text"> <strong> modified date: </strong> {{ category.modifiedAt }} </p>
        </div>
        <div class="button-block">
            <!-- <button class="btn btn-secondary inside-button"
                @click="viewEdit">
                Edit category 
            </button> -->
            <button class="btn btn-danger inside-button delete--button"
                @click="$emit('delete', category)">
                Delete category
            </button>
        </div>
    </div>
</template>

<script>

export default {
    data () {
    },
    props: {
        category: {
            type: Object,
            required: true,
        }
    },

    methods: {
        // viewEdit() {
        //     this.$router.push({name: 'edit-category', params: {id: this.category.id} });
        // },
    },
}
</script>

<style scoped >
    .card {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        min-height: 100%;
        margin: 0;
        padding: 10px;
        border: 1px solid rgb(48, 48, 48);
        border-radius: 0;
    }
    h5{
        margin-bottom: 10px;
        text-align: center;
        font-weight: 700;
    }
    p {
        font-size: 16px;
    }
    p:not(:last-child){
        margin-bottom: 5px;            
    }
    .card-body {
        width: 63%;
        padding: 10px;
    }
    .button-block{
        display: flex; 
        flex-direction: column;
        padding: 10px 0 0;
    }
    .button-block *{
        margin: auto;
        margin-right: 0;
        font-size: 14px;
    }

    @media only screen and (max-width: 960px){
        h5{
            font-size: 18px;
        }
        .card-body{
            padding: 5px 10px;
            width: 62%;
        }
    }
    @media only screen and (max-width: 768px) {
        .button-block{
            margin-right: 15px;
        }
    }
    @media only screen and (max-width: 575px){
        .card-body{
            width: 61%;
        }
        h5
        {
            font-size: 16px;
        }
        p {
            font-size: 14px;
        }
        .inside-button{
            font-size: 12px;
            padding: 4px 8px;
        }
    }
</style>