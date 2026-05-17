import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css'; 
import { encryptMessage, decryptMessage } from './cryptoUtils';

const socket = io('https://ba-chatapp.onrender.com'); 

function App() {
  const [pseudo, setPseudo] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat_message', (data) => {
      const decryptedMessage = decryptMessage(data.encryptedMessage);
      setMessages(prev => [...prev, { type: 'chat', pseudo: data.pseudo, text: decryptedMessage }]);
    });

    socket.on('system_message', (msg) => {
      setMessages(prev => [...prev, { type: 'system', text: msg }]);
    });

    return () => {
      socket.off('chat_message');'); 
      socket.off('system_message');
    };
  }, []);

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

  const handleQuit = () => {
    socket.emit('leave');
    setIsJoined(false);
    setMessages([]);
    setPseudo('');
    setInputValue('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (inputValue === '/quit') {
      handleQuit();
      return;
    }

    const encryptedMessage = encryptMessage(inputValue);
    socket.emit('chat_message', { pseudo, encryptedMessage });
    setInputValue(''); 
  };

  // --- Écran de Connexion ---
  if (!isJoined) {
    return (
      <div className="login-container">
        <h2> YAJChat </h2>
        <p style={{ marginBottom: '20px', color: '#7f8c8d' }}>Rejoignez le salon chiffré</p>
        <form onSubmit={handleJoin} className="login-form">
          <input 
            type="text" 
            className="login-input"
            placeholder="Choisis un pseudo..." 
            value={pseudo} 
            onChange={(e) => setPseudo(e.target.value)} 
            required 
            autoFocus
          />
          <button type="submit" className="btn-primary">Rejoindre le chat</button>
        </form>
      </div>
    );
  }

  // --- Écran de Chat ---
  return (
    <div className="chat-container">
      
      {/* En-tête */}
      <div className="chat-header">
        <h3> YAJChat</h3>
        <button onClick={handleQuit} className="btn-quit">Quitter le salon</button>
      </div>

      {/* Zone des messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          
          // Messages système (connexion/déconnexion)
          if (msg.type === 'system') {
            return <div key={idx} className="system-message">{msg.text}</div>;
          }

          // Messages normaux (les miens vs les autres)
          const isMe = msg.pseudo === pseudo;
          
          return (
            <div key={idx} className={`message-wrapper ${isMe ? 'me' : 'other'}`}>
              {!isMe && <span className="pseudo-label">{msg.pseudo}</span>}
              <div className="bubble">
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input 
          type="text" 
          className="chat-input"
          placeholder="Écris un message ou /quit..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          autoFocus
        />
        <button type="submit" className="btn-send">Envoyer</button>
      </form>

    </div>
  );
}

export default App;