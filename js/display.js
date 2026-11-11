export function renderPrices(data) {
    const container = document.getElementById('prices-container');
    
    if (!container) {
        console.error("Conteneur #prices-container introuvable dans le HTML !");
        return;
    }

    container.textContent = '';

    const items = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({
        symbol: key,
        ...(typeof value === 'object' && value !== null ? value : { price: value })
    }));

    // FILTRE : On ne garde que l'or (xau) et l'argent (silver, allver, xag)
    const filteredItems = items.filter(item => {
        const s = (item.symbol || '').toLowerCase();
       // On garde l'or et l'argent, mais on exclut explicitement les mots "ratio" et "source"
        const isMetal = s.includes('xau') || s.includes('silver') || s.includes('allver') || s.includes('xag');
        const isNotRatio = !s.includes('ratio') && !s.includes('source');
        
        return isMetal && isNotRatio;
    });

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('price-card');

        const title = document.createElement('h2');
        // Affiche le nom s'il existe, sinon le symbole en majuscules
        title.textContent = item.name || item.symbol.toUpperCase();

        // Prix actuel
        const priceElement = document.createElement('h3');
        const price = item.price || item.per_gram_mad || item.per_gram_usd || item.value || '0.00';
        const currency = item.currency || 'MAD';
        priceElement.textContent = `${price} ${currency}/g`;

        // Variation, pourcentage, flèche et couleur
        const variationElement = document.createElement('div');
        variationElement.classList.add('variation-badge');

        const changeValue = item.change || item.variation || 0;
        const changePercent = item.changePercent || item.percent || 0;

        if (changeValue >= 0) {
            variationElement.classList.add('trend-up');
            variationElement.textContent = `▲ +${changeValue} (+${changePercent}%)`;
        } else {
            variationElement.classList.add('trend-down');
            variationElement.textContent = `▼ ${changeValue} (${changePercent}%)`;
        }

        card.appendChild(title);
        card.appendChild(priceElement);
        card.appendChild(variationElement);

        container.appendChild(card);
    });
}