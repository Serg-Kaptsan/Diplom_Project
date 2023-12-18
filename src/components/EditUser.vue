<template>
    <!-- <admin-menu> </admin-menu> -->
    <div class="container">
        <div class="header">
            <h2>Edit Users Data</h2>
        </div>    
        <div class="edit-form">
            <div class="form-group">
                <label for="input_name">name:</label>
                <input
                    v-model.trim="user.name"
                    v-focus
                    type="text" class="form-control" 
                    id="input_name" 
                    placeholder="Enter your name"
                    @blur="validateName"
                    required>
                <label for="input_surname">surname:</label>
                <input
                    v-model.trim="user.surname"
                    type="text" 
                    class="form-control" 
                    id="input_surname"
                    placeholder="Enter your surname">
                <label for="input_phone">phone:</label>
                <input
                    v-model.trim="user.phone"
                    type="text" 
                    class="form-control" 
                    id="input_phone"  
                    aria-describedby="phonHelp" 
                    placeholder="Your phone number"
                    @blur="validatePhone"
                    required >
                <div class="form-text" id="phonHelp">
                    phone number in the format +380XXXXXXXXX
                </div>
                <label for="email">email:</label>
                <input
                    v-model.trim="user.email"
                    type="email" 
                    class="form-control" 
                    id="regEmail" 
                    placeholder="Enter your email address"
                    @blur="validateEmail"
                    required>
            </div>
            <div class="button_group">
                <button class="main_button cancel"
                    type="button" 
                    @click="this.$router.go(-1)"
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
                    @click="this.$router.go(-1)">
                    Data edited successfully.
                    <br> Click to escape.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components:{
    },
    
    data() {
        return {
            accessToken: localStorage.getItem('token'),
            user: {
                name: null,
                surname: null,
                phone: null,
                email: null,
            },
            editSuccess: false,
            buttonVisible: true,
            maxLength: 255,
        }
    },
    computed: {
    },
    methods: {

        async fetchData() {
            try {
                const userId = this.$route.params.id;                
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }); 
                this.user = response.data;

                console.log('userId:', userId);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }                                    
        },

        async saveChanges() {
            if (!this.user.name) {
                alert("User name is required.");
                return;
            }
            const userPhone = this.user.phone;
            if (!userPhone) {
                alert("Phone nomber is required.");
                return;
            }
            const userEmail = this.user.email;
            if (!userEmail) {
                alert("Email is required.");
                return;
            }
            try {
                const userId = this.$route.params.id;

                const userData = {
                    id: this.user.id,
                    name: this.user.name,
                    surname: this.user.surname,
                    phone: this.user.phone,
                    email: this.user.email,
                };
                console.log('Sending data:', userData);

                const changeResponse = await axios.put(`${process.env.VUE_APP_API_URL}/users/${userId}`, userData, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (changeResponse.status >= 200 && changeResponse.status < 300) {
                    this.editSuccess = true;
                    this.buttonVisible = false;
                    console.log('Data sent successfully.');
                } else {
                    console.error('Error sending data.');
                }
            } catch (error) {
                console.error('Error sending data to /discount/', error);
            }
        },
        validateName() {
            if (this.user.name.length > 0) {
                const nameRegex = /^(?!script$)(?![^.]*\.\.)[a-zа-яіїІЇєЄґҐ0-9.-]{2,}$/i;
                if (!nameRegex.test(this.user.name)) {
                    alert('The name can only contain numbers, letters of the Latin, Cyrillic or Ukrainian alphabet, and must consist of at least 2 characters.')
                }                    
            }
        },
        validatePhone() {
            if (this.user.phone.length >0) {
                const phoneRegex = /^\+380\d{9}$/;
                if (!phoneRegex.test(this.user.phone)) {
                    alert('Incorrect phone nomber format.')
                }
            }                
        },
        validateEmail() {
            if (this.user.email.length >0) {
                const emailRegex = /^(?!(script|.*[<>]|.*\.\.))[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,}$/i;
                if (!emailRegex.test(this.user.email)) {
                    alert('Incorrect email address format.')
                }   
            }
        },
    },
    mounted() {
        this.fetchData();
    },
}
</script>

<style scoped>
    .container {
        margin-top: 50px;        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        overflow: auto;
    }
    .edit-form {
        width: 100%;
        max-width: 550px;            
        border: 1px solid black;
        padding: 20px;
        margin: auto;
    }
    input{
        padding: 3px 12px;
    }
    label{
        font-weight: 500;
        margin-top: 15px;
        margin-bottom: 3px;             
    }
    .submit{
        color: white;
        background-color: #00a046;
        transition: background-color 0.3s;
        float: right;
        width: 200px;
        margin-top: 15px;
    }
    .submit:hover{
        background-color: #00bc52;        
    }
    .button_group{
       display: flex;
       justify-content: space-around;
       margin-top: 25px;
    }
    .main_button {
        padding: 8px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        margin: auto 15px;
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
    @media only screen and (max-width: 576px) { 
        .main_button {
            padding: 4px 8px;
            font-size: 14px;
            width: auto;
        }
    }

</style>
