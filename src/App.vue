<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { EN_MODE_DEMO } from '@/api/http'
</script>

<template>
  <div class="app">
    <AppSidebar />
    <main class="main">
      <!-- Rappel visible tant qu'aucun backend n'est branché. -->
      <div v-if="EN_MODE_DEMO" class="demo">
        Données de démonstration — renseignez <code>VITE_API_BASE_URL</code> pour brancher le backend.
      </div>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Coquille plein écran : la sidebar reste en place, seul le contenu défile.
   `100dvh` plutôt que `100vh` pour tenir compte des barres d'outils mobiles. */
.app {
  height: 100dvh;
  display: grid;
  grid-template-columns: 246px 1fr;
  background: var(--bg);
  overflow: hidden;
}

/* Chaque colonne défile pour son compte. `min-height: 0` est indispensable :
   sans lui, une piste de grille refuse de se contracter sous son contenu et
   le défilement interne ne s'active jamais. */
.app > * { min-height: 0; }

.main {
  padding: 22px 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
  overflow-y: auto;
}

.demo {
  font-size: 11px;
  color: var(--dim);
  background: var(--panel2);
  border: 1px dashed var(--line2);
  border-radius: 9px;
  padding: 7px 11px;
}
.demo code { color: var(--acc-tx); font-size: 10.5px; }
</style>
