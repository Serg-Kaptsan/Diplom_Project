<template>
    <div class="window-text">
        <div v-if="stateTotalNumber !== undefined">
            You have selected <strong> {{ stateTotalNumber }} </strong> items.
        </div>
        <div v-if="selectedNumber !== undefined">
            You have selected <strong> {{ selectedNumber }} </strong> items.
        </div>           
        <div v-if="stateTotalAmount !== undefined">
            To pay <strong>{{ stateTotalAmount.toFixed(2) }}</strong> $
        </div>
        <div v-if="itemAmount !== undefined">
            To pay <strong>{{ itemAmount.toFixed(2) }}</strong> $
        </div>
    </div>

    <div class="button-block">
        <button class="btn btn-primary to-pay"
            @click="toPayTotal">
                To pay
        </button>
        <button class="btn btn-danger cancel"
            @click="$emit('closeWindow')">
                Cancel
        </button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
    export default {
        components: {
        },
        props: {
            stateTotalNumber: Number,
            stateTotalAmount: Number,
            selectedNumber: Number,
            itemAmount: Number,
        },

        mounted() {
        },
        methods: {
            ...mapActions('cart', ['deleteProductsFromServer']),

            async toPayTotal() {
                try {
                    await this.$store.dispatch('deleteProductsFromServer');
                    this.$emit('notificFromWindow');
                    this.$emit('closeWindow');                    
                } catch (error) {
        console.error('Error during deleteProductsFromServer:', error);
                }
            },
        }
    }
</script>

<style scoped>
    .window-text{
        text-align: center;
        margin: 18px auto;
        font-size: 20px;
        line-height: 32px;

    }
    .button-block{
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
    }
    button {
        padding: 4px 12px;
    }
</style>