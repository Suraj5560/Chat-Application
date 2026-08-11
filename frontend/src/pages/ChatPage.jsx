import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/chat.css';

function ChatPage() {
  return (
    <motion.div
      className="chat-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar />
      <ChatWindow />
    </motion.div>
  );
}

export default ChatPage;
