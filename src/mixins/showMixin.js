export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideDialog() {
            this.$emit('update:show', false)
        },
        isOpenRegistr() {
            this.$emit('update:show', false)
        },
        showDialog() {
            this.$emit('update:show', tr)
        }
    },
    mounted() {
        // console.log('mixin mounted')
    },
}
