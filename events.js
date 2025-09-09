const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { setProfilePicture } = require('./functions');

async function handleEvents(bot, message) {
    if (!message.message) return;
    
    const messageText = message.message.conversation || 
                       (message.message.extendedTextMessage && message.message.extendedTextMessage.text) || '';
    
    // Vérifier les commandes
    for (const [command, details] of bot.commands.entries()) {
        if (messageText.startsWith(command)) {
            // Vérifier si commande réservée au propriétaire
            if (details.ownerOnly && message.key.remoteJid !== bot.ownerNumber) {
                await bot.sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Cette commande est réservée au propriétaire du bot.'
                });
                return;
            }
            
            // Exécuter la commande
            try {
                switch(details.func) {
                    case 'setProfilePicture':
                        await setProfilePicture(bot, message);
                        break;
                    case 'showHelp':
                        await showHelp(bot, message);
                        break;
                    // Ajoutez les autres commandes ici...
                    default:
                        await bot.sock.sendMessage(message.key.remoteJid, {
                            text: `✅ Commande "${command}" reçue. Fonction: ${details.func}`
                        });
                }
            } catch (error) {
                console.error('Erreur commande:', error);
                await bot.sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Erreur lors de l\'exécution de la commande.'
                });
            }
            return;
        }
    }
}

async function showHelp(bot, message) {
    let helpText = '🤖 *RMD V8 BOT - AIDE*\n\n';
    helpText += '*Commandes disponibles:*\n\n';
    
    for (const [command, details] of bot.commands.entries()) {
        helpText += `• *${command}* - ${details.desc}\n`;
    }
    
    await bot.sock.sendMessage(message.key.remoteJid, {
        text: helpText
    });
}

module.exports = { handleEvents, showHelp };
