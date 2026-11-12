import { fetchGoldPrices } from './api.js';
import { renderPrices } from './display.js';
import { initEstimator,updateEstimatorData } from './estimateur.js';
import { getSavedCurrency, saveCurrency } from './storage.js';

function startClock(){
    const clockElement = document.getElementById('datetime-container');
    if (!clockElement) return ;

    function updateTime(){
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
        clockElement.textContent = now.toLocaleDateString('fr-FR',options);
    }
    updateTime();
    setInterval(updateTime,1000);

}
      
async function initApp() {
    console.log("Initialisation de l'application Mizan");
 
    const currencySelect = document.getElementById('currency'); // Ou 'currency-select' selon ton HTML
    const refreshBtn = document.getElementById('refresh-btn'); 

    // Récupérer la devise sauvegardée et l'appliquer au select
    const currentCurrency = getSavedCurrency();
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }

    // Fonction interne pour charger et afficher les données
    async function loadData(currency) {
        try {
            console.log(`Chargement des prix pour la devise : ${currency}`);
            const data = await fetchGoldPrices(currency);
            renderPrices(data, currency);
             updateEstimatorData(data, currency);
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    }

    // Chargement initial au démarrage avec la bonne valeur .value
    const selectedCurrency = currencySelect ? currencySelect.value : currentCurrency;
    await loadData(selectedCurrency);
    

    // Écouteur sur le changement de devise du sélecteur
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            const newCurrency = e.target.value; // Récupère bien la chaîne ("USD", "EUR", "MAD")
            saveCurrency(newCurrency);          // Sauvegarde dans le localStorage
            loadData(newCurrency);              // Recharge les prix sans recharger la page
        });
    }

    // Écouteur sur le bouton "Actualiser"
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const activeCurrency = currencySelect ? currencySelect.value : getSavedCurrency();
            await loadData(activeCurrency);
        });
    }
}

// Lancement de l'application
initApp();
initEstimator();
startClock();