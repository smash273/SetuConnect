import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Search, Filter, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import EventCalendar from '../components/EventCalendar';

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Annual Alumni Reunion',
    description: 'Join us for our biggest alumni event of the year! Reconnect with old friends, network with fellow graduates, and celebrate our alma mater.',
    date: '2023-11-15',
    time: '6:00 PM - 10:00 PM',
    location: 'Grand Hotel, Downtown',
    attendees: 120,
    maxAttendees: 200,
    category: 'Social',
    image: null,
    organizer: 'Alumni Association',
    registrationRequired: true,
    registered: false,
    featured: true
  },
  {
    id: 2,
    title: 'Career Fair 2023',
    description: 'Connect with top employers looking to hire our talented alumni. Bring your resume and network with industry leaders.',
    date: '2023-10-22',
    time: '10:00 AM - 4:00 PM',
    location: 'University Campus, Student Center',
    attendees: 300,
    maxAttendees: 500,
    category: 'Career',
    image: null,
    organizer: 'Career Services',
    registrationRequired: true,
    registered: true,
    featured: true
  },
  {
    id: 3,
    title: 'Tech Industry Panel',
    description: 'Hear from successful alumni working in the tech industry. Panel discussion on career paths and industry trends.',
    date: '2023-10-30',
    time: '5:30 PM - 7:30 PM',
    location: 'Virtual Event',
    attendees: 85,
    maxAttendees: 200,
    category: 'Professional Development',
    image: null,
    organizer: 'Computer Science Department',
    registrationRequired: true,
    registered: false,
    featured: false
  },
  {
    id: 4,
    title: 'Homecoming Game Watch Party',
    description: 'Cheer on our team at the annual homecoming game watch party. Food and drinks provided.',
    date: '2023-10-14',
    time: '3:00 PM - 7:00 PM',
    location: 'Sports Bar, Downtown',
    attendees: 75,
    maxAttendees: 100,
    category: 'Social',
    image: null,
    organizer: 'Athletics Department',
    registrationRequired: false,
    registered: false,
    featured: false
  },
  {
    id: 5,
    title: 'Fundraising Gala',
    description: 'Annual fundraising gala to support scholarships and campus improvements. Formal attire required.',
    date: '2023-12-05',
    time: '7:00 PM - 11:00 PM',
    location: 'Grand Ballroom, City Center',
    attendees: 150,
    maxAttendees: 200,
    category: 'Fundraising',
    image: null,
    organizer: 'Development Office',
    registrationRequired: true,
    registered: false,
    featured: true
  },
  {
    id: 6,
    title: 'Alumni Mentorship Program Kickoff',
    description: 'Launch event for our new mentorship program connecting current students with alumni mentors.',
    date: '2023-11-01',
    time: '6:00 PM - 8:00 PM',
    location: 'University Campus, Alumni Hall',
    attendees: 60,
    maxAttendees: 100,
    category: 'Mentorship',
    image: null,
    organizer: 'Alumni Relations',
    registrationRequired: true,
    registered: true,
    featured: false
  }
];

const eventCategories = ['All', 'Social', 'Career', 'Professional Development', 'Fundraising', 'Mentorship'];

const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  // Filter events based on search term and category
  useEffect(() => {
    let result = events;
    
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(event => event.category === selectedCategory);
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, selectedCategory]);

  // Toggle registration for an event
  const toggleRegistration = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, registered: !event.registered } : event
    ));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  // Create new event
  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData,
      attendees: 0,
      registered: false,
      featured: false
    };
    
    setEvents([newEvent, ...events]);
    setShowNewEventForm(false);
    setSelectedEvent(newEvent);
  };

  // Get featured events
  const featuredEvents = events.filter(event => event.featured);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Events</h1>
          <p className="text-dark-gray">Discover and join events organized by the alumni community</p>
        </div>
        <Button 
          className="bg-medium-blue hover:bg-dark-blue"
          onClick={() => setShowNewEventForm(true)}
        >
          <Plus size={16} className="mr-2" />
          Create Event
        </Button>
      </div>

      {/* New Event Form */}
      {showNewEventForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Event Title</label>
                <Input 
                  type="text" 
                  placeholder="Enter event title" 
                  id="event-title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border border-medium-gray rounded-md min-h-[100px]"
                  placeholder="Describe your event"
                  id="event-description"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-blue mb-1">Date</label>
                  <Input 
                    type="date" 
                    id="event-date"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-blue mb-1">Time</label>
                  <Input 
                    type="text" 
                    placeholder="e.g., 6:00 PM - 10:00 PM" 
                    id="event-time"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Location</label>
                <Input 
                  type="text" 
                  placeholder="Enter event location" 
                  id="event-location"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-blue mb-1">Category</label>
                  <select 
                    className="w-full p-2 border border-medium-gray rounded-md"
                    id="event-category"
                  >
                    <option value="">Select a category</option>
                    {eventCategories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-blue mb-1">Max Attendees</label>
                  <Input 
                    type="number" 
                    placeholder="Maximum number of attendees" 
                    id="event-max-attendees"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="event-registration"
                  className="mr-2"
                />
                <label htmlFor="event-registration" className="text-sm text-dark-gray">
                  Registration required
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewEventForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    const title = document.getElementById('event-title').value;
                    const description = document.getElementById('event-description').value;
                    const date = document.getElementById('event-date').value;
                    const time = document.getElementById('event-time').value;
                    const location = document.getElementById('event-location').value;
                    const category = document.getElementById('event-category').value;
                    const maxAttendees = document.getElementById('event-max-attendees').value;
                    const registrationRequired = document.getElementById('event-registration').checked;
                    
                    if (title && description && date && time && location && category) {
                      handleCreateEvent({
                        title,
                        description,
                        date,
                        time,
                        location,
                        category,
                        maxAttendees: parseInt(maxAttendees) || 100,
                        registrationRequired,
                        organizer: 'You'
                      });
                    }
                  }}
                >
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-dark-blue mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-medium-gray overflow-hidden shadow-sm"
              >
                <div className="h-2 bg-gradient-to-r from-soft-blue to-medium-blue"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-dark-blue">{event.title}</h3>
                    <span className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-dark-gray">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-dark-gray">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-dark-gray">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-dark-gray">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{event.attendees} attending</span>
                      {event.maxAttendees && (
                        <span className="ml-1">({event.maxAttendees} max)</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-dark-gray line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-dark-gray">
                      Organized by {event.organizer}
                    </span>
                    <Button 
                      size="sm"
                      variant={event.registered ? "outline" : "default"}
                      onClick={() => toggleRegistration(event.id)}
                    >
                      {event.registered ? 'Registered' : 'Register'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Event Calendar */}
      <section>
        <h2 className="text-2xl font-bold text-dark-blue mb-6">Event Calendar</h2>
        <EventCalendar events={events} />
      </section>

      {/* All Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-blue">All Events</h2>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="p-2 border border-medium-gray rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {eventCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Event Listings */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-dark-blue mb-2">No events found</h3>
              <p className="text-dark-gray mb-4">Try adjusting your search or filters</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full cursor-pointer" onClick={() => setSelectedEvent(event)}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <span className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-dark-gray">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-dark-gray">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-dark-gray">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-dark-gray">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{event.attendees} attending</span>
                        {event.maxAttendees && (
                          <span className="ml-1">({event.maxAttendees} max)</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-dark-gray line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-dark-gray">
                        {event.organizer}
                      </span>
                      <Button 
                        size="sm"
                        variant={event.registered ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRegistration(event.id);
                        }}
                      >
                        {event.registered ? 'Registered' : 'Register'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;