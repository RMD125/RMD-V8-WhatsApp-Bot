import { startBot } from './index.js';
import './commands/all.commands.js';

// ==================== DÉMARRAGE DU BOT ====================
console.log('🚀 Démarrage de RMD V8 BOT...');
console.log('👑 Owner: +22896190934');

// Démarrer le bot
startBot().catch(console.error);

// Gestion des erreurs
process.on('unhandledRejection', (err) => {
    console.error('❌ Erreur non gérée:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Exception non catchée:', err);
});
