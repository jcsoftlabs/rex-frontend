<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { EN_MODE_DEMO } from '@/api/http'
</script>

<template>
  <div class="page">
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
  </div>
</template>

<style scoped>
/* `flex-start` et non `center` : un contenu plus haut que la fenêtre déborderait
   vers le haut, hors de portée du défilement. */
.page {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100%;
  padding: 34px;
}
.app {
  width: 1480px; max-width: 100%;
  background: var(--bg);
  border: 1px solid var(--appbd);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 246px 1fr;
  box-shadow: 0 40px 90px var(--shadow);
}
.main {
  padding: 22px 22px 24px;
  display: flex; flex-direction: column; gap: 15px;
  min-width: 0;
}
.demo {
  font-size: 11px; color: var(--dim);
  background: var(--panel2); border: 1px dashed var(--line2);
  border-radius: 9px; padding: 7px 11px;
}
.demo code { color: var(--acc-tx); font-size: 10.5px; }
</style>
