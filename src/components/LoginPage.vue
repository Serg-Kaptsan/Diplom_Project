<template>
    <div class="login_form" v-if="show">
        <h4>Enter</h4>
        <div class="form-group">
            <label for="input_email">email:</label>
            <input
                type="email" 
                class="form-control" 
                id="input_email" 
                v-model="email" 
                v-focus 
                placeholder="Enter your email address"
            />

            <label for="input_password">password:</label>
            <input
                type="password"
                class="form-control" 
                id="input_password" 
                v-model="password"
                placeholder="Enter password"
                autocomplete="off"
            />
        </div>
        
        <button
            type="submit" 
            class="btn btn-success submit enter_button" 
            @click="login" >
            <strong>Log in</strong>
        </button>
        
        <div class="redirect" @click="isOpenRegistr">
            <strong>Sign up</strong>
        </div>
    </div>
</template>

<script>
import RegistrPage from '@/components/RegistrPage';
import MyDialog from '@/components/UI/MyDialog';
import showMixin from '@/mixins/showMixin';
import { mapMutations } from 'vuex';
import axios from 'axios';

export default{
    components:{
        'registr-page': RegistrPage,
        'my-dialog': MyDialog
    },
    data () {
        return {
            email: '',
            password: '',
        };
    },
    props: {
        show: Boolean,
    },
    methods: {
        ...mapMutations(['setAdminButtonVisible']),

        async login() {
            const formData = new URLSearchParams();
            formData.append('username', this.email);
            formData.append('password', this.password);

            try {
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/login`, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });

                if (response.status !==200) {
                    throw new Error ('Login failed');
                }

                const accessToken = response.data;
    console.log('Access token:', accessToken);
                localStorage.setItem('token', accessToken);

                const userResponse = await axios.get(`${process.env.VUE_APP_API_URL}/users/principal`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (userResponse.status >= 200 && userResponse.status < 300) {
                    const user = userResponse.data;
                    localStorage.setItem('userId', user.id);

                    if (user.roles.includes('ROLE_USER')) {
                        alert('Successful authorization. Welcome to our store.');
                        localStorage.setItem('userRole', 'ROLE_USER');
                        this.setAdminButtonVisible(false);
                        this.$router.push('/');
                        this.$emit('close-dialog');
                    } else if (user.roles.includes('ROLE_ADMIN')) {
                        alert('Successful authorization. Welcome to our store.');
                        localStorage.setItem('userRole', 'ROLE_ADMIN');
                        this.setAdminButtonVisible(true);
                        this.$router.push('/admin');
                        this.$emit('close-dialog');
                    }
                } else {
                    throw new Error('Failed to get user data');
                }
            } catch (error) {
                alert('Login failed. Please check your credentials and try again.');
            }
        },
    },
    emits: ['update:show'],
    mixins: [showMixin],
}
</script>

<style scoped>
    input{
        padding: 3px 12px;
    }
    label {
        font-weight: 500;           
    }
    label[for="input_password"]{
        margin-top: 10px;
    }
    button{
        margin: auto;     
        width: 100%;
        margin-top: 10px;
    }
    .enter_button{
        color: white;
        background-color: #00a046;
        transition: background-color 0.3s;
    }
    .enter_button:hover {
        background-color: #00bc52;        
    }
    .redirect{
        margin-top: 10px;
        color: green;
        text-align: center;
        cursor: pointer;
    }
    .redirect:hover, .redirect:focus{
        color:red;
    }
</style>