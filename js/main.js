import { fetchGoldPrices } from './api.js';
import { renderPrices } from './display.js';


 async function initApp(){
    console.log("Initialisation de l'application Mizan");

    try {
        const data = await fetchGoldPrices('MAD');

        renderPrices(data);

        console.log("Donnes charges et afficher avec succes !");
    } catch(error){
        console.error("Erreur leur de l'initialisation !!",error);

    }
 }
 initApp();