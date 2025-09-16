import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserPlus, MessageSquare, Calendar, Briefcase, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Mock mentors data
const mockMentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    photo: null,
    graduationYear: 2015,
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    bio: 'Computer Science graduate with expertise in full-stack development and team leadership. Passionate about mentoring junior developers.',
    expertise: ['Software Engineering', 'Career Development', 'Team Leadership', 'Web Development'],
    mentorshipAreas: ['Career Guidance', 'Technical Skills', 'Industry Insights'],
    availability: 'Weekday Evenings',
    rating: 4.8,
    reviews: 24,
    maxMentees: 3,
    currentMentees: 2
  },
  {
    id: 2,
    name: 'Michael Chen',
    photo: null,
    graduationYear: 2012,
    jobTitle: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    bio: 'Business Administration graduate with a passion for creating user-centered products. Experienced in leading cross-functional teams.',
    expertise: ['Product Management', 'User Research', 'Agile Methodologies', 'Go-to-Market Strategy'],
    mentorshipAreas: ['Product Strategy', 'Career Transitions', 'Leadership Skills'],
    availability: 'Flexible',
    rating: 4.9,
    reviews: 32,
    maxMentees: 4,
    currentMentees: 3
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    photo: null,
    graduationYear: 2018,
    jobTitle: 'UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    bio: 'Design graduate specializing in creating intuitive and accessible digital experiences. Advocate for user-centered design principles.',
    expertise: ['UI/UX Design', 'User Research', 'Prototyping', 'Design Systems'],
    mentorshipAreas: ['Portfolio Development', 'Design Skills', 'Career Advice'],
    availability: 'Weekends',
    rating: 4.7,
    reviews: 18,
    maxMentees: 2,
    currentMentees: 1
  },
  {
    id: 4,
    name: 'David Kim',
    photo: null,
    graduationYear: 2010,
    jobTitle: 'Marketing Director',
    company: 'GrowthHackers',
    location: 'Los Angeles, CA',
    bio: 'Marketing graduate with over a decade of experience in digital marketing and brand strategy. Led successful campaigns for Fortune 500 companies.',
    expertise: ['Digital Marketing', 'Brand Strategy', 'SEO/SEM', 'Content Marketing'],
    mentorshipAreas: ['Marketing Strategy', 'Career Growth', 'Leadership'],
    availability: 'Weekday Afternoons',
    rating: 4.6,
    reviews: 21,
    maxMentees: 3,
    currentMentees: 2
  },
  {
    id: 5,
    name: 'Jessica Williams',
    photo: null,
    graduationYear: 2016,
    jobTitle: 'Financial Analyst',
    company: 'FinanceCorp',
    location: 'Chicago, IL',
    bio: 'Finance graduate specializing in investment analysis and financial planning. CFA charterholder with expertise in risk management.',
    expertise: ['Financial Analysis', 'Investment Strategy', 'Risk Management', 'Financial Planning'],
    mentorshipAreas: ['Finance Careers', 'Certification Guidance', 'Industry Insights'],
    availability: 'Flexible',
    rating: 4.9,
    reviews: 27,
    maxMentees: 2,
    currentMentees: 1
  }
];

// Mock mentorship requests data
const mockRequests = [
  {
    id: 1,
    mentorName: 'Sarah Johnson',
    mentorId: 1,
    status: 'pending',
    message: 'I would love to learn more about software engineering best practices and career growth in tech.',
    date: '2023-10-05'
  },
  {
    id: 2,
    mentorName: 'Michael Chen',
    mentorId: 2,
    status: 'accepted',
    message: 'Interested in transitioning from engineering to product management. Would appreciate your guidance.',
    date: '2023-09-28'
  },
  {
    id: 3,
    mentorName: 'Emily Rodriguez',
    mentorId: 3,
    status: 'declined',
    message: 'Looking for mentorship to improve my UX design portfolio.',
    date: '2023-09-15'
  }
];

