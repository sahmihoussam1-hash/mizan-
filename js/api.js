export async function fetchGoldPrices(currency = 'MAD') {
    const url = `https://xaus.com/api/v1/spot?currency=${currency}&unit=gram`;

    try {
       
        const response = await fetch(url);
       
        if (!response.ok) throw new Error("Serveur indisponible");
        
      
        return await response.json();

    } catch (error) {
     
        console.warn("Connexion réseau impossible. Chargement des données locales de secours...");
        
   
        const fallbackResponse = await fetch('./samples/prices.json');
        
        if (!fallbackResponse.ok) {
            throw new Error("Impossible de charger les prix (réseau et fichier local indisponibles).");
        }
     
        return await fallbackResponse.json();
    }
}