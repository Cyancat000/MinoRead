import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue') },
    { path: '/rankings', name: 'rankings', component: () => import('@/pages/RankingsPage.vue') },
    { path: '/bookshelf', name: 'bookshelf', component: () => import('@/pages/BookshelfPage.vue') },
    { path: '/book/:id', name: 'book-detail', component: () => import('@/pages/BookDetailPage.vue') },
    { path: '/toc/:id', name: 'toc', component: () => import('@/pages/TocPage.vue') },
    { path: '/comments/:id', name: 'comments', component: () => import('@/pages/CommentsPage.vue') },
    { path: '/reader/:id/:chapter?', name: 'reader', component: () => import('@/pages/ReaderPage.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/pages/ProfilePage.vue') },
    { path: '/history', name: 'history', component: () => import('@/pages/HistoryPage.vue') },
    { path: '/template', name: 'template', component: () => import('@/pages/TemplatePage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
