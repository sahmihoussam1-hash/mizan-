import { fetchGoldPrices, fetchChart } from './api.js';
import { renderPrices } from './display.js';
import { initEstimator, updateEstimatorData } from './estimateur.js';
import { getSavedCurrency, saveCurrency } from './storage.js';
import { drawChart } from './chart.js';

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
    const lastUpdate = document.getElementById('last-update');   // NOUVEAU

    // 2. On remet la devise sauvegardée dans le sélecteur
    currencySelect.value = getSavedCurrency();

    // 3. La fonction qui charge les prix
    async function loadData(currency) {
        // --- État "chargement" : on bloque les boutons ---
        refreshBtn.disabled = true;
        retryBtn.disabled = true;          // NOUVEAU
        currencySelect.disabled = true;    // NOUVEAU
        status.hidden = false;
        retryBtn.hidden = true;
        statusMessage.textContent = 'Chargement des cours...';
        container.textContent = '';

       try {
            const data = await fetchGoldPrices(currency);
            const goldChart = await fetchChart('xau');
            const silverChart = await fetchChart('silver');

            // --- État "succès" ---
            renderPrices(data, currency, goldChart, silverChart);
            updateEstimatorData(data, currency);
            status.hidden = true;

            // NOUVEAU : date de mise à jour envoyée par l'API
            const dateText = data.price_as_of || data.updated_at;
            if (dateText) {
                lastUpdate.textContent = 'Dernière mise à jour des prix : ' + new Date(dateText).toLocaleString('fr-FR');
            } else {
                lastUpdate.textContent = 'Date de mise à jour indisponible.';
            }
        } catch (error) {
            // --- État "erreur" ---
            statusMessage.textContent = error.message;
            retryBtn.hidden = false;
            lastUpdate.textContent = '';   // NOUVEAU
        }

        // Dans tous les cas, on débloque les boutons
        refreshBtn.disabled = false;
        retryBtn.disabled = false;         // NOUVEAU
        currencySelect.disabled = false;   // NOUVEAU
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
    // ----- Historique des prix -----
    const historyMetal = document.getElementById('history-metal');
    const history7 = document.getElementById('history-7');
    const history30 = document.getElementById('history-30');
    const historyMessage = document.getElementById('history-message');

    let historyDays = 30;   // la période choisie (30 par défaut)

    async function loadHistory() {
        // --- État "chargement" ---
        history7.disabled = true;
        history30.disabled = true;
        historyMetal.disabled = true;
        historyMessage.textContent = "Chargement de l'historique...";

        try {
            const chart = await fetchChart(historyMetal.value);
            const points = chart.points || chart;

            // On garde seulement les derniers points (7 ou 30)
            const lastPoints = points.slice(-historyDays);

            // --- État "succès" ---
            drawChart(lastPoints);
            historyMessage.textContent = 'Prix de clôture en USD (' + lastPoints.length + ' points)';
        } catch (error) {
            // --- État "erreur" ---
            drawChart([]);   // on vide le graphique
            historyMessage.textContent = error.message + ' Cliquez sur un bouton pour réessayer.';
        }

        // Dans tous les cas, on débloque les boutons
        history7.disabled = false;
        history30.disabled = false;
        historyMetal.disabled = false;
    }

    history7.addEventListener('click', function () {
        historyDays = 7;
        loadHistory();
    });

    history30.addEventListener('click', function () {
        historyDays = 30;
        loadHistory();
    });

    historyMetal.addEventListener('change', loadHistory);

    // Premier affichage du graphique
    loadHistory();

// ----- Démarrage -----
initApp();
initEstimator();
startClock();
