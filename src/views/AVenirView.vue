<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const route = useRoute()

/** Écrans prévus au cahier des charges, non encore développés. */
const ECRANS: Record<string, { titre: string; phase: string; detail: string }> = {
  marchandises: { titre: 'Marchandises', phase: 'Phase 1', detail: 'Catalogue des marchandises, codes SH et historique des valeurs déclarées.' },
  documents: { titre: 'Documents', phase: 'Phase 1', detail: 'Bibliothèque des pièces jointes et des documents permanents des clients.' },
  prospects: { titre: 'Prospects', phase: 'Phase 2', detail: 'Suivi commercial : prospects, devis en attente, relances et origine des clients.' },
  portail: { titre: 'Portail client', phase: 'Phase 2', detail: 'Espace sécurisé où le client suit ses dossiers, dépose ses pièces et télécharge ses factures.' },
  paiements: { titre: 'Paiements', phase: 'Phase 1', detail: 'Encaissements, rapprochement avec les factures et reçus.' },
  debours: { titre: 'Débours', phase: 'Phase 1', detail: 'Sommes avancées pour le compte des clients et suivi de leur remboursement.' },
  rapports: { titre: 'Rapports', phase: 'Phase 2', detail: 'Chiffre d\'affaires par période, délais moyens, exports comptables.' },
  notifications: { titre: 'Notifications', phase: 'Phase 1', detail: 'Modèles d\'e-mails au logo de Rex et journal des envois automatiques.' },
  journal: { titre: 'Journal d\'activité', phase: 'Phase 2', detail: 'Trace horodatée des actions par utilisateur, pour audit.' },
}

const section = computed(() => String(route.params.section ?? ''))
const ecran = computed(() => ECRANS[section.value])
</script>

<template>
  <AppTopbar :titre="ecran?.titre ?? 'À venir'" />
  <div class="vide">
    <div class="ic"><AppIcon name="spark" :size="26" /></div>
    <h3>{{ ecran?.titre }}</h3>
    <p>{{ ecran?.detail }}</p>
    <span class="phase">Prévu en {{ ecran?.phase }}</span>
  </div>
</template>

<style scoped>
.vide {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 80px 24px; text-align: center;
  background: var(--panel); border: 1px dashed var(--line2); border-radius: 14px;
}
.ic {
  width: 56px; height: 56px; border-radius: 16px;
  background: var(--t-gold-bg); color: var(--t-gold-fg);
  display: grid; place-items: center;
}
h3 { font-size: 16px; font-weight: 600; }
p { font-size: 12.5px; color: var(--mut); max-width: 440px; line-height: 1.6; }
.phase {
  font-size: 10px; font-weight: 700; color: var(--acc-tx);
  border: 1px solid var(--nav-bd); border-radius: 999px; padding: 4px 11px;
}
</style>
