// src/utils/browser.ts

export async function getCurrentDomain() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return '';
    const url = new URL(tab.url);
    // Gibt die Domain z. B. als 'github.com' zurück (ohne www.)
    return url.hostname.replace(/^www\./, '').toLowerCase();
  } catch (e) {
    console.error('Fehler beim Abrufen der Tab-Domain:', e);
    return '';
  }
}
