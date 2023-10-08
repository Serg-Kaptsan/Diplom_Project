import ProductsPage from "@/components/ProductsPage";
import MyDialog from "@/components/UI/MyDialog";
import ProductIdPage from "@/views/ProductIdPage";
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ProductsPage
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductIdPage
  },

]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),

})

export default router;
