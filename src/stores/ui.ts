import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Devise } from '@/types'

/** État d'interface transverse : ne concerne aucune entité métier en particulier. */
export const useUiStore = defineStore('ui', () => {
  /** Devise d'affichage choisie dans la barre du haut. */
  const devise = ref<Devise>('HTG')
  const sidebarRepliee = ref(false)

  function choisirDevise(valeur: Devise): void {
    devise.value = valeur
  }

  return { devise, sidebarRepliee, choisirDevise }
})
