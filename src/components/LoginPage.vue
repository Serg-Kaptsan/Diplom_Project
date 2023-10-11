<template>
    <div class="login_form" v-if="show">
        <h4>Enter</h4>
        <div class="form-group">
            <label for="input_email">email:</label>
            <input type="email" class="form-control" id="input_email"
                v-focus
                placeholder="Enter your email address">
            <label for="input_password">password:</label>
            <input type="password" class="form-control" id="input_password" placeholder="Enter password">
        </div>
        <button class="btn enter_button"> <strong>Log in</strong> </button>
        
        <button class="reg_button"  @click="openRegistration"> <strong>Sign up</strong> </button>
    </div>
    <!-- <div>

    <registr-page v-if="registrVisible" @close="registrVisible = false"></registr-page>

    </div> -->
 
</template>

<script>
import RegistrPage from '@/components/RegistrPage';
import MyDialog from '@/components/UI/MyDialog';
import showMixin from '@/mixins/showMixin';

export default{
    components:{
        'registr-page': RegistrPage,
        'my-dialog': MyDialog
    },
    props: {

    },
    methods: {
        openRegistration() {
            this.isOpenRegistr();
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
    }
</style>