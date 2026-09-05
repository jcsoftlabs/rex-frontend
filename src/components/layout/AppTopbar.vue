<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useUiStore } from '@/stores/ui'
import type { Devise } from '@/types'

defineProps<{ titre: string; sousTitre?: string }>()

const ui = useUiStore()
const DEVISES: Devise[] = ['HTG', 'USD']
</script>

<template>
  <header class="topbar">
    <div class="hello">
      <h2>{{ titre }}</h2>
      <p v-if="sousTitre">{{ sousTitre }}</p>
    </div>

    <div class="tools">
      <label class="search">
        <AppIcon name="search" />
        <input placeholder="Rechercher un dossier, un client, une facture..." />
        <kbd>⌘ K</kbd>
      </label>

      <div class="cur" role="group" aria-label="Devise d'affichage">
        <button
          v-for="d in DEVISES" :key="d"
          :class="{ on: ui.devise === d }"
          @click="ui.choisirDevise(d)"
        >{{ d }}</button>
      </div>

      <ThemeToggle />

      <button class="iconbtn" aria-label="Notifications">
        <AppIcon name="bell" />
        <span class="badge">5</span>
      </button>

      <button class="datepill">
        1 – 30 sept. 2026
        <AppIcon name="chevronDown" :size="14" :width="2.2" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar { display: flex; align-items: flex-start; gap: 16px; }
.hello h2 { font-size: 20px; font-weight: 600; letter-spacing: -.3px; }
.hello p { font-size: 12.5px; color: var(--mut); margin-top: 5px; }
.tools { margin-left: auto; display: flex; align-items: center; gap: 10px; }

.search {
  display: flex; align-items: center; gap: 9px;
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 999px; padding: 9px 13px; width: 290px; color: var(--dim);
}
.search input {
  background: none; border: 0; outline: 0; color: var(--txt);
  font: inherit; font-size: 12.5px; flex: 1; min-width: 0;
}
.search input::placeholder { color: var(--dim); }
.search kbd {
  font: inherit; font-size: 10.5px; color: var(--dim);
  border: 1px solid var(--line2); border-radius: 5px; padding: 1px 5px;
}

.cur { display: flex; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.cur button {
  background: none; border: 0; color: var(--dim);
  font-size: 11.5px; font-weight: 600; padding: 9px 12px; cursor: pointer;
}
.cur button.on { background: var(--cur-bg); color: var(--cur-tx); }

.iconbtn {
  position: relative; width: 38px; height: 38px; border-radius: 11px;
  background: var(--panel); border: 1px solid var(--line);
  color: var(--mut); display: grid; place-items: center; cursor: pointer;
}
.badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 16px; height: 16px; border-radius: 9px;
  background: #ef4444; color: #fff; font-size: 9.5px; font-weight: 700;
  display: grid; place-items: center; border: 2px solid var(--bg); padding: 0 3px;
}
.datepill {
  display: flex; align-items: center; gap: 9px;
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 11px; padding: 10px 12px;
  font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap;
}
</style>
