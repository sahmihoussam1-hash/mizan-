let currentGoldGramPrice = 0;
let currentSilverGramPrice = 0;
let activeCurrencySymbol = 'MAD';

/**
 * Calcule et affiche la valeur estimée du bijou
 */
function calculateJewelryEstimate() {
    const weightInput = document.getElementById('weight');
    const metalSelect = document.getElementById('metal-type');
    const estimateSpan = document.getElementById('estimate');
    const errorElement = document.getElementById('estimator-error');

    if (!weightInput || !estimateSpan) return;

    const weightValue = weightInput.value.trim();
    const weight = parseFloat(weightValue);

    // 1. Validation : Champ vide
    if (weightValue === "") {
        estimateSpan.textContent = `0.00`;
        if (errorElement) errorElement.textContent = "Veuillez entrer un poids.";
        return;
    }

    // 2. Validation : Non numérique ou négatif
    if (isNaN(weight)) {
        estimateSpan.textContent = `0.00`;
        if (errorElement) errorElement.textContent = "Veuillez entrer un nombre valide.";
        return;
    }

    if (weight < 0) {
        estimateSpan.textContent = `0.00`;
        if (errorElement) errorElement.textContent = "Le poids ne peut pas être négatif.";
        return;
    }

    // Si tout est ok, on nettoie le message d'erreur
    if (errorElement) errorElement.textContent = "";

    // 3. Choix du métal et application du prix courant
    const selectedMetal = metalSelect ? metalSelect.value : 'gold';
    const pricePerGram = selectedMetal === 'silver' ? currentSilverGramPrice : currentGoldGramPrice;

    const totalValue = weight * pricePerGram;
    estimateSpan.textContent = `${totalValue.toFixed(2)} ${activeCurrencySymbol}`;
}

/**
 * Initialise les écouteurs d'événements
 */
export function initEstimator() {
    const weightInput = document.getElementById('weight');
    const metalSelect = document.getElementById('metal-type');

    if (weightInput) {
        weightInput.addEventListener('input', calculateJewelryEstimate);
    }
    if (metalSelect) {
        metalSelect.addEventListener('change', calculateJewelryEstimate);
    }
}

/**
 * Met à jour les prix de référence reçus de l'API / JSON
 */
export function updateEstimatorData(data, currency) {
    activeCurrencySymbol = currency;

    if (Array.isArray(data)) {
        data.forEach(item => {
            const symbol = (item.symbol || '').toLowerCase();
            if (symbol.includes('xau')) {
                currentGoldGramPrice = parseFloat(item.price || item.per_gram_mad || 0);
            } else if (symbol.includes('silver') || symbol.includes('xag')) {
                currentSilverGramPrice = parseFloat(item.price || 0);
            }
        });
    } else if (typeof data === 'object' && data !== null) {
        if (data.xau && data.xau.price) {
            currentGoldGramPrice = parseFloat(data.xau.price);
        }
        if (data.silver_usd_oz || data.silver) {
            const silverObj = data.silver_usd_oz || data.silver;
            currentSilverGramPrice = parseFloat(silverObj.price || silverObj);
        }
        if (data.per_gram_mad && currency === 'MAD') {
            currentGoldGramPrice = parseFloat(data.per_gram_mad);
        }
    }

    calculateJewelryEstimate();
}