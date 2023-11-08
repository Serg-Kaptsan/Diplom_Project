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
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    props: true,    
    component: () => import('@/views/AdminPage.vue'),
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
    {
    path: '/add-product',
    name: 'add-product',
    component: () => import('@/components/AddProduct.vue')
  },
  {
    path: '/edit-product/:id',
    name: 'edit-product',
    props: true,    
    component: () => import('@/components/EditProduct.vue'),
  },
  {
    path: '/discounts',
    name: 'discounts',
    props: true,
    component: () => import('@/components/DiscountsList.vue')
  },
  {
    path: '/discount/:id',
    name: 'discount',
    props: true,
    component: () => import('@/components/DiscountIdCard.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/components/CategoriesList.vue')
  },
  {
    path: '/category/:id',
    name: 'category',
    props: true,
    component: () => import('@/components/CategoryIdCard.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import ('@/components/UsersList.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    props: true,
    component: () => import ('@/components/UserIdCard.vue')
  }, 
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/components/OrdersList.vue')
  },
  {
    path: '/order/:id',
    name: 'order',
    props: true,
    component: () => import('@/components/OrderIdCard.vue')
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),

})

export default router;
