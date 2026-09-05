import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api, type FiltresListe } from '@/api/endpoints'
import type { Dossier } from '@/types'

export const useDossiersStore = defineStore('dossiers', () => {
  const liste = ref<Dossier[]>([])
  const courant = ref<Dossier | null>(null)
  const chargement = ref(false)
  const erreur = ref<string | null>(null)
  const filtres = ref<FiltresListe>({ recherche: '', statut: '', type: '', etapeCourante: '' })

  const total = computed(() => liste.value.length)
  const enRetard = computed(() => liste.value.filter((d) => d.statut === 'en_retard').length)

  async function charger(): Promise<void> {
    chargement.value = true
    erreur.value = null
    try {
      const reponse = await api.dossiers(filtres.value)
      liste.value = reponse.items
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : 'Chargement impossible'
    } finally {
      chargement.value = false
    }
  }

  async function chargerUn(id: string): Promise<void> {
    chargement.value = true
    erreur.value = null
    courant.value = null
    try {
      courant.value = await api.dossier(id)
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : 'Dossier introuvable'
    } finally {
      chargement.value = false
    }
  }

  function reinitialiserFiltres(): void {
    filtres.value = { recherche: '', statut: '', type: '', etapeCourante: '' }
  }

  return { liste, courant, chargement, erreur, filtres, total, enRetard, charger, chargerUn, reinitialiserFiltres }
})
