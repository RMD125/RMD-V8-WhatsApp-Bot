const fs = require('fs-extra');
const path = require('path');

// Liste des 80 commandes utiles
const commandsList = {
    // Commandes d'administration
    '!help': { func: 'showHelp', desc: 'Afficher l\'aide des commandes' },
    '!menu': { func: 'showMenu', desc: 'Afficher le menu principal' },
    '!owner': { func: 'showOwner', desc: 'Afficher les informations du propriétaire' },
    '!speed': { func: 'checkSpeed', desc: 'Vérifier la vitesse du bot' },
    '!status': { func: 'botStatus', desc: 'Statut du bot' },
    
    // Commandes de groupe
    '!tagall': { func: 'tagAll', desc: 'Mentionner tous les membres du groupe' },
    '!tag': { func: 'tagMembers', desc: 'Mentionner plusieurs membres' },
    '!infogroup': { func: 'groupInfo', desc: 'Informations sur le groupe' },
    '!linkgroup': { func: 'groupLink', desc: 'Obtenir le lien du groupe' },
    '!promote': { func: 'promoteUser', desc: 'Promouvoir un membre' },
    '!demote': { func: 'demoteUser', desc: 'Rétrograder un membre' },
    '!kick': { func: 'kickUser', desc: 'Expulser un membre' },
    '!add': { func: 'addUser', desc: 'Ajouter un membre' },
    '!listadmins': { func: 'listAdmins', desc: 'Lister les administrateurs' },
    
    // Commandes de modération
    '!welcome': { func: 'setWelcome', desc: 'Configurer le message de bienvenue' },
    '!goodbye': { func: 'setGoodbye', desc: 'Configurer le message d\'au revoir' },
    '!antilink': { func: 'antiLink', desc: 'Activer/désactiver la protection anti-liens' },
    '!antivirtex': { func: 'antiVirtex', desc: 'Protection contre les virus texte' },
    '!nsfw': { func: 'toggleNsfw', desc: 'Activer/désactiver la détection NSFW' },
    
    // Commandes de divertissement
    '!sticker': { func: 'createSticker', desc: 'Créer un sticker à partir d\'une image' },
    '!quote': { func: 'createQuote', desc: 'Créer une citation' },
    '!memes': { func: 'randomMeme', desc: 'Envoyer un meme aléatoire' },
    '!joke': { func: 'tellJoke', desc: 'Raconter une blague' },
    '!fact': { func: 'randomFact', desc: 'Fait aléatoire' },
    
    // Commandes utilitaires
    '!time': { func: 'currentTime', desc: 'Afficher l\'heure actuelle' },
    '!date': { func: 'currentDate', desc: 'Afficher la date actuelle' },
    '!weather': { func: 'weatherInfo', desc: 'Météo d\'une ville' },
    '!calc': { func: 'calculate', desc: 'Calculatrice' },
    '!currency': { func: 'currencyConvert', desc: 'Convertisseur de devises' },
    '!translate': { func: 'translateText', desc: 'Traduire du texte' },
    '!shorturl': { func: 'shortenUrl', desc: 'Raccourcir une URL' },
    
    // Ajoutez ici les autres commandes...
};

async function loadCommands(bot) {
    try {
        for (const [command, details] of Object.entries(commandsList)) {
            bot.commands.set(command, details);
        }
        console.log(`✅ ${Object.keys(commandsList).length} commandes chargées avec succès!`);
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
    }
}

module.exports = { loadCommands, commandsList };
