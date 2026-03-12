import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    {
      path: '/categories',
      name: 'categories',
      meta: { showTabbar: true },
      component: () => import('@/pages/CategoriesPage.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchResultsPage.vue'),
    },
    {
      path: '/rankings',
      name: 'rankings',
      meta: { showTabbar: true },
      component: () => import('@/pages/RankingsPage.vue'),
    },
    {
      path: '/bookshelf',
      name: 'bookshelf',
      meta: { showTabbar: true },
      component: () => import('@/pages/BookshelfPage.vue'),
    },
    { path: '/book/:id', name: 'book-detail', component: () => import('@/pages/BookDetailPage.vue') },
    { path: '/toc/:id', name: 'toc', component: () => import('@/pages/TocPage.vue') },
    { path: '/comments/:id', name: 'comments', component: () => import('@/pages/CommentsPage.vue') },
    { path: '/reader/:id/:chapter?', name: 'reader', component: () => import('@/pages/ReaderPage.vue') },
    {
      path: '/profile',
      name: 'profile',
      meta: { showTabbar: true },
      component: () => import('@/pages/ProfilePage.vue'),
    },
    { path: '/history', name: 'history', component: () => import('@/pages/HistoryPage.vue') },
    { path: '/template', name: 'template', component: () => import('@/pages/TemplatePage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
