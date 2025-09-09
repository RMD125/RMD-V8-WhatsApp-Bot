import express from 'express';
import { makeWASocket, useMultiFileAuthState, makeInMemoryStore, delay } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CONFIGURATION ====================
const CONFIG = {
    owner: '22896190934@s.whatsapp.net',
    botName: 'RMD V8 BOT',
    sessionPath: './session',
    prefix: '!'
};

// ==================== SETUP EXPRESS ====================
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let sock = null;
let qrCode = null;
let isConnected = false;

// ==================== ROUTES POUR PAIR CODE ====================
app.get('/', (req, res) => {
    res.render('pair', { 
        botName: CONFIG.botName,
        qrCode: qrCode,
        connected: isConnected
    });
});

app.get('/qr', async (req, res) => {
    try {
        if (qrCode) {
            const qrImage = await qrcode.toDataURL(qrCode);
            res.json({ success: true, qr: qrImage, connected: isConnected });
        } else {
            res.json({ success: false, connected: isConnected });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/status', (req, res) => {
    res.json({ 
        connected: isConnected,
        botName: CONFIG.botName,
        owner: CONFIG.owner
    });
});

// ==================== FONCTION POUR DÉMARRER LE BOT ====================
export async function startBot() {
    try {
        console.log('🔧 Initialisation de la session WhatsApp...');
        
        const { state, saveCreds } = await useMultiFileAuthState(CONFIG.sessionPath);
        
        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: { level: 'warn' },
            browser: [CONFIG.botName, 'Chrome', '1.0.0'],
            markOnlineOnConnect: true
        });

        // ==================== GESTIONNAIRES D'ÉVÉNEMENTS ====================
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('connection.update', (update) => {
            const { connection, qr } = update;
            
            if (qr) {
                qrCode = qr;
                console.log('📱 Nouveau QR code généré pour le pair code');
                isConnected = false;
            }
            
            if (connection === 'open') {
                console.log('✅✅✅ CONNECTÉ À WHATSAPP!');
                qrCode = null;
                isConnected = true;
                
                // Envoyer message au owner
                sock.sendMessage(CONFIG.owner, { 
                    text: `🤖 *${CONFIG.botName}* est maintenant connecté!\n\n🚀 Bot prêt à être utilisé!` 
                });
            }
            
            if (connection === 'close') {
                console.log('🔌 Déconnecté, reconnexion dans 5s...');
                isConnected = false;
                setTimeout(() => startBot(), 5000);
            }
        });

        // ==================== GESTION DES MESSAGES ====================
        sock.ev.on('messages.upsert', async ({ messages }) => {
            if (!messages || !isConnected) return;
            
            const message = messages[0];
            if (!message.message) return;

            const text = message.message.conversation || '';
            const sender = message.key.remoteJid;

            // TES COMMANDES PERSONNELLES
            if (text === '!menu') {
                await sock.sendMessage(sender, { 
                    text: `🤖 *${CONFIG.botName} MENU*\n\n• !owner - Propriétaire\n• !speed - Vitesse\n• !status - Statut\n• !tagall - Mentionner tous\n🚀 Ton bot personnel!` 
                });
            }
            
            if (text === '!owner') {
                await sock.sendMessage(sender, { 
                    text: `👑 *PROPRIÉTAIRE*\nNuméro: +22896190934\nC'est MON bot RMD V8!` 
                });
            }
            
            if (text === '!status') {
                await sock.sendMessage(sender, { 
                    text: `✅ *STATUT*\nConnecté: Oui\nPropriétaire: +22896190934\nBot: ${CONFIG.botName}` 
                });
            }
        });

    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        setTimeout(() => startBot(), 5000);
    }
}

// ==================== DÉMARRAGE DU SERVEUR WEB ====================
app.listen(PORT, () => {
    console.log(`🌐 Serveur pair code sur http://localhost:${PORT}`);
    startBot();
});

export { sock, isConnected };
