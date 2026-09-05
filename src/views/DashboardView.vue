<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import KpiCard from '@/components/ui/KpiCard.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import FlowRibbon from '@/components/charts/FlowRibbon.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formaterDateCourte, formaterMontant, formaterNombre, formaterVariation } from '@/composables/useFormat'
import { ETAPE_LABEL, TYPE_DOSSIER_LABEL, utilisateurPrenom } from './dashboard.helpers'
import { utilisateurCourant } from '@/api/mock/donnees'

const store = useDashboardStore()
onMounted(() => store.charger())

const d = computed(() => store.donnees)

const TEINTES_TYPE: Record<string, string> = {
  importation: 'var(--s1)',
  exportation: 'var(--s6)',
  transit: 'var(--blue)',
  franchise: 'var(--violet)',
}
const TEINTES_ETAPE = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)']
const ORDRE_ETAPES = ['arrivee', 'declaration', 'inspection', 'paiement_droits', 'mainlevee', 'livraison']
const couleurEtape = (etape: string) => TEINTES_ETAPE[ORDRE_ETAPES.indexOf(etape)] ?? 'var(--mut)'

const TON_ALERTE: Record<string, string> = {
  critique: '#dc2626', attention: '#b8860f', info: '#1d4ed8', succes: '#16a34a',
}
const ICONE_ALERTE: Record<string, string> = {
  critique: 'alert', attention: 'invoice', info: 'coins', succes: 'quote',
}

/** Le graphique de CA empile honoraires et débours : l'échelle suit leur somme. */
const maxCA = computed(() => {
  if (!d.value) return 20000
  const plafond = Math.max(...d.value.chiffreAffaires.map((p) => p.honoraires + p.debours))
  return Math.ceil(plafond / 5000) * 5000
})

const seriesCA = computed(() => {
  if (!d.value) return []
  return [
    { valeurs: d.value.chiffreAffaires.map((p) => p.honoraires), couleur: 'var(--s1)', opacite: 0.45 },
    { valeurs: d.value.chiffreAffaires.map((p) => p.debours), couleur: 'var(--s6)', opacite: 0.3 },
  ]
})

const totalCreances = computed(() =>
  d.value
    ? d.value.creances.reduce((somme, t) => somme + t.montant.valeur, 0)
    : 0,
)

const COULEURS_CREANCE = [
  'linear-gradient(90deg,#1d6b4c,#34d399)',
  'linear-gradient(90deg,#b8860f,#fbbf24)',
  'linear-gradient(90deg,#9a4a12,#fb923c)',
  'linear-gradient(90deg,#7f1d1d,#f87171)',
]

const dossier = computed(() => d.value?.dossierEnAvant ?? null)
</script>

