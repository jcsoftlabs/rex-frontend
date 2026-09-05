<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import AppIcon from '@/components/ui/AppIcon.vue'

const { theme, basculerTheme } = useTheme()
const clair = computed(() => theme.value === 'light')
</script>

<template>
  <button
    class="iconbtn"
    :aria-pressed="clair"
    :title="clair ? 'Passer en thème sombre' : 'Passer en thème clair'"
    aria-label="Basculer clair / sombre"
    @click="basculerTheme"
  >
    <AppIcon :name="clair ? 'moon' : 'sun'" :size="17" />
  </button>
</template>

<style scoped>
.iconbtn {
  width: 38px; height: 38px;
  border-radius: 11px;
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--mut);
  display: grid; place-items: center;
  cursor: pointer;
}
.iconbtn:hover { color: var(--txt); border-color: var(--line2); }
</style>
