export function saveCurrency(currency) {
    // SÉCURITÉ ANTI-BUG : Si on passe par erreur l'élément HTML complet au lieu de sa valeur
    const valueToSave = (typeof currency === 'object' && currency !== null && 'value' in currency)
        ? currency.value 
        : currency;

    localStorage.setItem('mizan_currency', valueToSave);
}

export function getSavedCurrency() {
    return localStorage.getItem('mizan_currency') || 'MAD';
}