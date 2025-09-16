// API utility functions for SetuConnect

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';



// Generic request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };

  try {
    const response = await fetch(url, config);

    // Try to parse JSON safely
    let data = null;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text }; // fallback if not valid JSON
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};


// Authentication API
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
  refreshToken: () => 
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),
  
  forgotPassword: (email) => 
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  resetPassword: (token, password) => 
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  
  verifyEmail: (token) => 
    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// User API
export const userAPI = {
  getProfile: () => 
    apiRequest('/users/profile'),
  
  updateProfile: (userData) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  uploadProfilePhoto: (formData) => 
    apiRequest('/users/profile/photo', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for multipart/form-data
    }),
  
  updatePrivacySettings: (settings) => 
    apiRequest('/users/privacy', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  
  getNotificationPreferences: () => 
    apiRequest('/users/notifications/preferences'),
  
  updateNotificationPreferences: (preferences) => 
    apiRequest('/users/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }),
  
  exportUserData: () => 
    apiRequest('/users/export', {
      method: 'GET',
      responseType: 'blob',
    }),
  
  deleteAccount: () => 
    apiRequest('/users/account', {
      method: 'DELETE',
    }),
};

// Alumni API
export const alumniAPI = {
  getAlumni: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/alumni?${queryParams}`);
  },
  
  getAlumniById: (id) => 
    apiRequest(`/alumni/${id}`),
  
  updateAlumniProfile: (id, profileData) => 
    apiRequest(`/alumni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  
  searchAlumni: (query) => 
    apiRequest(`/alumni/search?q=${encodeURIComponent(query)}`),
  
  getFeaturedAlumni: () => 
    apiRequest('/alumni/featured'),
};

// Events API
export const eventsAPI = {
  getEvents: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/events?${queryParams}`);
  },
  
  getEventById: (id) => 
    apiRequest(`/events/${id}`),
  
  createEvent: (eventData) => 
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  
  updateEvent: (id, eventData) => 
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
  
  deleteEvent: (id) => 
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
    }),
  
  registerForEvent: (id) => 
    apiRequest(`/events/${id}/register`, {
      method: 'POST',
    }),
  
  unregisterFromEvent: (id) => 
    apiRequest(`/events/${id}/unregister`, {
      method: 'POST',
    }),
  
  getEventAttendees: (id) => 
    apiRequest(`/events/${id}/attendees`),
  
  getUpcomingEvents: () => 
    apiRequest('/events/upcoming'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/jobs?${queryParams}`);
  },
  
  getJobById: (id) => 
    apiRequest(`/jobs/${id}`),
  
  createJob: (jobData) => 
    apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
  
  updateJob: (id, jobData) => 
    apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }),
  
  deleteJob: (id) => 
    apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    }),
  
  applyToJob: (id, applicationData) => 
    apiRequest(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),
  
  saveJob: (id) => 
    apiRequest(`/jobs/${id}/save`, {
      method: 'POST',
    }),
  
  unsaveJob: (id) => 
    apiRequest(`/jobs/${id}/unsave`, {
      method: 'POST',
    }),
  
  getSavedJobs: () => 
    apiRequest('/jobs/saved'),
  
  getJobApplications: () => 
    apiRequest('/jobs/applications'),
};

