// Cette fonction va chercher les prix sur l'API
export async function fetchGoldPrices(currency = 'MAD') {
    const url = `https://xaus.com/api/v1/spot?currency=${currency}&unit=gram`;

    // 1. Pas d'internet ?
    if (!navigator.onLine) {
        throw new Error("Vous êtes hors-ligne.");
    }

    // 2. On envoie la requête
    let response;
    try {
        response = await fetch(url);
    } catch (error) {
        throw new Error("Erreur réseau : le serveur est injoignable.");
    }

    // 3. On regarde le code de la réponse
    if (response.status === 429) {
        throw new Error("Quota dépassé : trop de requêtes.");
    }
    if (response.status >= 500) {
        throw new Error("Le serveur a un problème (erreur 5xx).");
    }
    if (!response.ok) {
        throw new Error("Requête refusée (erreur 4xx).");
    }

    // 4. On lit la réponse
    try {
        return await response.json();
    } catch (error) {
        throw new Error("Réponse illisible.");
    }
}