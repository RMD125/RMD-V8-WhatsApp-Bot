const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, makeInMemoryStore } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');

// Import de la configuration
const config = require('./config.json');

class RMDV8Bot {
    constructor() {
        this.sock = null;
        this.store = makeInMemoryStore({});
        this.commands = new Map();
        this.isConnected = false;
        this.ownerNumber = config.ownerNumber;
    }

    async initialize() {
        try {
            // Charger l'état de la session
            const { state, saveCreds } = await useMultiFileAuthState('sessions');
            
            // Créer la connexion WhatsApp
            this.sock = makeWASocket({
                auth: state,
                printQRInTerminal: true,
                logger: config.logger,
                browser: ['RMD V8 Bot', 'Chrome', '3.0.0']
            });

            // Appliquer le store
            this.store.bind(this.sock.ev);
            
            // Gérer les événements
            this.sock.ev.on('creds.update', saveCreds);
            this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
            this.sock.ev.on('messages.upsert', this.handleIncomingMessage.bind(this));
            
            console.log('🤖 RMD V8 Bot initialisé avec succès!');
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
        }
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'close') {
            const shouldReconnect = 
                new Boom(lastDisconnect?.error)?.output?.statusCode !== 401;
            
            console.log('Connection fermée, reconnexion:', shouldReconnect);
            
            if (shouldReconnect) {
                this.initialize();
            }
        } else if (connection === 'open') {
            console.log('✅ Connecté à WhatsApp!');
            this.isConnected = true;
        }
    }

    async handleIncomingMessage({ messages }) {
        if (!messages || !this.isConnected) return;
        
        const message = messages[0];
        if (!message.message || message.key.remoteJid === 'status@broadcast') return;
        
        // Vérifier les commandes
        const messageText = message.message.conversation || 
                           (message.message.extendedTextMessage && message.message.extendedTextMessage.text) || '';
        
        if (messageText.startsWith('!')) {
            await this.handleCommand(message, messageText);
        }
    }

    async handleCommand(message, commandText) {
        // Implémentez la logique des commandes ici
        if (commandText === '!help') {
            await this.sock.sendMessage(message.key.remoteJid, {
                text: '🤖 RMD V8 Bot - Commandes disponibles:\n\n• !help - Afficher cette aide\n• !setpp - Changer la photo de profil (répondez à une image)\n• !status - Statut du bot'
            });
        }
        // Ajoutez vos autres commandes ici
    }
}

// Démarrer le bot
const bot = new RMDV8Bot();
bot.initialize();

// Gérer les arrêts
process.on('SIGINT', () => {
    console.log('Arrêt du bot...');
    process.exit(0);
});
