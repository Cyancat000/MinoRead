import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'bookshelf',
      meta: { showSidebar: true },
      component: () => import('@/pages/BookshelfPage.vue'),
    },
    { path: '/bookshelf', redirect: '/' },
    {
      path: '/categories',
      name: 'categories',
      meta: { showSidebar: true },
      component: () => import('@/pages/CategoriesPage.vue'),
    },
    {
      path: '/categories/:id',
      name: 'category-list',
      meta: { showSidebar: true },
      component: () => import('@/pages/CategoryListPage.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchResultsPage.vue'),
    },
    {
      path: '/rankings',
      name: 'rankings',
      meta: { showSidebar: true },
      component: () => import('@/pages/RankingsPage.vue'),
    },
    { path: '/book/:id', name: 'book-detail', component: () => import('@/pages/BookDetailPage.vue') },
    {
      path: '/author/:id',
      name: 'author-books',
      component: () => import('@/pages/CollectionListPage.vue'),
      meta: { kind: 'author' },
    },
    {
      path: '/series/:id',
      name: 'series-books',
      component: () => import('@/pages/CollectionListPage.vue'),
      meta: { kind: 'series' },
    },
    {
      path: '/toc/:id',
      name: 'toc',
      redirect: (to) => ({ path: `/book/${String(to.params.id ?? '')}`, query: { tab: 'toc' } }),
    },
    {
      path: '/comments/:id',
      name: 'comments',
      redirect: (to) => ({ path: `/book/${String(to.params.id ?? '')}`, query: { tab: 'comments' } }),
    },
    { path: '/reader/:id/:chapter?', name: 'reader', component: () => import('@/pages/ReaderPage.vue') },
    { path: '/404', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
    {
      path: '/profile',
      name: 'profile',
      meta: { showSidebar: true },
      component: () => import('@/pages/ProfilePage.vue'),
    },
    { path: '/history', name: 'history', component: () => import('@/pages/HistoryPage.vue') },
    { path: '/template', name: 'template', component: () => import('@/pages/TemplatePage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/404' },
  ],
})

export default router
