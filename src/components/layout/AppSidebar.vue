<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { utilisateurCourant } from '@/api/mock/donnees'
import { ROLE_LABEL } from '@/types'

interface Lien { to: string; icone: string; libelle: string; badge?: string }
interface Groupe { titre: string | null; liens: Lien[] }

/** Navigation issue des modules décrits au cahier des charges. */
const GROUPES: Groupe[] = [
  {
    titre: null,
    liens: [{ to: '/tableau-de-bord', icone: 'grid', libelle: 'Tableau de bord' }],
  },
  {
    titre: 'DOSSIERS',
    liens: [
      { to: '/dossiers', icone: 'folder', libelle: 'Dédouanement', badge: '24' },
      { to: '/marchandises', icone: 'box', libelle: 'Marchandises' },
      { to: '/documents', icone: 'doc', libelle: 'Documents', badge: '5' },
    ],
  },
  {
    titre: 'CLIENTS',
    liens: [
      { to: '/clients', icone: 'users', libelle: 'Clients' },
      { to: '/prospects', icone: 'target', libelle: 'Prospects' },
      { to: '/portail', icone: 'globe', libelle: 'Portail client' },
    ],
  },
  {
    titre: 'FINANCES',
    liens: [
      { to: '/devis', icone: 'quote', libelle: 'Devis', badge: '7' },
      { to: '/factures', icone: 'invoice', libelle: 'Factures' },
      { to: '/paiements', icone: 'wallet', libelle: 'Paiements' },
      { to: '/debours', icone: 'coins', libelle: 'Débours' },
    ],
  },
  {
    titre: 'PILOTAGE',
    liens: [
      { to: '/rapports', icone: 'bars', libelle: 'Rapports' },
      { to: '/notifications', icone: 'mail', libelle: 'Notifications' },
      { to: '/journal', icone: 'clock', libelle: "Journal d'activité" },
    ],
  },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="mark"><AppIcon name="rex" :size="19" :width="2.2" /></div>
      <div>
        <h1>Rex</h1>
        <span>LOGISTIQUE &amp; DÉDOUANEMENT</span>
      </div>
    </div>

    <nav class="nav">
      <template v-for="(groupe, gi) in GROUPES" :key="gi">
        <div v-if="groupe.titre" class="navgroup">{{ groupe.titre }}</div>
        <RouterLink v-for="lien in groupe.liens" :key="lien.to" :to="lien.to" class="lien">
          <AppIcon :name="lien.icone" />
          {{ lien.libelle }}
          <span v-if="lien.badge" class="n">{{ lien.badge }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="spacer" />

    <div class="ai">
      <div class="t"><AppIcon name="spark" :size="14" /> Moteur IA <span class="sp">PRO</span></div>
      <p>Lecture automatique des factures et packing lists.</p>
      <div class="bar"><i style="width: 71%" /></div>
      <div class="q">142 / 200 dossiers traités ce mois</div>
      <button>Gérer l'option</button>
    </div>

    <div class="me">
      <div class="av">{{ utilisateurCourant.initiales }}</div>
      <div>
        <b>{{ utilisateurCourant.nom }}</b>
        <small>{{ ROLE_LABEL[utilisateurCourant.role] }}</small>
      </div>
      <div class="chev"><AppIcon name="chevronDown" :size="13" :width="2.2" /></div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--line);
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
}
.brand { display: flex; align-items: center; gap: 11px; padding: 2px 5px 6px; }
.mark {
  width: 36px; height: 36px; border-radius: 11px;
  background: linear-gradient(150deg, #f0b429, #b07d10);
  display: grid; place-items: center; color: #2a1c00; flex: none;
}
.brand h1 { font-size: 19px; font-weight: 800; letter-spacing: -.4px; }
.brand span {
  display: block; font-size: 9.5px; color: var(--dim);
  font-weight: 600; letter-spacing: .04em; margin-top: 1px;
}
.navgroup {
  font-size: 9.5px; letter-spacing: .14em; color: var(--dim);
  font-weight: 700; padding: 16px 10px 6px;
}
.nav { display: flex; flex-direction: column; gap: 4px; }
.lien {
  display: flex; align-items: center; gap: 11px;
  padding: 9px 11px; border-radius: 9px;
  color: var(--mut); font-size: 12.5px; font-weight: 500;
  transition: .15s;
  border: 1px solid transparent;
}
.lien:hover { background: var(--hover); color: var(--txt); }
.lien.router-link-active {
  background: var(--nav-bg);
  color: var(--nav-tx);
  font-weight: 600;
  border-color: var(--nav-bd);
}
.n {
  margin-left: auto; min-width: 21px; height: 19px; border-radius: 6px;
  background: var(--nav-n-bg); color: var(--nav-n-tx);
  font-size: 10px; font-weight: 700;
  display: grid; place-items: center; padding: 0 6px;
}
.lien.router-link-active .n { background: var(--nav-n-abg); color: var(--nav-n-atx); }
.spacer { flex: 1; min-height: 16px; }

.ai {
  background: var(--ai-bg); border: 1px solid var(--ai-bd);
  border-radius: 14px; padding: 14px; margin-bottom: 12px;
}
.ai .t { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; }
.ai .sp {
  margin-left: auto; font-size: 9px; font-weight: 700;
  color: var(--onink); background: var(--gold); border-radius: 5px; padding: 2px 6px;
}
.ai p { font-size: 10.5px; color: var(--mut); line-height: 1.5; margin: 8px 0 10px; }
.ai .bar { height: 5px; border-radius: 4px; background: var(--ai-track); overflow: hidden; margin-bottom: 6px; }
.ai .bar i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--gold-d), var(--gold)); }
.ai .q { font-size: 9.5px; color: var(--dim); margin-bottom: 11px; }
.ai button {
  width: 100%; background: var(--ai-btn-bg); border: 1px solid var(--ai-btn-bd);
  color: var(--ai-btn-tx); font-weight: 600; font-size: 11.5px;
  padding: 8px; border-radius: 8px; cursor: pointer;
}

.me { display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--line); padding-top: 13px; }
.av {
  width: 36px; height: 36px; border-radius: 50%; flex: none;
  background: linear-gradient(150deg, #7a5c3a, #3a2a1a);
  display: grid; place-items: center;
  font-size: 12px; font-weight: 700; color: #f6e6d2; border: 1px solid #6b4f33;
}
.me b { display: block; font-size: 12.5px; font-weight: 600; }
.me small { font-size: 10.5px; color: var(--dim); }
.chev {
  margin-left: auto; width: 22px; height: 22px; border-radius: 6px;
  display: grid; place-items: center; color: var(--mut); background: var(--hover);
}
</style>
