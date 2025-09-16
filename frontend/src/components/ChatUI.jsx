// src/components/ChatUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, Ellipsis } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';

// Mock data for conversations and messages
const mockConversations = [
  {
    id: 1,
    name: 'Alumni Network Group',
    type: 'group',
    lastMessage: 'Anyone attending the reunion next month?',
    timestamp: '10:30 AM',
    unread: 3,
    avatar: null,
    members: 45
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    type: 'direct',
    lastMessage: 'Thanks for the introduction!',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: null,
    online: true
  },
  {
    id: 3,
    name: 'Tech Alumni Forum',
    type: 'group',
    lastMessage: 'New job posting at Google',
    timestamp: 'Yesterday',
    unread: 12,
    avatar: null,
    members: 120
  },
  {
    id: 4,
    name: 'Michael Chen',
    type: 'direct',
    lastMessage: 'Are you free for a call tomorrow?',
    timestamp: 'Wed',
    unread: 0,
    avatar: null,
    online: false
  },
  {
    id: 5,
    name: 'Mentorship Program',
    type: 'group',
    lastMessage: 'Welcome to our new mentors!',
    timestamp: 'Tue',
    unread: 0,
    avatar: null,
    members: 28
  }
];

const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    senderName: 'Sarah Johnson',
    text: 'Hey everyone! Anyone attending the reunion next month?',
    timestamp: '10:15 AM',
    avatar: null
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 3,
    senderName: 'Michael Chen',
    text: 'I definitely will be there! Looking forward to catching up.',
    timestamp: '10:18 AM',
    avatar: null
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 4,
    senderName: 'Emily Rodriguez',
    text: 'Count me in! Has the venue been finalized?',
    timestamp: '10:20 AM',
    avatar: null
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 5,
    senderName: 'David Kim',
    text: 'Yes, it\'s at the Grand Hotel downtown. I\'ll share the details soon.',
    timestamp: '10:25 AM',
    avatar: null
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 6, // Current user
    senderName: 'You',
    text: 'Great! I\'ll be there with my family.',
    timestamp: '10:30 AM',
    avatar: null
  }
];

const mockUserInfo = {
  name: 'Alumni Network Group',
  type: 'group',
  created: 'January 15, 2023',
  description: 'A group for all alumni to stay connected and share updates.',
  members: [
    { id: 1, name: 'Sarah Johnson', role: 'Admin', online: true },
    { id: 2, name: 'Michael Chen', role: 'Member', online: true },
    { id: 3, name: 'Emily Rodriguez', role: 'Member', online: false },
    { id: 4, name: 'David Kim', role: 'Admin', online: false },
    { id: 5, name: 'You', role: 'Member', online: true }
  ],
  sharedFiles: [
    { name: 'Reunion_Invitation.pdf', size: '2.4 MB', uploadedBy: 'David Kim', date: 'Jun 12, 2023' },
    { name: 'Alumni_Directory.xlsx', size: '1.1 MB', uploadedBy: 'Sarah Johnson', date: 'May 28, 2023' }
  ],
  sharedLinks: [
    { title: 'University Alumni Website', url: 'https://alumni.university.edu', sharedBy: 'Michael Chen' },
    { title: 'Event Photos - 2022 Reunion', url: 'https://photos.university.edu/2022reunion', sharedBy: 'Emily Rodriguez' }
  ]
};

