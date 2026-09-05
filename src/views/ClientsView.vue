<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { api } from '@/api/endpoints'
import type { Client } from '@/types'
import { formaterDate, formaterMontant } from '@/composables/useFormat'

const clients = ref<Client[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)

onMounted(async () => {
  try {
    clients.value = (await api.clients()).items
  } catch (e) {
    erreur.value = e instanceof Error ? e.message : 'Chargement impossible'
  } finally {
    chargement.value = false
  }
})
</script>

<template>
  <AppTopbar titre="Clients" sous-titre="Fiches, documents permanents et encours." />
  <section class="card">
    <div class="card-hd"><h3>{{ clients.length }} clients</h3></div>
    <p v-if="chargement" class="etat">Chargement…</p>
    <p v-else-if="erreur" class="etat erreur">{{ erreur }}</p>
    <table v-else class="tbl">
      <thead>
        <tr>
          <th>CLIENT</th><th>CONTACT</th><th>NIF</th><th>TÉLÉPHONE</th>
          <th style="text-align: center">DOSSIERS ACTIFS</th>
          <th style="text-align: right">DÉBOURS EN COURS</th>
          <th>CLIENT DEPUIS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clients" :key="c.id">
          <td class="strong">{{ c.nom }}</td>
          <td>{{ c.contact }}</td>
          <td>{{ c.nif ?? '—' }}</td>
          <td>{{ c.telephone }}</td>
          <td class="center">{{ c.dossiersActifs }}</td>
          <td class="num">{{ formaterMontant(c.soldeDebours) }}</td>
          <td>{{ formaterDate(c.clientDepuis) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.etat { font-size: 12.5px; color: var(--mut); padding: 34px 0; text-align: center; }
.etat.erreur { color: var(--red); }
</style>
