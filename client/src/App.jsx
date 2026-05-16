import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import CryptoJS from 'crypto-js';
import './App.css'; // Tu pourras styliser ton app ici

// ⚠️ En production, remplace 'http://localhost:3001' par l'URL de ton serveur Node déployé
const socket = io('http://localhost:3001'); 

// Clé secrète partagée
const SECRET_KEY = "MaCleSecrete128Bits!";

function App() {
  const [pseudo, setPseudo] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Écoute des messages des autres
    socket.on('chat_message', (data) => {
      // Déchiffrement AES
      const bytes = CryptoJS.AES.decrypt(data.encryptedMessage, SECRET_KEY);
      const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
      
      setMessages(prev => [...prev, { type: 'chat', pseudo: data.pseudo, text: decryptedMessage }]);
    });

    // Écoute des notifications système
    socket.on('system_message', (msg) => {
      setMessages(prev => [...prev, { type: 'system', text: msg }]);
    });

    return () => {
      socket.off('chat_message');
      socket.off('system_message');
    };
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (pseudo.trim()) {
      socket.emit('join', pseudo);
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Gestion de la commande /quit
    if (inputValue === '/quit') {
      socket.emit('leave');
      setIsJoined(false);
      setMessages([]);
      setPseudo('');
      setInputValue('');
      return;
    }

    // Chiffrement AES AVANT l'envoi au serveur
    const encryptedMessage = CryptoJS.AES.encrypt(inputValue, SECRET_KEY).toString();
    
    socket.emit('chat_message', { pseudo, encryptedMessage });
    setInputValue(''); // Vide le champ input
  };

  // Écran de connexion
  if (!isJoined) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Bienvenue sur SecureChat</h2>
        <form onSubmit={handleJoin}>
          <input 
            type="text" 
            placeholder="Choisis un pseudo..." 
            value={pseudo} 
            onChange={(e) => setPseudo(e.target.value)} 
            required 
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>Rejoindre</button>
        </form>
      </div>
    );
  }

  // Écran de Chat
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h2>Salon de discussion sécurisé</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '8px', color: msg.type === 'system' ? 'gray' : 'black', fontStyle: msg.type === 'system' ? 'italic' : 'normal' }}>
            {msg.type === 'chat' ? <strong>{msg.pseudo} : </strong> : null}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
        <input 
          type="text" 
          placeholder="Tape ton message ou /quit pour quitter..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '5px' }}>Envoyer</button>
      </form>
    </div>
  );
}

export default App;
