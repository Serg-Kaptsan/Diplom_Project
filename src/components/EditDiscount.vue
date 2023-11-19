<template>
    <admin-menu> </admin-menu>
    <div class="container">
        <div class="header">
            <h2>Edit Discount</h2>
        </div>
        <form class="edit-form" id="edition">
            
            <div class="information">
                <div class="information-input">
                    <label for="name" class="form-label">Name:</label>
                    <input class="form-group discount_name"
                        type="text"
                        id="name"
                        v-focus
                        v-model="discount.name"    
                        placeholder="Enter Discount Name" >                    
                </div>
                <div class="description">
                    <label for="description" class="form-label label_description">Description:</label>
                    <textarea class="form-group description" wrap="hard"
                        v-model="discount.description"
                        placeholder="Enter Discount Description"
                        autocomplete="on">
                        @input="checkDescriptionLength">
                    </textarea>
                        <p class="form-text" id="remain">
                            Remaining characters: {{ remainingCharacters }}
                        </p>
                </div>

                <div class="information-input">
                    <label for="percent" class="form-label"> Discount percent: </label>                    
                    <input class="form-group percent"
                        type="text"
                        id="percent"
                        v-model="discount.discountPercent"> 
                </div>
            </div>

            <div class="button_group">
                <button class="main_button cancel"
                    type="button" 
                    @click="viewDiscount"
                    v-if="buttonVisible">
                    Cancel changes
                </button>
                <button class="main_button submit"
                    type="button" 
                    @click="saveChanges"
                    v-if="buttonVisible">
                    Save changes
                </button>
                <div class="create_Success"
                    id="editSuccess"
                    v-if="editSuccess"
                    @click="viewDiscount">
                    Data edited successfully.
                    <br>Click for back to discount.
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import AdminMenu from '@/components/UI/AdminMenu';

export default {
    components:{
        AdminMenu,
    },
    
    data() {
        return {
            accessToken: localStorage.getItem('token'),
            discount: {
                name: '',
                description: '',
                discountPercent: '',
            },
            editSuccess: false,
            buttonVisible: true,
            maxLength: 255,
        }
    },
    computed: {
        remainingCharacters() {
            if (this.discount.description){
              return this.maxLength - this.discount.description.length;  
            } else{
                return this.maxLength;
            }
        }
    },
    methods: {
        checkDescriptionLength() {
          if (this.discount.description.length > this.maxLength) {
            this.discount.description = this.discount.description.slice(0, this.maxLength);
          }
        },        
        viewDiscount() {
            this.$router.push({ name: 'discounts' });
        },

        async fetchData() {
            try {
                const discountId = this.$route.params.id;                
                const response = await axios.get(`http://localhost:8081/discount/${discountId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }); 
                this.discount = response.data;

                console.log('discountId:', discountId);
            } catch (error) {
                console.error('Error fetching discount data:', error);
            }                                    
        },

        async saveChanges() {
            if (!this.discount.name) {
                alert("Discount name is required.");
                return;
            }
            const discountPercent = this.discount.discountPercent;
            if (!discountPercent) {
                alert("Discount Percent is required.");
                return;
            }
            
            try {
                const discountId = this.$route.params.id;

                const discountData = {
                    id: this.discount.id,
                    name: this.discount.name,
                    description: this.discount.description,
                    discountPercent: discountPercent,
                    modifiedAt: new Date().toISOString(),
                    deletedAt: null,
                };
                console.log('Sending data:', discountData);

                const changeResponse = await axios.put(`http://localhost:8081/discount/${discountId}`, discountData, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (changeResponse.status === 200) {
                    this.editSuccess = true;
                    this.buttonVisible = false;
                    console.log('Data sent successfully.');
                } else {
                    console.error('Error sending data.');
                }
            } catch (error) {
                console.error('Error sending data to /discount/', error);
            }
        }
    },
    mounted() {
        this.fetchData();
    },
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        overflow: auto;
    }
    .header {
        width: 100%;
        margin-bottom: 10px;
        margin-top: 0;
        text-align: center;
    }
    .edit-form {
        width: 100%;
        max-width: 550px;            
        border: 1px solid black;
        padding: 20px;
    }
    .section {
        display: flex;
        text-align: start;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom:1rem !important;
    }
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .information {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: auto;
    }
    .information *{
        text-align: center;
        padding: 5px;
        width: 100%;
    }
    .description {
        text-align: left;
        white-space: pre-line;
        padding: 5px;
    }    
    .label_description{
        text-align: left;
        margin-bottom: 0;
    }
    textarea {
        margin-top: 0; 
    }
    textarea:hover {
        background-color: transparent;
    }
    #remain {
        text-align: left;
        margin: -5px auto 5px 5px;
    }
    .information-input{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .information-input label{
        text-align: left;
        max-width: 150px;
    }
    .main_button {
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 13px;
        margin: auto 15px;
    }
    .button_group{
       display: flex;
       justify-content: space-between;
       margin-top: 10px;
    }
    .button_group button{
        margin: auto 0;
    }
    .cancel {
        background-color: red;
    }
    .create_Success {
        width:100%;
        text-align: center;
        font-weight: bold;
        color: #4CAF50;
        padding: 10px;
        border: 1px solid #4CAF50;
        background-color: #f0f8f0;
        margin-top: 10px;
        cursor: pointer;
    }

    @media only screen and (max-width: 768px) {
        .header h2 {
            font-size: 24px;
        }
    }

    @media only screen and (max-width: 576px) {
        .header h2 {
            font-size: 20px;
        }
        .button_group button{
            font-size: 14px
        }
    }
</style>