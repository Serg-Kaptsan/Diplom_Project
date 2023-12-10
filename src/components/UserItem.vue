<template>
    <div class="card">

        <div class="card-body">
            <h6 class="card-title">
                <strong> Id: </strong> {{ user.id }} 
            </h6>
            <p class="card-text"> <strong> Name: </strong> {{ user.name }} </p>            
            <p class="card-text"> <strong> Surname: </strong> {{ user.surname }}</p>        
            <p class="card-text"> <strong> Phone number: </strong> {{ user.phone }} </p>
            <p class="card-text"> <strong> Email: </strong> {{ user.email }} </p>
        </div>
        <div class="button-block">
            <!-- <button class="btn btn-secondary inside-button"
                @click="viewOrders"> 
                To orders
            </button> -->
            <button class="btn btn-secondary inside-button"
                @click="viewEdit"> 
                Edit data 
            </button>
            <button class="btn btn-danger inside-button delete--button"
                @click="$emit('delete', user)">
                Delete user
            </button>
        </div>
    </div>
</template>

<script>

export default {

    data () {
    },

    props: {
        user: {
            type: Object,
            required: true,
        }
    },

    methods: {
        // viewOrders() {
        //     this.$router.push({name: 'cart', params: {id: this.order.id} });
        // },
        viewEdit() {
            this.$router.push({name: 'edit-user', params: {id: this.user.id} });
        },
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
    h6{
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
    /* span {
        font-size: 12px;        
    } */
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
        h6{
            font-size: 16px;
        }
        .card-body{
            padding: 5px 10px;
        }
    }
    @media only screen and (max-width: 676px) {
        .button-block{
            margin-right: 15px;
        }
    }
    @media only screen and (max-width: 575px){
        h6{
            font-size: 14px;
        }
        p {
            font-size: 14px;
        }
        .inside-button{
            font-size: 13px;
            padding: 4px 10px;
        }
    }
</style>