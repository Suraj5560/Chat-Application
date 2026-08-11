import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../lib/axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function ChatProvider({ children }) {
  const { authUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const socketRef = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  // Keep ref in sync with state
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Connect Socket.IO when user is authenticated
  useEffect(() => {
    if (!authUser?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      query: { userId: authUser._id },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('getOnlineUsers', (userIds) => {
      setOnlineUsers(userIds);
    });

    socket.on('newMessage', (message) => {
      setMessages((prev) => {
        // Avoid duplicate
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      // Update unseen count if not in this conversation
      setUnseenMessages((prev) => {
        const currentSelectedUser = selectedUserRef.current;
        if (currentSelectedUser && message.senderId === currentSelectedUser._id) return prev;
        return {
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        };
      });
    });



    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser?._id]);

  // Fetch sidebar users
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const { data } = await axiosInstance.get('/api/message/sidebar-users');
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenmessages || {});
      }
    } catch (err) {
      console.error('fetchUsers error:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Fetch messages for selected user
  const fetchMessages = useCallback(async (userId) => {
    setIsLoadingMessages(true);
    try {
      const { data } = await axiosInstance.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        // Clear unseen count for this user
        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    } catch (err) {
      console.error('fetchMessages error:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Select a user & load messages
  const selectUser = useCallback(async (user) => {
    setSelectedUser(user);
    setMessages([]);
    if (user) {
      await fetchMessages(user._id);
    }
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (text, image) => {
    if (!selectedUser) return;
    try {
      const { data } = await axiosInstance.post(`/api/message/${selectedUser._id}`, { text, image });
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
      return data;
    } catch (err) {
      console.error('sendMessage error:', err);
      throw err;
    }
  }, [selectedUser]);

  // Pin/Unpin chat
  const pinChat = useCallback(async (userId) => {
    try {
      await axiosInstance.put(`/api/message/pin/${userId}`);
      await fetchUsers(); // Refresh sidebar to resort
    } catch (err) {
      console.error('pinChat error:', err);
    }
  }, [fetchUsers]);

  // Delete chat conversation
  const deleteChat = useCallback(async (userId) => {
    try {
      await axiosInstance.delete(`/api/message/conversation/${userId}`);
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
        setMessages([]);
      }
      await fetchUsers(); // Refresh sidebar to remove user
    } catch (err) {
      console.error('deleteChat error:', err);
    }
  }, [selectedUser, fetchUsers]);

  // Load users when auth user changes
  useEffect(() => {
    if (authUser) fetchUsers();
    else {
      setUsers([]);
      setSelectedUser(null);
      setMessages([]);
    }
  }, [authUser, fetchUsers]);

  return (
    <ChatContext.Provider value={{
      users,
      selectedUser,
      messages,
      onlineUsers,
      unseenMessages,
      isLoadingUsers,
      isLoadingMessages,
      fetchUsers,
      selectUser,
      sendMessage,
      pinChat,
      deleteChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
