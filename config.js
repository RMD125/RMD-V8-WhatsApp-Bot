// ==================== CONFIGURATION RMD V8 BOT ====================
global.owner = ['22896190934'] // TON numéro
global.botname = 'RMD V8 BOT' // TON nom de bot
global.packname = 'RMD V8' // TON pack
global.author = 'By Owner' // TON nom
global.prefa = ['', '!', '.', '#'] // TES prefixes

// ==================== MESSAGES PERSONNELS ====================
global.mess = {
    wait: '⏳ Chargement...',
    success: '✅ Succès!',
    error: '❌ Erreur!',
    owner: '🚫 Commande réservée au owner!',
    group: '🚫 Commande pour les groupes seulement!',
    private: '🚫 Commande en privé seulement!'
}

// ==================== BASE DE DONNÉES ====================
global.db = {
    users: {},
    chats: {},
    settings: {}
}

export default {
    owner,
    botname,
    packname,
    author,
    prefa,
    mess,
    db
}
