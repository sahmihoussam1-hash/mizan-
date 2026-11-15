// Une once troy = 31,1035 grammes
const GRAMS_PER_OUNCE = 31.1035;

// Calcule la variation : dernier prix moins prix de la veille
function getVariation(chart) {
    const points = chart.points || chart;   // la liste des prix

    if (points.length < 2) {
        return null;
    }

    const last = points[points.length - 1].c;        // dernier prix
    const previous = points[points.length - 2].c;    // prix de la veille

    if (!last || !previous) {
        return null;
    }

    return {
        change: last - previous,                      // en dollars par once
        percent: (last - previous) / previous * 100   // en pourcentage
    };
}

export function renderPrices(data, currency, goldChart, silverChart) {
    const container = document.getElementById('prices-container');
    container.textContent = '';

    // Taux de change : dollar → devise choisie
    const rate = data.fx_rates[currency];

    // La liste des métaux : une carte sera créée pour chacun
    const metals = [
        {
            name: 'Or',
            price: data.xau.price,
            variation: getVariation(goldChart)
        },
        {
            name: 'Argent',
            price: data.silver_usd_oz / GRAMS_PER_OUNCE * rate,
            variation: getVariation(silverChart)
        }
    ];

    metals.forEach(metal => {
        const card = document.createElement('div');
        card.classList.add('price-card');

        const title = document.createElement('h2');
        title.textContent = metal.name;

        const priceElement = document.createElement('h3');
        priceElement.textContent = metal.price.toFixed(2) + ' ' + currency + '/g';

        const variationElement = document.createElement('div');
        variationElement.classList.add('variation-badge');

        if (metal.variation === null) {
            variationElement.textContent = 'Variation indisponible';
        } else {
            // On convertit en gramme et dans ta devise
            const change = metal.variation.change / GRAMS_PER_OUNCE * rate;
            const percent = metal.variation.percent;

            if (change >= 0) {
                card.classList.add('card-up');
                variationElement.classList.add('trend-up');
                variationElement.textContent = '▲ +' + change.toFixed(2) + ' (+' + percent.toFixed(2) + '%)';
            } else {
                card.classList.add('card-down');
                variationElement.classList.add('trend-down');
                variationElement.textContent = '▼ ' + change.toFixed(2) + ' (' + percent.toFixed(2) + '%)';
            }
        }

        card.appendChild(title);
        card.appendChild(priceElement);
        card.appendChild(variationElement);
        container.appendChild(card);
    });
}