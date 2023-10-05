<template>
    <div class="registr-form">

            <h4>Sign up</h4>

        <div class="form-group">
            <label for="input_name">name:</label>
            <input
                v-model="name"
                type="text" class="form-control" id="input_name" placeholder="Enter your name"
                required>
            <label for="input_surname">surname:</label>
            <input
                v-model="surname"
                type="text" class="form-control" id="input_surname" placeholder="Enter your surname">
            <label for="input_phone">phone:</label>
            <input
                v-model="phone"
                type="text" class="form-control" id="input_phone"  aria-describedby="phonHelp" placeholder="Your phone number"
                required >
            <div class="form-text" id="phonHelp"> phone number in the format +380XXXXXXXXX
            </div>
            <label for="email">email:</label>
            <input
                v-model="email"
                type="email" class="form-control" id="regEmail" placeholder="Enter your email address" required>
            <label for="password">password:</label>
            <input
                v-model="password"
                type="password" class="form-control" id="regPassword" placeholder="Create a password"
                required>
        </div>
            <button
                @click="register"
                type="submit" class="btn btn-success submit">
                Register</button>

            <div class="registration-success" id="registrationSuccess"
                v-if="registrationSuccess">
                You have successfully registered. Please log in to your account.
            </div>
    </div>
</template>

<script>
    import showMixin from "@/mixins/showMixin";
    import LoginPage from "@/components/LoginPage";
    import axios from 'axios';

    export default{
        name: 'registr-page',
        LoginPage,
        mixins: [showMixin], 
        data() {
            return {
                name: '',
                surname: '',
                phone: '',
                email: '',
                password: '',
                registrationSuccess: false,
            };
        },
        methods: {
            register() {
                const user = {
                    name: this.name,
                    surname: this.surname,
                    phone: this.phone,
                    email: this.email,
                    password: this.password,
                };
                axios
                    .post('http://localhost:8081/users', user)
                    .then((response) => {
            console.log('Registration successful:', response.data);
                    this.registrationSuccess = true;
                    this.clearForm();
                    })
                    .catch((error) => {
            console.error('Registration error:', error);
                    });
            },
            clearForm() {
                this.name = '';
                this.surname = '';
                this.phone = '';
                this.email = '';
                this.password = '';
            },
        },    
    }
</script>

<style scoped>
    input{
        padding: 3px 12px;
    }
    label{
        font-weight: 500;
    }
    label + label{
        margin-top: 10px;        
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
    .registration-success {
        display: none;
        text-align: center;
        font-weight: bold;
        color: #4CAF50;
        padding: 10px;
        border: 1px solid #4CAF50;
        background-color: #f0f8f0;
        margin-top: 10px;
    }
    /* 
    button{
        margin: auto;     
        width: 100%;
        margin-top: 10px;
    }
    .enter_button:hover{
        background-color: #00bc52;        
    }
    .reg_button{
        color: green;
        background: transparent;
        border: none;
        transition: color 0.3s;
    }
    .reg_button:hover{
        color:red;
    } */
    @media only screen and (max-width: 768px) {
            .login-form,
            .registration-form {
                max-width: 100%;
            }

            .header h1 {
                font-size: 24px;
            }
        }

        @media only screen and (max-width: 600px) {
            .form-group input {
                font-size: 14px;
            }

            .back-to-product button,
            .form-group button {
                font-size: 14px;
            }

            .login-form,
            .registration-form {
                max-width: 250px;
            }

            .header h1 {
                font-size: 20px;
            }
        }
</style>