<template>
  <AppTopbar
    :titre="`Bonjour, ${utilisateurPrenom(utilisateurCourant.nom)} 👋`"
    sous-titre="Voici l'état des dossiers et de la trésorerie aujourd'hui."
  />

  <p v-if="store.chargement && !d" class="etat">Chargement du tableau de bord…</p>
  <p v-else-if="store.erreur" class="etat erreur">{{ store.erreur }}</p>

  <template v-else-if="d">
    <!-- Les cinq indicateurs du cahier des charges -->
    <section class="kpis">
      <KpiCard
        libelle="Dossiers en cours" icone="folder" ton="gold"
        :valeur="String(d.stats.dossiersEnCours)"
        :pied-fort="formaterVariation(d.stats.dossiersEnCoursVariation)"
        :ton-pied="d.stats.dossiersEnCoursVariation >= 0 ? 'up' : 'down'"
        pied="vs août"
      />
      <KpiCard
        libelle="Argent avancé non remboursé" icone="coins" ton="teal"
        :valeur="formaterNombre(d.stats.deboursNonRembourses.valeur)"
        :unite="d.stats.deboursNonRembourses.devise"
        :pied="`sur ${d.stats.deboursDossiersConcernes} dossiers`"
      />
      <KpiCard
        libelle="Factures impayées" icone="invoice" ton="red"
        :valeur="String(d.stats.facturesImpayees)"
        :pied-fort="formaterMontant(d.stats.montantImpaye)" ton-pied="warn"
        pied="en attente"
      />
      <KpiCard
        libelle="Délai moyen par dossier" icone="clock" ton="blue"
        :valeur="formaterNombre(d.stats.delaiMoyenJours, 1)" unite="jours"
        :pied-fort="formaterVariation(d.stats.delaiMoyenVariation, ' j')"
        :ton-pied="d.stats.delaiMoyenVariation <= 0 ? 'up' : 'down'"
        pied="vs août"
      />
      <KpiCard
        libelle="Chiffre d'affaires" icone="chart" ton="green"
        :valeur="formaterNombre(d.stats.chiffreAffaires.valeur)"
        :unite="d.stats.chiffreAffaires.devise"
        :pied-fort="formaterVariation(d.stats.chiffreAffairesVariation)"
        :ton-pied="d.stats.chiffreAffairesVariation >= 0 ? 'up' : 'down'"
        pied="vs août"
      />
    </section>

    <div class="cols">
      <div class="left">
        <!-- Parcours de dédouanement -->
        <section class="card">
          <div class="card-hd">
            <div>
              <h3>Flux des dossiers</h3>
              <div class="sub">Parcours de dédouanement — septembre 2026</div>
            </div>
            <div class="act">
              <button class="mini">Ce mois ▾</button>
              <button class="sq"><AppIcon name="expand" :size="14" /></button>
            </div>
          </div>

          <div class="funnel">
            <FlowRibbon :flux="d.flux" etape-mise-en-avant="inspection" />
          </div>

          <table class="tbl">
            <thead>
              <tr>
                <th>DOSSIER</th><th>CLIENT</th><th>MARCHANDISE</th><th>ÉTAPE</th>
                <th style="text-align: center">JOURS</th>
                <th style="text-align: right">HONORAIRES</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dos in d.dossiersActifs" :key="dos.id">
                <td class="strong">
                  <RouterLink :to="`/dossiers/${dos.id}`" class="ref">{{ dos.reference }}</RouterLink>
                </td>
                <td>{{ dos.clientNom }}</td>
                <td>{{ dos.marchandises[0]?.designation }}</td>
                <td>
                  <span class="step">
                    <i :style="{ background: couleurEtape(dos.etapeCourante) }" />
                    {{ ETAPE_LABEL[dos.etapeCourante] }}
                  </span>
                </td>
                <td class="center">{{ dos.joursDansEtape }}</td>
                <td class="num">{{ formaterMontant(dos.honoraires) }}</td>
                <td><StatusTag :statut="dos.statut" /></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Trois analyses -->
        <div class="bottom">
          <section class="card">
            <div class="card-hd">
              <div><h3>Chiffre d'affaires</h3><div class="sub">6 derniers mois</div></div>
              <div class="act"><button class="mini">USD ▾</button></div>
            </div>
            <div class="stat">
              <div class="big">
                {{ formaterNombre(d.stats.chiffreAffaires.valeur) }}
                <em>{{ d.stats.chiffreAffaires.devise }}</em>
                <span class="up">{{ formaterVariation(d.stats.chiffreAffairesVariation) }}</span>
              </div>
              <div class="vs">dont {{ formaterMontant(d.stats.honorairesPeriode) }} d'honoraires</div>
            </div>
            <div class="lg">
              <span><i style="background: var(--s1)" />Honoraires</span>
              <span><i style="background: var(--s6)" />Débours refacturés</span>
            </div>
            <div class="chartbox">
              <div class="yax">
                <span v-for="i in 5" :key="i">{{ i === 5 ? '0' : `${formaterNombre((maxCA * (5 - i)) / 4 / 1000)}k` }}</span>
              </div>
              <div class="chart-inner">
                <AreaChart :series="seriesCA" :max="maxCA" />
              </div>
              <div class="xax">
                <span v-for="p in d.chiffreAffaires" :key="p.periode">{{ p.periode }}</span>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-hd"><h3>Créances par ancienneté</h3></div>
            <ul class="aging">
              <li v-for="(t, i) in d.creances" :key="t.libelle">
                <div class="t">
                  <b>{{ t.libelle }}</b>
                  <span>{{ formaterMontant(t.montant) }}</span>
                </div>
                <div class="bar"><i :style="{ width: `${t.part}%`, background: COULEURS_CREANCE[i] }" /></div>
              </li>
              <li class="tot">
                <span class="muted">Total dû</span>
                <b>{{ formaterNombre(totalCreances) }} HTG</b>
              </li>
            </ul>
          </section>

          <section class="card">
            <div class="card-hd"><h3>Types de dossiers</h3></div>
            <div class="donutrow">
              <DonutChart
                :parts="d.repartitionTypes.map((r) => ({ part: r.part, couleur: TEINTES_TYPE[r.type] }))"
                :total="String(d.stats.dossiersEnCours)"
                legende="en cours"
                style="width: 92px; height: 92px; flex: none"
              />
              <div class="dlegend">
                <span v-for="r in d.repartitionTypes" :key="r.type">
                  <i :style="{ background: TEINTES_TYPE[r.type] }" />
                  {{ TYPE_DOSSIER_LABEL[r.type] }} {{ r.part }}%
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Colonne latérale -->
      <div class="right">
        <section class="card">
          <div class="card-hd">
            <AppIcon name="bell" style="color: var(--red)" />
            <h3>Alertes &amp; relances</h3>
            <span class="pastille">{{ d.alertes.length }}</span>
            <div class="act"><span class="link">Tout voir →</span></div>
          </div>
          <div class="rows">
            <RouterLink
              v-for="a in d.alertes" :key="a.id"
              :to="a.lien ?? '#'" class="arow"
            >
              <div class="ic" :style="{ background: TON_ALERTE[a.niveau] }">
                <AppIcon :name="ICONE_ALERTE[a.niveau]" :size="15" />
              </div>
              <div><b>{{ a.titre }}</b><small>{{ a.detail }}</small></div>
              <span class="when">{{ a.depuis }}</span>
            </RouterLink>
          </div>
        </section>

        <section v-if="dossier" class="card">
          <div class="card-hd">
            <h3>Dossier {{ dossier.reference }}</h3>
            <StatusTag :statut="dossier.statut" style="margin-left: auto" />
          </div>
          <div class="dossier">
            <dl class="dinfo">
              <dt>Client</dt><dd>{{ dossier.clientNom }}</dd>
              <dt>Marchandise</dt>
              <dd>{{ dossier.marchandises[0]?.quantite }} × {{ dossier.marchandises[0]?.unite }}</dd>
              <dt>Valeur CIF</dt><dd>{{ formaterMontant(dossier.valeurCIF) }}</dd>
              <dt>Droits estimés</dt><dd>{{ formaterMontant(dossier.droitsEstimes) }}</dd>
              <dt>Arrivée</dt><dd>{{ formaterDateCourte(dossier.dateArrivee) }}</dd>
            </dl>

            <ul class="tl">
              <li v-for="e in dossier.etapes" :key="e.etape">
                <span
                  class="mk"
                  :class="e.dateFranchie ? 'done' : e.etape === dossier.etapeCourante ? 'now' : 'todo'"
                >{{ e.dateFranchie ? '✓' : e.etape === dossier.etapeCourante ? '●' : '○' }}</span>
                <div>
                  <b>{{ ETAPE_LABEL[e.etape] }}</b>
                  <small v-if="e.dateFranchie">{{ formaterDateCourte(e.dateFranchie) }}</small>
                  <small v-else-if="e.etape === dossier.etapeCourante">
                    En cours depuis {{ dossier.joursDansEtape }} jours
                  </small>
                  <small v-else>En attente</small>
                </div>
              </li>
            </ul>

            <ul class="docs">
              <li v-for="doc in dossier.documents" :key="doc.id" :class="{ ko: doc.statut === 'manquant' }">
                <AppIcon :name="doc.statut === 'manquant' ? 'alert' : 'check'" :size="14" />
                <span>{{ doc.nom }}<template v-if="doc.statut === 'manquant'"> — manquante</template></span>
              </li>
            </ul>

            <RouterLink :to="`/dossiers/${dossier.id}`" class="btn-gold">
              Ouvrir le dossier <AppIcon name="arrowRight" :size="14" :width="2.4" />
            </RouterLink>
          </div>
        </section>

        <section class="card">
          <div class="card-hd"><h3>Actions rapides</h3></div>
          <div class="qa">
            <button><div class="chip gold"><AppIcon name="folder" /></div><span>Nouveau dossier</span></button>
            <button><div class="chip blue"><AppIcon name="quote" /></div><span>Créer un devis</span></button>
            <button><div class="chip green"><AppIcon name="wallet" /></div><span>Enregistrer un paiement</span></button>
            <button><div class="chip violet"><AppIcon name="mail" /></div><span>Relancer un client</span></button>
          </div>
        </section>
      </div>
    </div>
  </template>
