<template>
  <div class="popup-container p-4">
    <!-- Header / Domain-Anzeige -->
    <div v-if="currentDomain" class="mb-3 text-xs text-gray-500">
      Aktuelle Website: <span class="font-semibold text-gray-700">{{ currentDomain }}</span>
    </div>

    <!-- Falls passende Accounts gefunden wurden -->
    <div v-if="filteredAccounts.length > 0" class="account-list space-y-2">
      <div 
        v-for="account in filteredAccounts" 
        :key="account.id || account.otp" 
        class="account-card p-3 border rounded-lg shadow-sm flex justify-between items-center bg-white"
      >
        <div class="account-info">
          <div class="font-bold text-sm">{{ account.service || account.label || 'Unbenannt' }}</div>
          <div class="text-xs text-gray-500">{{ account.account || account.username || '' }}</div>
        </div>
        <div class="account-code text-lg font-mono font-bold text-blue-600">
          {{ account.token || account.otp || '------' }}
        </div>
      </div>
    </div>

    <!-- Falls KEIN passender Code für die aktuelle Seite gefunden wurde -->
    <div v-else class="empty-state text-center py-6 text-gray-500">
      <p class="text-sm">Kein 2FA-Code für <strong>{{ currentDomain || 'diese Seite' }}</strong> gefunden.</p>
      <button 
        @click="showAllAccounts = true" 
        v-if="!showAllAccounts && accounts.length > 0"
        class="mt-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors"
      >
        Alle {{ accounts.length }} Codes anzeigen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentDomain } from '../utils/browser' // Hilfsfunktion aus Schritt 2

// Reactive States
const currentDomain = ref('')
const accounts = ref([]) // Hier liegen die aus 2FAuth / LocalStorage geladenen Accounts
const showAllAccounts = ref(false) // Toggle falls der User manuell alle einblenden will

onMounted(async () => {
  // 1. Domain des aktiven Tabs ermitteln
  currentDomain.value = await getCurrentDomain()

  // 2. Hier erfolgt der bestehende Aufruf, der deine Accounts lädt:
  // Beispiel: accounts.value = await load2FAAccounts()
})

// Computierte gefilterte Liste
const filteredAccounts = computed(() => {
  // Wenn der User explizit "Alle anzeigen" geklickt hat oder keine Domain erkannt wurde
  if (showAllAccounts.value || !currentDomain.value) {
    return accounts.value
  }

  // Filtere nach Domain (prüft service Name, Label oder Account Name)
  return accounts.value.filter(account => {
    const service = (account.service || account.label || '').toLowerCase()
    const accountName = (account.account || account.username || '').toLowerCase()
    const domain = currentDomain.value.toLowerCase()

    return service.includes(domain) || 
           domain.includes(service) || 
           accountName.includes(domain)
  })
})
</script>

<style scoped>
.popup-container {
  min-width: 320px;
  max-width: 400px;
}
</style>
