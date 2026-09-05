<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { useDossiersStore } from '@/stores/dossiers'
import { ETAPE_LABEL, STATUT_LABEL, TYPE_DOSSIER_LABEL } from '@/types'
import { formaterDateCourte, formaterMontant } from '@/composables/useFormat'

const route = useRoute()
const store = useDossiersStore()

onMounted(() => {
  /* Arrivée depuis le graphique de flux : `?etape=inspection` pré-filtre la liste. */
  const etape = route.query.etape
  if (typeof etape === 'string') store.filtres.etapeCourante = etape
  store.charger()
})

/* Le filtrage est fait par l'API (mock aujourd'hui, backend demain) : on
   recharge à chaque changement plutôt que de filtrer côté client. */
watch(() => ({ ...store.filtres }), () => store.charger(), { deep: true })

const ETAPES_COULEUR = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)']
const ORDRE = ['arrivee', 'declaration', 'inspection', 'paiement_droits', 'mainlevee', 'livraison']
</script>

<template>
  <AppTopbar titre="Dossiers de dédouanement" :sous-titre="`${store.total} dossiers · ${store.enRetard} en retard`" />

  <section class="card">
    <div class="card-hd">
      <h3>Tous les dossiers</h3>
      <div class="act">
        <input v-model="store.filtres.recherche" class="mini rech" placeholder="Référence ou client…" />
        <select v-model="store.filtres.statut" class="mini">
          <option value="">Tous les statuts</option>
          <option v-for="(lbl, cle) in STATUT_LABEL" :key="cle" :value="cle">{{ lbl }}</option>
        </select>
        <select v-model="store.filtres.type" class="mini">
          <option value="">Tous les types</option>
          <option v-for="(lbl, cle) in TYPE_DOSSIER_LABEL" :key="cle" :value="cle">{{ lbl }}</option>
        </select>
        <select v-model="store.filtres.etapeCourante" class="mini">
          <option value="">Toutes les étapes</option>
          <option v-for="(lbl, cle) in ETAPE_LABEL" :key="cle" :value="cle">{{ lbl }}</option>
        </select>
        <button class="link" @click="store.reinitialiserFiltres()">Réinitialiser</button>
      </div>
    </div>

    <p v-if="store.chargement" class="etat">Chargement…</p>
    <p v-else-if="store.erreur" class="etat erreur">{{ store.erreur }}</p>
    <p v-else-if="!store.liste.length" class="etat">Aucun dossier ne correspond à ces critères.</p>

    <table v-else class="tbl">
      <thead>
        <tr>
          <th>DOSSIER</th><th>CLIENT</th><th>TYPE</th><th>MARCHANDISE</th><th>ÉTAPE</th>
          <th style="text-align: center">JOURS</th>
          <th style="text-align: right">HONORAIRES</th>
          <th>ARRIVÉE</th><th>STATUT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in store.liste" :key="d.id">
          <td class="strong"><RouterLink :to="`/dossiers/${d.id}`" class="ref">{{ d.reference }}</RouterLink></td>
          <td>{{ d.clientNom }}</td>
          <td>{{ TYPE_DOSSIER_LABEL[d.type] }}</td>
          <td>{{ d.marchandises[0]?.designation }}</td>
          <td>
            <span class="step">
              <i :style="{ background: ETAPES_COULEUR[ORDRE.indexOf(d.etapeCourante)] }" />
              {{ ETAPE_LABEL[d.etapeCourante] }}
            </span>
          </td>
          <td class="center">{{ d.joursDansEtape }}</td>
          <td class="num">{{ formaterMontant(d.honoraires) }}</td>
          <td>{{ formaterDateCourte(d.dateArrivee) }}</td>
          <td><StatusTag :statut="d.statut" /></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.rech { width: 190px; }
select.mini { padding-right: 6px; }
.etat { font-size: 12.5px; color: var(--mut); padding: 34px 0; text-align: center; }
.etat.erreur { color: var(--red); }
.ref { color: inherit; }
.ref:hover { color: var(--acc-tx); }
.step { display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
.step i { width: 7px; height: 7px; border-radius: 50%; flex: none; }
</style>
