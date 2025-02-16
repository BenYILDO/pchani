import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // Backend socket server URL
const MessageContext = createContext(null);

// Örnek mesaj verileri
const initialMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1,
    receiverId: 2,
    content: 'Merhaba, RTX 4090 ekran kartı hala satılık mı?',
    timestamp: '2024-02-11T10:30:00',
    isRead: true,
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Evet, hala satılık. Fiyatta küçük bir pazarlık payı var.',
    timestamp: '2024-02-11T10:35:00',
    isRead: true,
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 1,
    receiverId: 2,
    content: 'Harika! 120.000 TL düşünüyor musunuz?',
    timestamp: '2024-02-11T10:40:00',
    isRead: true,
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Evet, bu fiyat uygun. Ne zaman görüşebiliriz?',
    timestamp: '2024-02-11T10:45:00',
    isRead: false,
  }
];

// Örnek konuşma verileri
const initialConversations = [
  {
    id: 1,
    participants: [1, 2],
    listingId: 1,
    lastMessage: 'Evet, bu fiyat uygun. Ne zaman görüşebiliriz?',
    lastMessageTimestamp: '2024-02-11T10:45:00',
    unreadCount: 1,
  }
];

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: userId }
  const typingTimeoutRef = useRef({}); // Typing timeout'ları için ref

  // Socket bağlantısını kur
  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL, {
        query: { userId: user.id }
      });

      setSocket(newSocket);

      // Socket event listeners
      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      // Yeni mesaj event listener'ı
      newSocket.on('receive_message', (newMessage) => {
        // Mesaj geldiğinde typing göstergesini kaldır
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[newMessage.conversationId];
          return updated;
        });

        // Yeni mesaj geldiğinde state'i güncelle
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, newMessage];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });

        // Konuşmayı güncelle
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv =>
            conv.id === newMessage.conversationId
              ? {
                  ...conv,
                  lastMessage: newMessage.content,
                  lastMessageTimestamp: newMessage.timestamp,
                  unreadCount: conv.unreadCount + 1,
                }
              : conv
          );
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
          return updatedConversations;
        });
      });

      // Typing event listener'ları
      newSocket.on('user_typing', ({ userId, conversationId }) => {
        setTypingUsers(prev => ({ ...prev, [conversationId]: userId }));
      });

      newSocket.on('user_stop_typing', ({ userId, conversationId }) => {
        setTypingUsers(prev => {
          const updated = { ...prev };
          if (updated[conversationId] === userId) {
            delete updated[conversationId];
          }
          return updated;
        });
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    const storedConversations = localStorage.getItem('conversations');
    
    setMessages(storedMessages ? JSON.parse(storedMessages) : initialMessages);
    setConversations(storedConversations ? JSON.parse(storedConversations) : initialConversations);
    setLoading(false);
  }, []);

  // Yeni mesaj gönderme
  const sendMessage = useCallback((conversationId, content, receiverId) => {
    return new Promise((resolve) => {
      const newMessage = {
        id: Date.now(),
        conversationId,
        senderId: user.id,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      // Mesajı socket üzerinden gönder
      if (socket) {
        socket.emit('send_message', newMessage);
      }

      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: content,
                lastMessageTimestamp: newMessage.timestamp,
              }
            : conv
        );
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        return updatedConversations;
      });

      resolve(newMessage);
    });
  }, [socket, user]);

  // Yeni konuşma başlatma
  const startConversation = (receiverId, listingId) => {
    return new Promise((resolve) => {
      const existingConversation = conversations.find(conv =>
        conv.participants.includes(user.id) &&
        conv.participants.includes(receiverId) &&
        conv.listingId === listingId
      );

      if (existingConversation) {
        resolve(existingConversation);
        return;
      }

      const newConversation = {
        id: Date.now(),
        participants: [user.id, receiverId],
        listingId,
        lastMessage: '',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0,
      };

      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations, newConversation];
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        return updatedConversations;
      });

      resolve(newConversation);
    });
  };

  // Mesajları okundu olarak işaretle
  const markAsRead = useCallback((conversationId) => {
    if (socket) {
      socket.emit('mark_as_read', { conversationId, userId: user.id });
    }

    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(message =>
        message.conversationId === conversationId && message.receiverId === user.id
          ? { ...message, isRead: true }
          : message
      );
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      );
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      return updatedConversations;
    });
  }, [socket, user]);

  // Konuşma mesajlarını getir
  const getConversationMessages = (conversationId) => {
    return messages.filter(message => message.conversationId === conversationId);
  };

  // Kullanıcının konuşmalarını getir
  const getUserConversations = () => {
    return conversations.filter(conv => conv.participants.includes(user.id));
  };

  // Okunmamış mesaj sayısını getir
  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  // Typing göstergesi için fonksiyonlar
  const emitTyping = useCallback((conversationId) => {
    if (socket) {
      socket.emit('typing', { conversationId });

      // Önceki timeout'u temizle
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      // 3 saniye sonra typing'i durdur
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        socket.emit('stop_typing', { conversationId });
      }, 3000);
    }
  }, [socket]);

  // Typing durumunu kontrol et
  const isUserTyping = useCallback((conversationId) => {
    return typingUsers[conversationId] || null;
  }, [typingUsers]);

  const value = {
    messages,
    conversations,
    loading,
    sendMessage,
    startConversation,
    markAsRead,
    getConversationMessages,
    getUserConversations,
    getUnreadCount,
    emitTyping,
    isUserTyping,
  };

  return (
    <MessageContext.Provider value={value}>
      {!loading && children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}; 