import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * Les vues sont chargées à la demande : seul le tableau de bord entre dans le
 * bundle initial, le reste arrive au moment où l'utilisateur y navigue.
 */
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tableau-de-bord' },
  {
    path: '/tableau-de-bord',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { titre: 'Tableau de bord' },
  },
  {
    path: '/dossiers',
    name: 'dossiers',
    component: () => import('@/views/DossiersView.vue'),
    meta: { titre: 'Dossiers de dédouanement' },
  },
  {
    path: '/dossiers/:id',
    name: 'dossier-detail',
    component: () => import('@/views/DossierDetailView.vue'),
    meta: { titre: 'Dossier' },
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('@/views/ClientsView.vue'),
    meta: { titre: 'Clients' },
  },
  {
    path: '/factures',
    name: 'factures',
    component: () => import('@/views/FacturesView.vue'),
    meta: { titre: 'Factures' },
  },
  {
    path: '/devis',
    name: 'devis',
    component: () => import('@/views/DevisView.vue'),
    meta: { titre: 'Devis' },
  },
  /* Écrans prévus au cahier des charges, pas encore développés. */
  {
    path: '/:section(marchandises|documents|prospects|portail|paiements|debours|rapports|notifications|journal)',
    name: 'a-venir',
    component: () => import('@/views/AVenirView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'introuvable',
    component: () => import('@/views/IntrouvableView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const titre = (to.meta.titre as string | undefined) ?? 'Rex'
  document.title = `${titre} — Rex`
})
