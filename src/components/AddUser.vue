<template>
  <admin-menu> </admin-menu>

</template>

<script>
  import UsersList from '@/views/UsersList'
import AdminMenu from '@/components/UI/AdminMenu';

export default {
    components: {
        AdminMenu,
        UsersList
    },

    data(){
        return {
        }
    },
}
</script>
