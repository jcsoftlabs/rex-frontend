<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { useDossiersStore } from '@/stores/dossiers'
import { ETAPE_LABEL, TYPE_DOSSIER_LABEL } from '@/types'
import { formaterDate, formaterMontant, formaterNombre } from '@/composables/useFormat'

const route = useRoute()
const store = useDossiersStore()

const charger = () => store.chargerUn(String(route.params.id))
onMounted(charger)
watch(() => route.params.id, charger)

const d = computed(() => store.courant)
const manquants = computed(() => d.value?.documents.filter((doc) => doc.statut === 'manquant') ?? [])
</script>

<template>
  <AppTopbar
    :titre="d ? `Dossier ${d.reference}` : 'Dossier'"
    :sous-titre="d ? `${d.clientNom} · ${TYPE_DOSSIER_LABEL[d.type]}` : undefined"
  />

  <p v-if="store.chargement" class="etat">Chargement…</p>
  <p v-else-if="store.erreur" class="etat erreur">{{ store.erreur }}</p>

  <template v-else-if="d">
    <div v-if="manquants.length" class="banniere">
      <AppIcon name="alert" :size="15" />
      <span>
        {{ manquants.length }} document{{ manquants.length > 1 ? 's' : '' }} requis manque{{ manquants.length > 1 ? 'nt' : '' }} :
        <b>{{ manquants.map((m) => m.nom).join(', ') }}</b>. La déclaration ne peut pas être déposée.
      </span>
    </div>

    <div class="grille">
      <section class="card">
        <div class="card-hd">
          <h3>Informations</h3>
          <StatusTag :statut="d.statut" style="margin-left: auto" />
        </div>
        <dl class="infos">
          <dt>Client</dt><dd>{{ d.clientNom }}</dd>
          <dt>Type</dt><dd>{{ TYPE_DOSSIER_LABEL[d.type] }}</dd>
          <dt>Valeur CIF</dt><dd>{{ formaterMontant(d.valeurCIF) }}</dd>
          <dt>Droits estimés</dt><dd>{{ formaterMontant(d.droitsEstimes) }}</dd>
          <dt>Honoraires</dt><dd>{{ formaterMontant(d.honoraires) }}</dd>
          <dt>Débours avancés</dt><dd>{{ formaterMontant(d.debours) }}</dd>
          <dt>Arrivée</dt><dd>{{ formaterDate(d.dateArrivee) }}</dd>
          <dt v-if="d.transporteur">Transporteur</dt><dd v-if="d.transporteur">{{ d.transporteur }}</dd>
          <dt v-if="d.numeroBL">Connaissement</dt><dd v-if="d.numeroBL">{{ d.numeroBL }}</dd>
        </dl>
      </section>

      <section class="card">
        <div class="card-hd"><h3>Progression</h3></div>
        <ul class="tl">
          <li v-for="e in d.etapes" :key="e.etape">
            <span class="mk" :class="e.dateFranchie ? 'done' : e.etape === d.etapeCourante ? 'now' : 'todo'">
              {{ e.dateFranchie ? '✓' : e.etape === d.etapeCourante ? '●' : '○' }}
            </span>
            <div>
              <b>{{ ETAPE_LABEL[e.etape] }}</b>
              <small v-if="e.dateFranchie">Franchie le {{ formaterDate(e.dateFranchie) }}</small>
              <small v-else-if="e.etape === d.etapeCourante">En cours depuis {{ d.joursDansEtape }} jours</small>
              <small v-else>En attente</small>
            </div>
          </li>
        </ul>
      </section>

      <section class="card large">
        <div class="card-hd"><h3>Marchandises</h3></div>
        <table class="tbl">
          <thead>
            <tr>
              <th>DÉSIGNATION</th><th>CODE SH</th>
              <th style="text-align: center">QUANTITÉ</th>
              <th style="text-align: right">POIDS</th>
              <th style="text-align: right">VALEUR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, i) in d.marchandises" :key="i">
              <td class="strong">{{ m.designation }}</td>
              <td>{{ m.codeSH ?? '—' }}</td>
              <td class="center">{{ m.quantite }} {{ m.unite }}</td>
              <td class="num">{{ m.poidsKg ? `${formaterNombre(m.poidsKg)} kg` : '—' }}</td>
              <td class="num">{{ formaterMontant(m.valeur) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card large">
        <div class="card-hd"><h3>Documents</h3></div>
        <ul class="docs">
          <li v-for="doc in d.documents" :key="doc.id" :class="doc.statut">
            <AppIcon :name="doc.statut === 'fourni' ? 'check' : 'alert'" :size="15" />
            <b>{{ doc.nom }}</b>
            <span v-if="doc.requis" class="requis">requis</span>
            <span class="etatdoc">
              {{ doc.statut === 'fourni' ? 'Fourni' : doc.statut === 'manquant' ? 'Manquant' : 'À vérifier' }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <RouterLink to="/dossiers" class="retour">← Retour aux dossiers</RouterLink>
  </template>
</template>

<style scoped>
.etat { font-size: 12.5px; color: var(--mut); padding: 34px 0; text-align: center; }
.etat.erreur { color: var(--red); }
.banniere {
  display: flex; align-items: center; gap: 10px;
  background: var(--t-red-bg); color: var(--tag-r-fg);
  border: 1px solid var(--red); border-radius: 11px;
  padding: 11px 14px; font-size: 12px;
}
.grille { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
.grille > * { min-width: 0; }
.large { grid-column: 1 / -1; }

.infos { display: grid; grid-template-columns: auto 1fr; gap: 10px 14px; font-size: 12px; padding: 2px 16px 16px; }
.infos dt { color: var(--dim); }
.infos dd { text-align: right; font-weight: 600; }

.tl { display: flex; flex-direction: column; padding: 2px 16px 16px; }
.tl li { display: flex; gap: 11px; position: relative; padding-bottom: 13px; }
.tl li:last-child { padding-bottom: 0; }
.tl li::before {
  content: ''; position: absolute; left: 8px; top: 17px; bottom: -2px;
  width: 2px; background: var(--tlline);
}
.tl li:last-child::before { display: none; }
.mk {
  width: 18px; height: 18px; border-radius: 50%; flex: none;
  display: grid; place-items: center; font-size: 9px; z-index: 1;
}
.done { background: var(--t-grn-bg); color: var(--t-grn-fg); border: 1px solid var(--tl-done-bd); }
.now { background: var(--t-gold-bg); color: var(--t-gold-fg); border: 1px solid var(--nav-bd); box-shadow: 0 0 0 4px var(--tl-now-halo); }
.todo { background: var(--panel2); color: var(--dim); border: 1px solid var(--line2); }
.tl b { font-size: 12px; font-weight: 600; }
.tl small { display: block; font-size: 10.5px; color: var(--dim); margin-top: 2px; }

.docs { padding: 2px 16px 16px; display: flex; flex-direction: column; gap: 10px; font-size: 12px; }
.docs li { display: flex; align-items: center; gap: 10px; color: var(--green); }
.docs li b { font-weight: 600; color: var(--txt); }
.docs li.manquant { color: var(--red); }
.docs li.a_verifier { color: var(--amber); }
.requis {
  font-size: 9px; font-weight: 700; color: var(--dim);
  border: 1px solid var(--line2); border-radius: 999px; padding: 2px 7px;
}
.etatdoc { margin-left: auto; font-size: 11px; color: inherit; font-weight: 600; }

.retour { font-size: 12px; color: var(--acc-tx); font-weight: 600; }
</style>
