import ProductsPage from "@/components/ProductsPage";
import ProductIdPage from "@/views/ProductIdPage";
import LargeImag from "@/components/LargeImag";
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
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    props: true, 
    component: ProductIdPage,
  },
  {
    path: '/image/:imageData',
    name: 'image',
    props: true, 
    component: LargeImag,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),

})

export default router;
