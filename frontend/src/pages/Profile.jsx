import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Save, X, Camera, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Mock user data
const mockUser = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  graduationYear: 2018,
  degree: 'B.S. Computer Science',
  jobTitle: 'Software Engineer',
  company: 'TechCorp',
  bio: 'Computer Science graduate passionate about web development and creating user-friendly applications. Always looking to learn new technologies and contribute to open-source projects.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design'],
  linkedinUrl: 'https://linkedin.com/in/alexjohnson',
  twitterUrl: 'https://twitter.com/alexjohnson',
  websiteUrl: 'https://alexjohnson.dev',
  photo: null,
  interests: ['Web Development', 'Open Source', 'Photography', 'Hiking'],
  privacy: {
    showEmail: true,
    showPhone: false,
    showBio: true
  }
};

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'privacy', 'settings'

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  // Handle skills change
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditedUser({
      ...editedUser,
      skills
    });
  };

  // Handle interests change
  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(',').map(interest => interest.trim()).filter(interest => interest);
    setEditedUser({
      ...editedUser,
      interests
    });
  };

  // Save profile changes
  const saveProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // Handle privacy settings change
  const handlePrivacyChange = (setting) => {
    setEditedUser({
      ...editedUser,
      privacy: {
        ...editedUser.privacy,
        [setting]: !editedUser.privacy[setting]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">My Profile</h1>
          <p className="text-dark-gray">Manage your personal information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={cancelEditing}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={saveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-medium-gray">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'profile' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'privacy' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Settings
          </button>
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'settings' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Account Settings
          </button>
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-soft-blue flex items-center justify-center">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-dark-blue text-4xl font-bold">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 rounded-full bg-medium-blue hover:bg-dark-blue"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="w-full space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-blue mb-1">Full Name</label>
                        <Input
                          type="text"
                          name="name"
                          value={editedUser.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-blue mb-1">Headline</label>
                        <Input
                          type="text"
                          name="jobTitle"
                          value={editedUser.jobTitle}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-blue mb-1">Company</label>
                        <Input
                          type="text"
                          name="company"
                          value={editedUser.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-dark-blue">{user.name}</h2>
                      <p className="text-dark-gray">{user.jobTitle}</p>
                      <p className="text-dark-gray">{user.company}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-blue mb-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
                          <Input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-blue mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
                          <Input
                            type="text"
                            name="phone"
                            value={editedUser.phone}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
                        <Input
                          type="text"
                          name="location"
                          value={editedUser.location}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 text-dark-gray" />
                      <div>
                        <p className="text-sm text-dark-gray">Email</p>
                        <p className="text-dark-blue">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="mr-3 h-5 w-5 text-dark-gray" />
                      <div>
                        <p className="text-sm text-dark-gray">Phone</p>
                        <p className="text-dark-blue">{user.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="mr-3 h-5 w-5 text-dark-gray" />
                      <div>
                        <p className="text-sm text-dark-gray">Location</p>
                        <p className="text-dark-blue">{user.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-dark-gray" />
                      <div>
                        <p className="text-sm text-dark-gray">Class Of</p>
                        <p className="text-dark-blue">{user.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">Degree</label>
                      <Input
                        type="text"
                        name="degree"
                        value={editedUser.degree}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">Graduation Year</label>
                      <Input
                        type="number"
                        name="graduationYear"
                        value={editedUser.graduationYear}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-soft-blue flex items-center justify-center mr-3">
                      <span className="text-dark-blue font-bold">
                        {user.graduationYear.toString().slice(-2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-blue">{user.degree}</p>
                      <p className="text-sm text-dark-gray">Class of {user.graduationYear}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">Bio</label>
                    <textarea
                      className="w-full p-2 border border-medium-gray rounded-md min-h-[100px]"
                      name="bio"
                      value={editedUser.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                ) : (
                  <p className="text-dark-gray">{user.bio}</p>
                )}
              </CardContent>
            </Card>
            
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Skills (comma separated)
                    </label>
                    <Input
                      type="text"
                      value={editedUser.skills.join(', ')}
                      onChange={handleSkillsChange}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-soft-blue text-dark-blue rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Interests (comma separated)
                    </label>
                    <Input
                      type="text"
                      value={editedUser.interests.join(', ')}
                      onChange={handleInterestsChange}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-light-gray text-dark-gray rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">LinkedIn</label>
                      <Input
                        type="text"
                        name="linkedinUrl"
                        value={editedUser.linkedinUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">Twitter</label>
                      <Input
                        type="text"
                        name="twitterUrl"
                        value={editedUser.twitterUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-blue mb-1">Website</label>
                      <Input
                        type="text"
                        name="websiteUrl"
                        value={editedUser.websiteUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.linkedinUrl && (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center mr-2">
                          <span className="text-dark-blue text-xs font-bold">in</span>
                        </div>
                        <a 
                          href={user.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-medium-blue hover:text-dark-blue text-sm"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                    
                    {user.twitterUrl && (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center mr-2">
                          <span className="text-dark-blue text-xs font-bold">tw</span>
                        </div>
                        <a 
                          href={user.twitterUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-medium-blue hover:text-dark-blue text-sm"
                        >
                          Twitter
                        </a>
                      </div>
                    )}
                    
                    {user.websiteUrl && (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center mr-2">
                          <span className="text-dark-blue text-xs font-bold">web</span>
                        </div>
                        <a 
                          href={user.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-medium-blue hover:text-dark-blue text-sm"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Privacy Settings Tab */}
      {activeTab === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-dark-blue">Show Email Address</h3>
                <p className="text-sm text-dark-gray">Allow other alumni to see your email address</p>
              </div>
              <div className="relative inline-block w-10 h-6">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={editedUser.privacy.showEmail}
                  onChange={() => handlePrivacyChange('showEmail')}
                />
                <div 
                  className={`block w-10 h-6 rounded-full transition-colors ${
                    editedUser.privacy.showEmail ? 'bg-medium-blue' : 'bg-gray-300'
                  }`}
                  onClick={() => handlePrivacyChange('showEmail')}
                >
                  <div 
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      editedUser.privacy.showEmail ? 'transform translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-dark-blue">Show Phone Number</h3>
                <p className="text-sm text-dark-gray">Allow other alumni to see your phone number</p>
              </div>
              <div className="relative inline-block w-10 h-6">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={editedUser.privacy.showPhone}
                  onChange={() => handlePrivacyChange('showPhone')}
                />
                <div 
                  className={`block w-10 h-6 rounded-full transition-colors ${
                    editedUser.privacy.showPhone ? 'bg-medium-blue' : 'bg-gray-300'
                  }`}
                  onClick={() => handlePrivacyChange('showPhone')}
                >
                  <div 
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      editedUser.privacy.showPhone ? 'transform translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-dark-blue">Show Bio</h3>
                <p className="text-sm text-dark-gray">Display your bio on your public profile</p>
              </div>
              <div className="relative inline-block w-10 h-6">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={editedUser.privacy.showBio}
                  onChange={() => handlePrivacyChange('showBio')}
                />
                <div 
                  className={`block w-10 h-6 rounded-full transition-colors ${
                    editedUser.privacy.showBio ? 'bg-medium-blue' : 'bg-gray-300'
                  }`}
                  onClick={() => handlePrivacyChange('showBio')}
                >
                  <div 
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      editedUser.privacy.showBio ? 'transform translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={saveProfile}>
                Save Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Current Password</label>
                <Input type="password" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">New Password</label>
                <Input type="password" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Confirm New Password</label>
                <Input type="password" />
              </div>
              
              <Button>Update Password</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-dark-blue">Event Updates</h3>
                  <p className="text-sm text-dark-gray">Get notified about upcoming events</p>
                </div>
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="block w-10 h-6 rounded-full bg-medium-blue">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-dark-blue">Job Opportunities</h3>
                  <p className="text-sm text-dark-gray">Receive notifications about new job postings</p>
                </div>
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="block w-10 h-6 rounded-full bg-medium-blue">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-dark-blue">Mentorship Requests</h3>
                  <p className="text-sm text-dark-gray">Get notified about mentorship opportunities</p>
                </div>
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" className="sr-only" />
                  <div className="block w-10 h-6 rounded-full bg-gray-300">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-dark-blue">Fundraising Campaigns</h3>
                  <p className="text-sm text-dark-gray">Receive updates about fundraising campaigns</p>
                </div>
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="block w-10 h-6 rounded-full bg-medium-blue">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                  </div>
                </div>
              </div>
              
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-gray mb-4">
                Download a copy of all your data from SetuConnect, including your profile information, activity history, and connections.
              </p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Export My Data
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-gray mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;