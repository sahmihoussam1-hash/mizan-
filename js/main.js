import { fetchGoldPrices } from './api.js';
import { renderPrices } from './display.js';
import { initEstimator, updateEstimatorData } from './estimateur.js';
import { getSavedCurrency, saveCurrency } from './storage.js';

// ----- L'horloge (inchangée) -----
function startClock() {
    const clockElement = document.getElementById('datetime-container');

    function updateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString('fr-FR', options);
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ----- L'application -----
function initApp() {
    // 1. On récupère tous les éléments de la page, une seule fois
    const currencySelect = document.getElementById('currency');
    const refreshBtn = document.getElementById('refresh-btn');
    const retryBtn = document.getElementById('retry-btn');
    const status = document.getElementById('status');
    const statusMessage = document.getElementById('status-message');
    const container = document.getElementById('prices-container');

    // 2. On remet la devise sauvegardée dans le sélecteur
    currencySelect.value = getSavedCurrency();

    // 3. La fonction qui charge les prix
    async function loadData(currency) {
        // --- État "chargement" ---
        refreshBtn.disabled = true;
        status.hidden = false;
        retryBtn.hidden = true;
        statusMessage.textContent = 'Chargement des cours...';
        container.textContent = '';

        try {
            const data = await fetchGoldPrices(currency);

            // --- État "succès" ---
            renderPrices(data, currency);
            updateEstimatorData(data, currency);
            status.hidden = true;
        } catch (error) {
            // --- État "erreur" ---
            statusMessage.textContent = error.message;
            retryBtn.hidden = false;
        }

        // Dans tous les cas, on réactive le bouton
        refreshBtn.disabled = false;
    }

    // 4. Les clics de l'utilisateur
    currencySelect.addEventListener('change', function () {
        saveCurrency(currencySelect.value);
        loadData(currencySelect.value);
    });

    refreshBtn.addEventListener('click', function () {
        loadData(currencySelect.value);
    });

    retryBtn.addEventListener('click', function () {
        loadData(currencySelect.value);
    });

    // 5. Premier chargement au démarrage
    loadData(currencySelect.value);
}

// ----- Démarrage -----
initApp();
initEstimator();
startClock();