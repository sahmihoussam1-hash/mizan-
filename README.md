# Mizan

Application web de la bijouterie **Al Andalous** (Nador) pour consulter les cours de l'or et de l'argent.

Données : API publique [xaus.com](https://xaus.com/api).

## Fonctionnalités

- Prix de l'or et de l'argent
- Choix de la devise : MAD, USD, EUR (mémorisée)
- Estimateur de bijou à partir du poids en grammes
- États visibles : chargement, succès, erreur
- Erreurs distinguées : hors-ligne, réseau, 4xx, 5xx, quota, JSON illisible
- Boutons « Actualiser » et « Réessayer »

## Technologies

HTML, CSS, JavaScript vanilla (modules ES). Aucun framework.

## Structure

```
index.html
css/style.css
js/main.js
js/api.js
js/display.js
js/estimateur.js
js/storage.js
js/chart.js
```


Aucune clé d'API n'est nécessaire.

## À faire
- FetchChart ne distingue pas encore tous les types d’erreur (quota, 4xx,   5xx, JSON illisible),
- Journal des requêtes (bonus)