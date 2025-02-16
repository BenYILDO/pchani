import React, { useState, useEffect, useRef } from 'react';
import { useMessage } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Box,
  Divider,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

function Messages() {
  const { user } = useAuth();
  const {
    getUserConversations,
    getConversationMessages,
    sendMessage,
    markAsRead,
    emitTyping,
    isUserTyping,
  } = useMessage();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userConversations = getUserConversations();
    setConversations(userConversations);
  }, [getUserConversations]);

  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = getConversationMessages(selectedConversation.id);
      setMessages(conversationMessages);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, getConversationMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    if (selectedConversation) {
      emitTyping(selectedConversation.id);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const receiverId = selectedConversation.participants.find(id => id !== user.id);
    sendMessage(selectedConversation.id, newMessage, receiverId).then(() => {
      setNewMessage('');
      const updatedMessages = getConversationMessages(selectedConversation.id);
      setMessages(updatedMessages);
    });
  };

  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: tr });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Mesajlar
            </Typography>
            <List sx={{ height: 'calc(100% - 56px)', overflow: 'auto' }}>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: selectedConversation?.id === conversation.id ? 'action.selected' : 'inherit',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color={conversation.unreadCount > 0 ? 'primary' : 'default'}
                    >
                      <Avatar>
                        {conversation.participants.find(id => id !== user.id).toString()[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Kullanıcı ${conversation.participants.find(id => id !== user.id)}`}
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          fontWeight: conversation.unreadCount > 0 ? 700 : 400,
                        }}
                      >
                        {conversation.lastMessage || 'Henüz mesaj yok'}
                      </Typography>
                    }
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {formatMessageTime(conversation.lastMessageTimestamp)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Messages */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Messages Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    Kullanıcı {selectedConversation.participants.find(id => id !== user.id)}
                  </Typography>
                </Box>

                {/* Messages List */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === user.id ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: message.senderId === user.id ? 'primary.main' : 'background.paper',
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {formatMessageTime(message.timestamp)}
                          {message.senderId === user.id && (
                            <CircleIcon
                              sx={{
                                ml: 0.5,
                                fontSize: 12,
                                color: message.isRead ? 'success.main' : 'text.secondary',
                              }}
                            />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  {/* Typing Indicator */}
                  {selectedConversation && isUserTyping(selectedConversation.id) && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        ml: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Yazıyor...
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            ml: 1,
                            '& > span': {
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: 'text.secondary',
                              mx: 0.25,
                              animation: 'typing 1s infinite',
                              '&:nth-of-type(2)': {
                                animationDelay: '0.2s',
                              },
                              '&:nth-of-type(3)': {
                                animationDelay: '0.4s',
                              },
                              '@keyframes typing': {
                                '0%, 100%': {
                                  opacity: 0.4,
                                },
                                '50%': {
                                  opacity: 1,
                                },
                              },
                            },
                          }}
                        >
                          <span />
                          <span />
                          <span />
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <form onSubmit={handleSendMessage}>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder="Mesajınızı yazın..."
                          value={newMessage}
                          onChange={handleMessageChange}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          type="submit"
                          color="primary"
                          disabled={!newMessage.trim()}
                        >
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Bir konuşma seçin
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Messages; 