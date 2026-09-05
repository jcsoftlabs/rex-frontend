import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/endpoints'
import type { Dashboard } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const donnees = ref<Dashboard | null>(null)
  const chargement = ref(false)
  const erreur = ref<string | null>(null)

  async function charger(force = false): Promise<void> {
    if (donnees.value && !force) return
    chargement.value = true
    erreur.value = null
    try {
      donnees.value = await api.dashboard()
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : 'Chargement impossible'
    } finally {
      chargement.value = false
    }
  }

  return { donnees, chargement, erreur, charger }
})