</template>

<style scoped>
.etat { font-size: 12.5px; color: var(--mut); padding: 40px 0; text-align: center; }
.etat.erreur { color: var(--red); }

.kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 13px; }
.cols { display: grid; grid-template-columns: 1fr 312px; gap: 14px; align-items: start; }
.cols > * { min-width: 0; }
.left, .right { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.bottom { display: grid; grid-template-columns: 1.9fr 1.05fr 1fr; gap: 14px; }
.bottom > * { min-width: 0; }

.funnel { margin: 0 10px; }

.ref { color: inherit; }
.ref:hover { color: var(--acc-tx); }
.step { display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
.step i { width: 7px; height: 7px; border-radius: 50%; flex: none; }

.stat { padding: 0 16px 6px; }
.big {
  font-size: 25px; font-weight: 700; letter-spacing: -.8px;
  display: flex; align-items: baseline; gap: 8px; white-space: nowrap;
}
.big em { font-style: normal; font-size: 13px; font-weight: 600; color: var(--dim); }
.big span { font-size: 11.5px; }
.vs { font-size: 10.5px; color: var(--dim); margin-top: 5px; }
.lg { display: flex; gap: 14px; font-size: 10px; color: var(--mut); padding: 0 16px 10px; }
.lg i { width: 7px; height: 7px; border-radius: 2px; display: inline-block; margin-right: 6px; }

.chartbox { padding: 6px 14px 14px; position: relative; }
.chart-inner { padding-left: 30px; }
.yax {
  position: absolute; left: 14px; top: 6px; bottom: 28px;
  display: flex; flex-direction: column; justify-content: space-between;
  font-size: 9px; color: var(--dim);
}
.xax {
  display: flex; justify-content: space-between;
  font-size: 9.5px; color: var(--dim); padding: 8px 4px 0 34px;
}

.aging { padding: 2px 16px 16px; display: flex; flex-direction: column; gap: 13px; }
.aging li { font-size: 11px; }
.aging .t { display: flex; justify-content: space-between; margin-bottom: 6px; }
.aging .t b { font-weight: 600; }
.aging .t span { color: var(--mut); font-weight: 600; white-space: nowrap; }
.tot {
  display: flex; justify-content: space-between; font-size: 11px;
  border-top: 1px solid var(--line); margin-top: 2px; padding-top: 11px;
}
.tot b { font-weight: 700; }

.donutrow { display: flex; align-items: center; gap: 8px; padding: 2px 12px 18px; }
.dlegend {
  display: flex; flex-direction: column; gap: 9px;
  font-size: 9.5px; color: var(--mut); white-space: nowrap;
}
.dlegend i { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }

.pastille {
  min-width: 16px; height: 16px; border-radius: 9px;
  background: #ef4444; color: #fff; font-size: 9.5px; font-weight: 700;
  display: grid; place-items: center; padding: 0 3px;
}
.rows { padding: 0 13px 14px; display: flex; flex-direction: column; gap: 3px; }
.arow { display: flex; gap: 11px; padding: 10px 8px; border-radius: 10px; }
.arow:hover { background: var(--panel2); }
.arow .ic {
  width: 32px; height: 32px; border-radius: 9px;
  display: grid; place-items: center; flex: none; color: #fff;
}
.arow b { font-size: 12px; font-weight: 600; display: block; }
.arow small { font-size: 10.5px; color: var(--mut); display: block; margin-top: 3px; line-height: 1.4; }
.arow .when { margin-left: auto; font-size: 9.5px; color: var(--dim); white-space: nowrap; padding-top: 2px; }

.dossier { padding: 0 15px 15px; }
.dinfo { display: grid; grid-template-columns: auto 1fr; gap: 9px 12px; font-size: 11.5px; padding: 2px 0 14px; }
.dinfo dt { color: var(--dim); }
.dinfo dd { text-align: right; font-weight: 600; }

.tl { display: flex; flex-direction: column; margin-bottom: 14px; }
.tl li { display: flex; gap: 11px; position: relative; padding-bottom: 11px; }
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
.now {
  background: var(--t-gold-bg); color: var(--t-gold-fg);
  border: 1px solid var(--nav-bd); box-shadow: 0 0 0 4px var(--tl-now-halo);
}
.todo { background: var(--panel2); color: var(--dim); border: 1px solid var(--line2); }
.tl b { font-size: 11.5px; font-weight: 600; }
.tl small { display: block; font-size: 10px; color: var(--dim); margin-top: 2px; }

.docs { display: flex; flex-direction: column; gap: 8px; font-size: 11px; margin-bottom: 13px; }
.docs li { display: flex; align-items: center; gap: 9px; color: var(--green); }
.docs li span { color: var(--mut); }
.docs li.ko { color: var(--red); }
.docs li.ko span { color: var(--red); font-weight: 600; }

.qa { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 15px 15px; }
.qa button {
  background: var(--panel2); border: 1px solid var(--line2); border-radius: 11px;
  padding: 13px 11px; display: flex; flex-direction: column; gap: 9px;
  cursor: pointer; color: var(--txt); text-align: left;
}
.qa button:nth-child(1) { border-color: var(--qa1); }
.qa button:nth-child(2) { border-color: var(--qa2); }
.qa button:nth-child(3) { border-color: var(--qa3); }
.qa button:nth-child(4) { border-color: var(--qa4); }
.qa .chip { width: 30px; height: 30px; }
.qa span { font-size: 11px; font-weight: 500; line-height: 1.35; }
</style>
