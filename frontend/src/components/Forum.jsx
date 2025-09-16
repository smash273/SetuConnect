// src/components/Forum.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Heart, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Mock forum data
const mockThreads = [
  {
    id: 1,
    title: 'Looking for software engineering mentors',
    author: 'Sarah Johnson',
    category: 'Mentorship',
    content: 'I\'m a recent graduate looking for guidance...',
    timestamp: new Date("2023-09-12T10:00:00Z"), // ✅ real date object
    likes: 24,
    comments: 12,
    liked: false,
    saved: false,
    tags: ['mentorship', 'career']
  },
  {
    id: 2,
    title: 'Alumni reunion 2023 - planning committee',
    author: 'Michael Chen',
    category: 'Events',
    content: 'We\'re forming a committee...',
    timestamp: new Date("2023-09-11T09:00:00Z"),
    likes: 45,
    comments: 28,
    liked: true,
    saved: true,
    tags: ['reunion', 'events']
  }
];

const categories = ['All', 'Mentorship', 'Events', 'Career Advice', 'Job Postings', 'Announcements'];
const sortOptions = ['Newest', 'Oldest', 'Most Liked', 'Most Commented'];

const Forum = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Filter + sort threads
  const filteredThreads = threads
    .filter(thread => {
      const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           thread.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || thread.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Oldest':
          return a.timestamp - b.timestamp;
        case 'Most Liked':
          return b.likes - a.likes;
        case 'Most Commented':
          return b.comments - a.comments;
        case 'Newest':
        default:
          return b.timestamp - a.timestamp;
      }
    });

  // Toggle like
  const toggleLikeThread = (id) => {
    setThreads(threads.map(thread =>
      thread.id === id ? { ...thread, liked: !thread.liked, likes: thread.liked ? thread.likes - 1 : thread.likes + 1 } : thread
    ));
  };

  // Toggle save
  const toggleSaveThread = (id) => {
    setThreads(threads.map(thread =>
      thread.id === id ? { ...thread, saved: !thread.saved } : thread
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Discussion Forum</h1>
          <p className="text-gray-500">Connect with alumni, share experiences, and seek advice</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> New Thread
        </Button>
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search threads..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="p-2 border rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </CardContent>
      </Card>

      {/* Thread list */}
      <div className="space-y-4">
        {filteredThreads.map(thread => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className="p-4 cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <h3 className="font-semibold text-gray-800">{thread.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{thread.content}</p>
              <div className="flex items-center gap-2 mt-2">
                {thread.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <button onClick={(e) => { e.stopPropagation(); toggleLikeThread(thread.id); }} className="flex items-center gap-1">
                  <Heart size={14} className={thread.liked ? "text-red-500 fill-red-500" : ""} />
                  {thread.likes}
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleSaveThread(thread.id); }} className="flex items-center gap-1">
                  <Bookmark size={14} className={thread.saved ? "text-blue-500 fill-blue-500" : ""} />
                  {thread.saved ? "Saved" : "Save"}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