const mentorshipAreas = ['All', 'Career Guidance', 'Technical Skills', 'Leadership', 'Industry Insights', 'Portfolio Development'];
const availabilityOptions = ['All', 'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekends', 'Flexible'];

const Mentorship = () => {
  const [mentors, setMentors] = useState(mockMentors);
  const [filteredMentors, setFilteredMentors] = useState(mockMentors);
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'requests'
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Filter mentors based on search term and filters
  useEffect(() => {
    let result = mentors;
    
    if (searchTerm) {
      result = result.filter(mentor => 
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedArea !== 'All') {
      result = result.filter(mentor => 
        mentor.mentorshipAreas.includes(selectedArea)
      );
    }
    
    if (selectedAvailability !== 'All') {
      result = result.filter(mentor => 
        mentor.availability === selectedAvailability
      );
    }
    
    setFilteredMentors(result);
  }, [mentors, searchTerm, selectedArea, selectedAvailability]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('All');
    setSelectedAvailability('All');
  };

  // Send mentorship request
  const sendRequest = (mentorId) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (mentor && mentor.currentMentees < mentor.maxMentees) {
      const newRequest = {
        id: requests.length + 1,
        mentorName: mentor.name,
        mentorId: mentorId,
        status: 'pending',
        message: 'I would like to request your mentorship.',
        date: new Date().toISOString().split('T')[0]
      };
      
      setRequests([newRequest, ...requests]);
      
      // Update mentor's current mentees count
      setMentors(mentors.map(m => 
        m.id === mentorId ? { ...m, currentMentees: m.currentMentees + 1 } : m
      ));
      
      alert(`Mentorship request sent to ${mentor.name}!`);
    } else {
      alert('This mentor has reached their maximum number of mentees.');
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-dark-gray">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Mentorship Program</h1>
          <p className="text-dark-gray">Connect with experienced alumni who can guide your career journey</p>
        </div>
        <Button className="bg-medium-blue hover:bg-dark-blue">
          Become a Mentor
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-medium-gray">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'find' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('find')}
          >
            Find a Mentor
          </button>
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'requests' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests
          </button>
        </nav>
      </div>

      {/* Find a Mentor Tab */}
      {activeTab === 'find' && (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
                  <Input
                    type="text"
                    placeholder="Search mentors by name, expertise, or company..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center"
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
              </div>
              
              {/* Filter Options */}
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-medium-gray"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-dark-blue mb-2">Mentorship Area</h3>
                      <div className="flex flex-wrap gap-2">
                        {mentorshipAreas.map(area => (
                          <Button
                            key={area}
                            variant={selectedArea === area ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedArea(area)}
                            className={selectedArea === area ? "bg-medium-blue" : ""}
                          >
                            {area}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-dark-blue mb-2">Availability</h3>
                      <div className="flex flex-wrap gap-2">
                        {availabilityOptions.map(option => (
                          <Button
                            key={option}
                            variant={selectedAvailability === option ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedAvailability(option)}
                            className={selectedAvailability === option ? "bg-medium-blue" : ""}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${selectedMentor ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'}`}>
              {filteredMentors.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-medium text-dark-blue mb-2">No mentors found</h3>
                    <p className="text-dark-gray mb-4">Try adjusting your search or filters</p>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.map((mentor) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="h-full cursor-pointer" onClick={() => setSelectedMentor(mentor)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mr-3">
                              {mentor.photo ? (
                                <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <span className="text-dark-blue font-bold">
                                  {mentor.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{mentor.name}</CardTitle>
                              <p className="text-sm text-dark-gray">{mentor.jobTitle}</p>
                              <p className="text-sm text-dark-gray">{mentor.company}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-dark-gray">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{mentor.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-dark-gray">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Class of {mentor.graduationYear}</span>
                            </div>
                            <div className="flex items-center text-sm text-dark-gray">
                              <Briefcase className="mr-2 h-4 w-4" />
                              <span>{mentor.availability}</span>
                            </div>
                            
                            <div>
                              {renderRating(mentor.rating)}
                              <span className="text-xs text-dark-gray ml-2">({mentor.reviews} reviews)</span>
                            </div>
                            
                            <div className="text-sm">
                              <span className="text-dark-gray">
                                {mentor.currentMentees} of {mentor.maxMentees} mentees
                              </span>
                              <div className="w-full bg-light-gray rounded-full h-2 mt-1">
                                <div 
                                  className="bg-medium-blue h-2 rounded-full" 
                                  style={{ width: `${(mentor.currentMentees / mentor.maxMentees) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-dark-blue mb-2">Areas of Mentorship</h4>
                            <div className="flex flex-wrap gap-1">
                              {mentor.mentorshipAreas.slice(0, 3).map((area, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full"
                                >
                                  {area}
                                </span>
                              ))}
                              {mentor.mentorshipAreas.length > 3 && (
                                <span className="px-2 py-1 bg-light-gray text-dark-gray text-xs rounded-full">
                                  +{mentor.mentorshipAreas.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            disabled={mentor.currentMentees >= mentor.maxMentees}
                            onClick={(e) => {
                              e.stopPropagation();
                              sendRequest(mentor.id);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {mentor.currentMentees >= mentor.maxMentees ? 'At Capacity' : 'Request Mentorship'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mentor Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedMentor ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="sticky top-24">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-soft-blue flex items-center justify-center mb-4">
                          {selectedMentor.photo ? (
                            <img src={selectedMentor.photo} alt={selectedMentor.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <span className="text-dark-blue text-2xl font-bold">
                              {selectedMentor.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl text-center">{selectedMentor.name}</CardTitle>
                        <p className="text-dark-gray text-center">{selectedMentor.jobTitle}</p>
                        <p className="text-dark-gray text-center">{selectedMentor.company}</p>
                        
                        <div className="mt-2">
                          {renderRating(selectedMentor.rating)}
                          <span className="text-xs text-dark-gray ml-2">({selectedMentor.reviews} reviews)</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-dark-blue mb-2">About</h4>
                        <p className="text-sm text-dark-gray">
                          {selectedMentor.bio}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-dark-blue mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMentor.expertise.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-dark-blue mb-2">Mentorship Areas</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMentor.mentorshipAreas.map((area, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-dark-blue mb-2">Availability</h4>
                        <p className="text-sm text-dark-gray">{selectedMentor.availability}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-dark-blue mb-2">Mentorship Capacity</h4>
                        <div className="text-sm">
                          <span className="text-dark-gray">
                            {selectedMentor.currentMentees} of {selectedMentor.maxMentees} mentees
                          </span>
                          <div className="w-full bg-light-gray rounded-full h-2 mt-1">
                            <div 
                              className="bg-medium-blue h-2 rounded-full" 
                              style={{ width: `${(selectedMentor.currentMentees / selectedMentor.maxMentees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex flex-col gap-2">
                        <Button 
                          className="bg-medium-blue hover:bg-dark-blue"
                          disabled={selectedMentor.currentMentees >= selectedMentor.maxMentees}
                          onClick={() => sendRequest(selectedMentor.id)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {selectedMentor.currentMentees >= selectedMentor.maxMentees ? 'At Capacity' : 'Request Mentorship'}
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="sticky top-24">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-medium text-dark-blue mb-2">Mentor Details</h3>
                    <p className="text-dark-gray">Select a mentor to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      {/* My Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">No mentorship requests</h3>
                <p className="text-dark-gray mb-4">You haven't sent any mentorship requests yet</p>
                <Button onClick={() => setActiveTab('find')}>
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-dark-blue">Mentorship Request</h3>
                        <p className="text-dark-gray">Mentor: {request.mentorName}</p>
                        <p className="text-sm text-dark-gray mt-1">Sent on {request.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-light-gray rounded-md">
                      <p className="text-sm text-dark-gray">{request.message}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Cancel Request
                        </Button>
                      )}
                      {request.status === 'accepted' && (
                        <Button size="sm">
                          Schedule Meeting
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mentorship;