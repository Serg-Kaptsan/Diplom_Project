import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
import { Spinner } from 'vue-simple-spinner';
import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store'
import '@/assets/main.css'
import components from '@/components/UI'
import directives from "@/directives";


const app = createApp(App)

components.forEach(component => {
    app.component(component.name, component)
})

directives.forEach(directive => {
    app.directive(directive.name, directive)
})
app.component('Spinner', Spinner);

app
    .use(store)
    .use(router)
    .mount('#app');