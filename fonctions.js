// Fonction anti-delete private
function antiDeletePrivate(sock) {
    const deletedMessages = new Map();
    
    sock.ev.on('messages.upsert', ({ messages }) => {
        const message = messages[0];
        if (message.key.fromMe || !message.message) return;
        
        // Stocker le message
        deletedMessages.set(message.key.id, {
            message: message.message,
            timestamp: Date.now(),
            sender: message.pushName || message.key.remoteJid
        });
        
        // Nettoyer les anciens messages (plus de 5 minutes)
        for (const [id, data] of deletedMessages.entries()) {
            if (Date.now() - data.timestamp > 300000) {
                deletedMessages.delete(id);
            }
        }
    });
    
    sock.ev.on('messages.delete', (deleteData) => {
        if (!deleteData.keys || deleteData.keys.length === 0) return;
        
        for (const key of deleteData.keys) {
            const deletedMessage = deletedMessages.get(key.id);
            if (deletedMessage && key.fromMe === false) {
                const sender = deletedMessage.sender;
                const messageType = Object.keys(deletedMessage.message)[0];
                let messageContent = '';
                
                if (messageType === 'conversation') {
                    messageContent = deletedMessage.message.conversation;
                } else if (messageType === 'extendedTextMessage') {
                    messageContent = deletedMessage.message.extendedTextMessage.text;
                }
                
                if (messageContent) {
                    sock.sendMessage(key.remoteJid, {
                        text: `⚠️ *Message supprimé détecté!*\n👤 *De:* ${sender}\n💬 *Message:* ${messageContent}`
                    });
                }
                
                deletedMessages.delete(key.id);
            }
        }
    });
}

// Fonction auto-visionnage des statuts
function autoViewStatus(sock) {
    sock.ev.on('messages.upsert', ({ messages }) => {
        const message = messages[0];
        if (message.key.remoteJid === 'status@broadcast' && message.message) {
            // Marquer le statut comme vu
            sock.readMessages([message.key]);
        }
    });
}

module.exports = { antiDeletePrivate, autoViewStatus };
