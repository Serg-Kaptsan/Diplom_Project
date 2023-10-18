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
        
        <button type="submit" class="btn btn-success submit enter_button">
            <strong>Log in</strong>
        </button>
        
        <div class="redirect"  @click="openRegistration"> <strong>Sign up</strong> </div>
    </div> 
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
    .enter_button:hover {
        background-color: #00bc52;        
    }
    .redirect{
        margin-top: 10px;
        color: green;
        text-align: center;
    }
    .redirect:hover, .redirect:focus{
        color:red;
    }
</style>