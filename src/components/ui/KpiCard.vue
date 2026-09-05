<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  libelle: string
  valeur: string
  unite?: string
  icone: string
  ton: 'gold' | 'teal' | 'blue' | 'violet' | 'red' | 'green'
  /** Ligne du bas ; `tonPied` la colore quand c'est une variation. */
  pied?: string
  piedFort?: string
  tonPied?: 'up' | 'down' | 'warn'
}>()
</script>

<template>
  <div class="kpi">
    <div class="row">
      <span class="lbl">{{ libelle }}</span>
      <div class="chip" :class="ton"><AppIcon :name="icone" /></div>
    </div>
    <div class="val">{{ valeur }}<small v-if="unite"> {{ unite }}</small></div>
    <div class="foot">
      <span v-if="piedFort" :class="tonPied">{{ piedFort }}</span>
      {{ pied }}
    </div>
  </div>
</template>

<style scoped>
.kpi {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 15px 16px 14px;
}
.row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.lbl { font-size: 11.5px; color: var(--mut); font-weight: 500; line-height: 1.35; }
.val {
  font-size: 24px; font-weight: 700; letter-spacing: -.7px;
  margin: 11px 0 7px; white-space: nowrap;
}
.val small { font-size: 12px; font-weight: 600; color: var(--dim); letter-spacing: 0; }
.foot { font-size: 10.5px; color: var(--dim); }
</style>
