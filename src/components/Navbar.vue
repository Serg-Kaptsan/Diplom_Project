<template>
    <div class="navbar">
      <div class="home" @click="$router.push('/')"> HOME </div>
      <div class="navbar__btns">
        <button 
          @click="$router.push('/composition')" >
          CART
        </button>
        <button 
          @click="$router.push('/about')"> CONTACT US
        </button>
        <button
          @click="showDialog">
          LOG IN
        </button>
        <button
          @click="$router.push('/admin')">
          ADMIN
        </button>
        <button @click="$router.push('/store')">GO OUT</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {

    },
    methods: {
      showDialog() {
        this.$emit('show-dialog');
        }
    },
  }
  </script>
  
  <style scoped>
    .navbar {
      position:fixed;
      height: 50px;
      background-color: lightgray;
      box-shadow: 2px 2px 4px gray;
      display: flex;
      align-items: center;
      padding: 0 15px;
      max-width: 1460px;
    }
    .navbar__btns {
      margin-left: auto;
    }
    .home{
      cursor: pointer;
    }
    button{
      background: transparent;
      border: none;
      margin-left: 20px;      
    }

    @media only screen and (max-width: 576px) {
      .navbar{
        font-size: 14px;    
      }
      button {      
        margin-left: 10px;
      }
    }

  </style>