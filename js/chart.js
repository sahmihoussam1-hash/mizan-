// Transforme le temps envoyé par l'API en date lisible (ex : 13/11)
function getLabel(point) {
    let milliseconds = point.t * 1000;      // l'API donne des secondes
    if (point.t > 100000000000) {           // si c'est déjà en millisecondes
        milliseconds = point.t;
    }
    const date = new Date(milliseconds);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

// Dessine le graphique en barres à partir d'une liste de points
export function drawChart(points) {
    const chart = document.getElementById('history-chart');
    const labels = document.getElementById('history-labels');

    // On vide l'ancien graphique
    chart.textContent = '';
    labels.textContent = '';

    // 1. On garde seulement les points qui ont un prix de clôture (c)
    const validPoints = [];
    points.forEach(function (point) {
        if (typeof point.c === 'number') {
            validPoints.push(point);
        }
    });

    if (validPoints.length === 0) {
        return;
    }

    // 2. La liste des prix seulement
    const prices = [];
    validPoints.forEach(function (point) {
        prices.push(point.c);
    });

    // 3. Le prix le plus bas et le plus haut
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // On n'écrit pas toutes les dates (trop serrées) : une sur "step"
    const step = Math.ceil(validPoints.length / 6);

    // 4. Une barre par point
    validPoints.forEach(function (point, index) {
        // Hauteur en pourcentage
        let height = 50;                        // si tous les prix sont pareils
        if (max !== min) {
            height = (point.c - min) / (max - min) * 100;
            if (height < 10) {
                height = 10;                    // on garde toujours une barre visible
            }
        }

        const column = document.createElement('div');
        column.classList.add('history-column');
        column.title = getLabel(point) + ' : ' + point.c.toFixed(2);   // info au survol

        const bar = document.createElement('div');
        bar.classList.add('history-bar');
        bar.style.height = height + '%';

        column.appendChild(bar);
        chart.appendChild(column);

        // La date sous la barre (une sur "step", les autres restent vides)
        const label = document.createElement('div');
        if (index % step === 0) {
            label.textContent = getLabel(point);
        }
        labels.appendChild(label);
    });
}