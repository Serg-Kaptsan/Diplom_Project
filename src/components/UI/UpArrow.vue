<template>
    <div class="arrow"
        v-if="showArrow"     
        @click="scrollTop"
    >
        <img src="/up-arrow.png" alt="arrow">
    </div>
</template>

<script>
export default{
    name: "up-arrow",
    data() {
        return {
            showArrow: false,
        }
    },

    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        scrollTop() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        handleScroll() {
            this.showArrow = window.scrollY > 200;
        }
    }
}

</script>

<style scoped>
    .arrow{
        position: fixed;
        bottom: 25px;
        right: 36px;
        cursor: pointer;
        z-index: 2;
    }
    .arrow img{
        width: 36px;
        height: 36px;
        opacity: 0.5;
    }
</style>