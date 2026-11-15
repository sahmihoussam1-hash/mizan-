// Une once troy = 31,1035 grammes
const GRAMS_PER_OUNCE = 31.1035;

// Les prix par gramme, mis à jour après chaque requête
let goldPricePerGram = 0;
let silverPricePerGram = 0;
let activeCurrency = 'MAD';

// ----- FONCTIONS PURES (ne touchent pas à la page) -----

// Calcule la valeur du bijou, arrondie à 2 décimales
export function calculateEstimate(weight, pricePerGram) {
    return Math.round(weight * pricePerGram * 100) / 100;
}

// Vérifie le poids. Renvoie un message d'erreur, ou '' si tout va bien
export function validateWeight(text) {
    if (text.trim() === '') {
        return 'Veuillez entrer un poids.';
    }

    const weight = Number(text);

    if (isNaN(weight)) {
        return 'Veuillez entrer un nombre valide.';
    }
    if (weight < 0) {
        return 'Le poids ne peut pas être négatif.';
    }
    if (weight === 0) {
        return 'Le poids doit être supérieur à 0.';
    }

    return '';
}

// ----- AFFICHAGE (parle à la page) -----

function showEstimate() {
    const weightInput = document.getElementById('weight');
    const metalSelect = document.getElementById('metal-type');
    const estimateSpan = document.getElementById('estimate');
    const errorElement = document.getElementById('estimator-error');

    // 1. On vérifie le poids
    const errorMessage = validateWeight(weightInput.value);

    if (errorMessage !== '') {
        estimateSpan.textContent = '0.00';
        errorElement.textContent = errorMessage;
        return;
    }

    // 2. Tout est bon : on efface l'erreur
    errorElement.textContent = '';

    // 3. On choisit le prix du bon métal
    let price = goldPricePerGram;
    if (metalSelect.value === 'silver') {
        price = silverPricePerGram;
    }

    // 4. On calcule et on affiche
    const total = calculateEstimate(Number(weightInput.value), price);
    estimateSpan.textContent = total.toFixed(2) + ' ' + activeCurrency;
}

// Branche les événements (appelé une fois au démarrage)
export function initEstimator() {
    document.getElementById('weight').addEventListener('input', showEstimate);
    document.getElementById('metal-type').addEventListener('change', showEstimate);
}

// Met à jour les prix après chaque requête réussie
export function updateEstimatorData(data, currency) {
    activeCurrency = currency;

    // Or : prix par gramme déjà dans ta devise
    if (data.xau) {
        goldPricePerGram = data.xau.price;
    }

    // Argent : dollars par once, converti en gramme et en ta devise
    if (data.silver_usd_oz && data.fx_rates && data.fx_rates[currency]) {
        silverPricePerGram = data.silver_usd_oz / GRAMS_PER_OUNCE * data.fx_rates[currency];
    }

    showEstimate();
}