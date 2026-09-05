<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
</script>

<template>
  <AppTopbar titre="Page introuvable" />
  <div class="vide">
    <h3>404</h3>
    <p>Cette page n'existe pas.</p>
    <RouterLink to="/tableau-de-bord" class="lien">← Retour au tableau de bord</RouterLink>
  </div>
</template>

<style scoped>
.vide {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 90px 24px; text-align: center;
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
}
h3 { font-size: 34px; font-weight: 800; letter-spacing: -1px; }
p { font-size: 12.5px; color: var(--mut); }
.lien { font-size: 12px; color: var(--acc-tx); font-weight: 600; }
</style>