const ChatUI = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversation, setActiveConversation] = useState(1);
  const [messages, setMessages] = useState(mockMessages.filter(msg => msg.conversationId === 1));
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState(mockUserInfo);
  const messagesEndRef = useRef(null);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      conversationId: activeConversation,
      senderId: 6, // Current user
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: null
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update messages when active conversation changes
  useEffect(() => {
    setMessages(mockMessages.filter(msg => msg.conversationId === activeConversation));
    // Update user info based on conversation type
    const conversation = conversations.find(conv => conv.id === activeConversation);
    if (conversation) {
      if (conversation.type === 'group') {
        setUserInfo(mockUserInfo);
      } else {
        // For direct messages, show user profile instead of group info
        setUserInfo({
          ...mockUserInfo,
          name: conversation.name,
          type: 'direct',
          description: 'Graduated in 2015 with a degree in Computer Science. Currently working as a Senior Software Engineer at TechCorp.',
          email: 'sarah.johnson@example.com',
          location: 'San Francisco, CA',
          jobTitle: 'Senior Software Engineer',
          company: 'TechCorp'
        });
      }
    }
  }, [activeConversation, conversations]);

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 flex flex-col border-r border-medium-gray">
          <div className="p-4 border-b border-medium-gray">
            <h2 className="text-xl font-bold text-dark-blue mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredConversations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-dark-gray"
                >
                  No conversations found
                </motion.div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: '#f5f7fa' }}
                    className={`p-4 border-b border-medium-gray cursor-pointer ${
                      activeConversation === conversation.id ? 'bg-soft-blue' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {conversation.avatar ? (
                          <img 
                            src={conversation.avatar} 
                            alt={conversation.name} 
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            conversation.type === 'group' ? 'bg-medium-blue' : 'bg-soft-blue'
                          }`}>
                            <span className={`font-bold ${
                              conversation.type === 'group' ? 'text-white' : 'text-dark-blue'
                            }`}>
                              {conversation.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold truncate">{conversation.name}</h3>
                          <span className="text-xs text-dark-gray whitespace-nowrap ml-2">
                            {conversation.timestamp}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-dark-gray truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="ml-2 bg-medium-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        
                        {conversation.type === 'group' && (
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-dark-gray">
                              {conversation.members} members
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col hidden md:flex">
          {/* Chat Header */}
          <div className="p-4 border-b border-medium-gray flex items-center justify-between">
            <div className="flex items-center">
              {userInfo.type === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-medium-blue flex items-center justify-center mr-3">
                  <span className="text-white font-bold">
                    {userInfo.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-soft-blue flex items-center justify-center mr-3">
                  <span className="text-dark-blue font-bold">
                    {userInfo.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div>
                <h2 className="font-semibold">{userInfo.name}</h2>
                {userInfo.type === 'group' ? (
                  <p className="text-xs text-dark-gray">{userInfo.members.length} members</p>
                ) : (
                  <p className="text-xs text-dark-gray">Online</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {userInfo.type === 'direct' && (
                <>
                  <Button variant="ghost" size="icon">
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video size={18} />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-light-gray">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.senderId === 6 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.senderId === 6 ? 'order-2' : 'order-1'}`}>
                      {message.senderId !== 6 && (
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium text-dark-blue">
                            {message.senderName}
                          </span>
                          <span className="mx-2 text-dark-gray">•</span>
                          <span className="text-xs text-dark-gray">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.senderId === 6
                            ? 'bg-medium-blue text-white rounded-tr-none'
                            : 'bg-white text-dark-gray rounded-tl-none shadow-sm'
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                      
                      {message.senderId === 6 && (
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-dark-gray">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-medium-gray bg-white">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-dark-gray">
                <Paperclip size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-dark-gray">
                <Smile size={20} />
              </Button>
              
              <div className="flex-1 mx-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-medium-blue hover:bg-dark-blue"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* User/Group Info Panel */}
        <div className="w-80 border-l border-medium-gray flex-col hidden lg:flex">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Info size={18} className="mr-2" />
                {userInfo.type === 'group' ? 'Group Information' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-[calc(100%-5rem)]">
              {userInfo.type === 'group' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">About</h3>
                    <p className="text-sm text-dark-gray">{userInfo.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">Created</h3>
                    <p className="text-sm text-dark-gray">{userInfo.created}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-dark-blue">Members</h3>
                      <Button variant="ghost" size="sm">
                        <Ellipsis size={16} />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {userInfo.members.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <div className="relative mr-3">
                            <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center">
                              <span className="text-dark-blue text-xs font-bold">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            {member.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-dark-gray">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">Shared Files</h3>
                    <div className="space-y-2">
                      {userInfo.sharedFiles.map((file, index) => (
                        <div key={index} className="flex items-center p-2 hover:bg-soft-blue rounded-md cursor-pointer">
                          <div className="w-8 h-8 rounded bg-light-gray flex items-center justify-center mr-2">
                            <span className="text-xs text-dark-gray">PDF</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-dark-gray">
                              {file.size} • {file.uploadedBy} • {file.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">Shared Links</h3>
                    <div className="space-y-2">
                      {userInfo.sharedLinks.map((link, index) => (
                        <div key={index} className="p-2 hover:bg-soft-blue rounded-md cursor-pointer">
                          <p className="text-sm font-medium text-dark-blue truncate">{link.title}</p>
                          <p className="text-xs text-dark-gray truncate">{link.url}</p>
                          <p className="text-xs text-dark-gray mt-1">Shared by {link.sharedBy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-soft-blue flex items-center justify-center mb-3">
                      <span className="text-dark-blue text-2xl font-bold">
                        {userInfo.name.charAt(0)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-dark-blue">{userInfo.name}</h2>
                    <p className="text-dark-gray">{userInfo.jobTitle} at {userInfo.company}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">About</h3>
                    <p className="text-sm text-dark-gray">{userInfo.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-dark-blue mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-dark-gray">Email</p>
                        <p className="text-sm">{userInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dark-gray">Location</p>
                        <p className="text-sm">{userInfo.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">View Full Profile</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;