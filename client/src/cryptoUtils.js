import CryptoJS from 'crypto-js';

const SECRET_KEY = "MaCleSecrete128Bits!";

/**
 * Chiffre un texte en clair en AES
 * @param {string} text - Le message de l'utilisateur
 * @returns {string} - Le message chiffré (généralement une chaîne en Base64)
 */
export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

/**
 * Déchiffre un message AES
 * @param {string} cipherText - Le message chiffré reçu du serveur
 * @returns {string} - Le message en clair
 */
export const decryptMessage = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // Si le déchiffrement échoue (mauvaise clé, données corrompues)
    if (!originalText) {
      return "⚠️ Impossible de déchiffrer le message (Clé incorrecte ou données altérées).";
    }
    
    return originalText;
  } catch (error) {
    return "❌ Erreur lors du déchiffrement.";
  }
};