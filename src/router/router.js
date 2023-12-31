import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/ProductsPage')
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
    component: () => import('@/views/ProductIdPage')
  },
    {
      path: '/image/:imageData',
      name: 'image',
      props: true, 
      component: () => import('@/components/LargeImag')
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
    component: () => import('@/views/DiscountsList.vue')
  },
    {
      path: '/edit-discount/:id',
      name: 'edit-discount',
      props: true,
      component: () => import('@/components/EditDiscount.vue')
    },
    // {
    //   path: '/discount/:id',
    //   name: 'discount',
    //   props: true,
    //   component: () => import('@/components/DiscountIdCard.vue')
    // },
        {
      path: '/add-discount/',
      name: 'add-discount',
      props: true,
      component: () => import('@/components/AddDiscount.vue')
    },
    
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/CategoriesList.vue')
  },
    {
      path: '/add-category',
      name: 'add-category',
      props: true,
      component: () => import('@/components/AddCategory.vue')
    },

  {
    path: '/users',
    name: 'users',
    component: () => import ('@/views/UsersList.vue')
  },
    {
      path: '/edit-user/:id',
      name: 'edit-user',
      props: true,
      component: () => import ('@/components/EditUser.vue')
    },
    {
      path: '/add-user',
      name: 'add-user',
      component: () => import ('@/components/AddUser.vue')
    },

  {
    path: '/cart',
    name: 'cart',
    props: true,
    component: () => import('@/views/UsersProductCart.vue')
  },
    // {
    //   path: '/order/:id',
    //   name: 'order',
    //   props: true,
    //   component: () => import('@/components/OrderIdCard.vue')
    // },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),

})

export default router;