// Mentorship API
export const mentorshipAPI = {
  getMentors: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/mentorship/mentors?${queryParams}`);
  },
  
  getMentorById: (id) => 
    apiRequest(`/mentorship/mentors/${id}`),
  
  becomeMentor: (mentorData) => 
    apiRequest('/mentorship/become-mentor', {
      method: 'POST',
      body: JSON.stringify(mentorData),
    }),
  
  updateMentorProfile: (id, mentorData) => 
    apiRequest(`/mentorship/mentors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mentorData),
    }),
  
  requestMentorship: (mentorId, requestData) => 
    apiRequest(`/mentorship/mentors/${mentorId}/request`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
  
  respondToMentorshipRequest: (requestId, response) => 
    apiRequest(`/mentorship/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response),
    }),
  
  getMentorshipRequests: () => 
    apiRequest('/mentorship/requests'),
  
  getMentorshipConnections: () => 
    apiRequest('/mentorship/connections'),
  
  scheduleMeeting: (connectionId, meetingData) => 
    apiRequest(`/mentorship/connections/${connectionId}/meetings`, {
      method: 'POST',
      body: JSON.stringify(meetingData),
    }),
};

// Fundraising API
export const fundraisingAPI = {
  getCampaigns: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/fundraising/campaigns?${queryParams}`);
  },
  
  getCampaignById: (id) => 
    apiRequest(`/fundraising/campaigns/${id}`),
  
  createCampaign: (campaignData) => 
    apiRequest('/fundraising/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),
  
  updateCampaign: (id, campaignData) => 
    apiRequest(`/fundraising/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    }),
  
  deleteCampaign: (id) => 
    apiRequest(`/fundraising/campaigns/${id}`, {
      method: 'DELETE',
    }),
  
  donateToCampaign: (id, donationData) => 
    apiRequest(`/fundraising/campaigns/${id}/donate`, {
      method: 'POST',
      body: JSON.stringify(donationData),
    }),
  
  getDonationHistory: () => 
    apiRequest('/fundraising/donations'),
  
  getFeaturedCampaigns: () => 
    apiRequest('/fundraising/campaigns/featured'),
};

// Forum API
export const forumAPI = {
  getThreads: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/forum/threads?${queryParams}`);
  },
  
  getThreadById: (id) => 
    apiRequest(`/forum/threads/${id}`),
  
  createThread: (threadData) => 
    apiRequest('/forum/threads', {
      method: 'POST',
      body: JSON.stringify(threadData),
    }),
  
  updateThread: (id, threadData) => 
    apiRequest(`/forum/threads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(threadData),
    }),
  
  deleteThread: (id) => 
    apiRequest(`/forum/threads/${id}`, {
      method: 'DELETE',
    }),
  
  getComments: (threadId) => 
    apiRequest(`/forum/threads/${threadId}/comments`),
  
  createComment: (threadId, commentData) => 
    apiRequest(`/forum/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
  
  updateComment: (threadId, commentId, commentData) => 
    apiRequest(`/forum/threads/${threadId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    }),
  
  deleteComment: (threadId, commentId) => 
    apiRequest(`/forum/threads/${threadId}/comments/${commentId}`, {
      method: 'DELETE',
    }),
  
  likeThread: (id) => 
    apiRequest(`/forum/threads/${id}/like`, {
      method: 'POST',
    }),
  
  unlikeThread: (id) => 
    apiRequest(`/forum/threads/${id}/unlike`, {
      method: 'POST',
    }),
  
  likeComment: (threadId, commentId) => 
    apiRequest(`/forum/threads/${threadId}/comments/${commentId}/like`, {
      method: 'POST',
    }),
  
  unlikeComment: (threadId, commentId) => 
    apiRequest(`/forum/threads/${threadId}/comments/${commentId}/unlike`, {
      method: 'POST',
    }),
  
  saveThread: (id) => 
    apiRequest(`/forum/threads/${id}/save`, {
      method: 'POST',
    }),
  
  unsaveThread: (id) => 
    apiRequest(`/forum/threads/${id}/unsave`, {
      method: 'POST',
    }),
  
  getSavedThreads: () => 
    apiRequest('/forum/threads/saved'),
};

// Messaging API
export const messagingAPI = {
  getConversations: () => 
    apiRequest('/messaging/conversations'),
  
  getConversation: (id) => 
    apiRequest(`/messaging/conversations/${id}`),
  
  createConversation: (participantIds) => 
    apiRequest('/messaging/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantIds }),
    }),
  
  getMessages: (conversationId) => 
    apiRequest(`/messaging/conversations/${conversationId}/messages`),
  
  sendMessage: (conversationId, messageData) => 
    apiRequest(`/messaging/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
  
  markMessagesAsRead: (conversationId) => 
    apiRequest(`/messaging/conversations/${conversationId}/read`, {
      method: 'POST',
    }),
  
  deleteMessage: (conversationId, messageId) => 
    apiRequest(`/messaging/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
    }),
  
  getUnreadCount: () => 
    apiRequest('/messaging/unread-count'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => 
    apiRequest('/admin/dashboard'),
  
  getUsers: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/users?${queryParams}`);
  },
  
  getUserById: (id) => 
    apiRequest(`/admin/users/${id}`),
  
  updateUser: (id, userData) => 
    apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  deleteUser: (id) => 
    apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
  
  getEvents: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/events?${queryParams}`);
  },
  
  approveEvent: (id) => 
    apiRequest(`/admin/events/${id}/approve`, {
      method: 'POST',
    }),
  
  rejectEvent: (id, reason) => 
    apiRequest(`/admin/events/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  
  getJobs: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/jobs?${queryParams}`);
  },
  
  approveJob: (id) => 
    apiRequest(`/admin/jobs/${id}/approve`, {
      method: 'POST',
    }),
  
  rejectJob: (id, reason) => 
    apiRequest(`/admin/jobs/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  
  getForumReports: () => 
    apiRequest('/admin/forum/reports'),
  
  resolveForumReport: (reportId, action) => 
    apiRequest(`/admin/forum/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(action),
    }),
  
  getAnalytics: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/analytics?${queryParams}`);
  },
  
  getSystemSettings: () => 
    apiRequest('/admin/settings'),
  
  updateSystemSettings: (settings) => 
    apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  
  sendNotification: (notificationData) => 
    apiRequest('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => 
    apiRequest('/notifications'),
  
  markAsRead: (id) => 
    apiRequest(`/notifications/${id}/read`, {
      method: 'POST',
    }),
  
  markAllAsRead: () => 
    apiRequest('/notifications/read-all', {
      method: 'POST',
    }),
  
  deleteNotification: (id) => 
    apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    }),
};

// Search API
export const searchAPI = {
  globalSearch: (query) => 
    apiRequest(`/search?q=${encodeURIComponent(query)}`),
  
  searchAlumni: (query) => 
    apiRequest(`/search/alumni?q=${encodeURIComponent(query)}`),
  
  searchEvents: (query) => 
    apiRequest(`/search/events?q=${encodeURIComponent(query)}`),
  
  searchJobs: (query) => 
    apiRequest(`/search/jobs?q=${encodeURIComponent(query)}`),
  
  searchForum: (query) => 
    apiRequest(`/search/forum?q=${encodeURIComponent(query)}`),
};