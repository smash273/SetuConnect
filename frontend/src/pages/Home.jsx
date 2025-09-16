import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  Heart,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProfileCard from '../components/ProfileCard';
import EventCalendar from '../components/EventCalendar';
import Forum from '../components/Forum';

// Mock data for featured alumni
const featuredAlumni = [
  {
    id: 1,
    name: 'Sarah Johnson',
    photo: null,
    graduationYear: 2015,
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    bio: 'Computer Science graduate with expertise in full-stack development and team leadership.',
    skills: ['JavaScript', 'React', 'Node.js', 'Team Leadership']
  },
  {
    id: 2,
    name: 'Michael Chen',
    photo: null,
    graduationYear: 2012,
    jobTitle: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    bio: 'Business Administration graduate with a passion for creating user-centered products.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis']
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    photo: null,
    graduationYear: 2018,
    jobTitle: 'UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
    bio: 'Design graduate specializing in creating intuitive and accessible digital experiences.',
    skills: ['UI/UX Design', 'Figma', 'User Testing', 'Prototyping']
  }
];

// Mock events data
const events = [
  {
    id: 1,
    title: 'Annual Alumni Reunion',
    date: '2023-11-15',
    time: '6:00 PM - 10:00 PM',
    location: 'Grand Hotel, Downtown',
    attendees: 120
  },
  {
    id: 2,
    title: 'Career Fair 2023',
    date: '2023-10-22',
    time: '10:00 AM - 4:00 PM',
    location: 'University Campus',
    attendees: 300
  },
  {
    id: 3,
    title: 'Tech Industry Panel',
    date: '2023-10-30',
    time: '5:30 PM - 7:30 PM',
    location: 'Virtual Event',
    attendees: 85
  }
];

// Mock forum threads
const forumThreads = [
  {
    id: 1,
    title: 'Looking for software engineering mentors',
    author: 'Sarah Johnson',
    authorAvatar: null,
    category: 'Mentorship',
    content: 'I\'m a recent graduate looking for guidance in starting my career in software engineering. Would appreciate any advice or mentorship opportunities!',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 12,
    liked: false,
    saved: false,
    tags: ['mentorship', 'software-engineering', 'career-advice']
  },
  {
    id: 2,
    title: 'Alumni reunion 2023 - planning committee',
    author: 'Michael Chen',
    authorAvatar: null,
    category: 'Events',
    content: 'We\'re forming a committee to plan the 2023 alumni reunion. If you\'re interested in helping organize, please comment below!',
    timestamp: '1 day ago',
    likes: 45,
    comments: 28,
    liked: true,
    saved: true,
    tags: ['reunion', 'events', 'volunteer']
  }
];

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-soft-blue to-white rounded-xl p-8 md:p-12"
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Welcome to SetuConnect
          </h1>
          <p className="text-lg text-dark-gray mb-6">
            Connect with fellow alumni, discover opportunities, and give back to your alma mater community.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-medium-blue hover:bg-dark-blue">
              <Link to="/alumni">Explore Alumni Network</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">5,000+</h3>
            <p className="text-sm text-dark-gray">Active Alumni</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Calendar className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">50+</h3>
            <p className="text-sm text-dark-gray">Annual Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Briefcase className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">200+</h3>
            <p className="text-sm text-dark-gray">Job Opportunities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Heart className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">$1M+</h3>
            <p className="text-sm text-dark-gray">Funds Raised</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Alumni */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-blue">Featured Alumni</h2>
          <Button variant="outline" asChild>
            <Link to="/alumni">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAlumni.map((alumni) => (
            <ProfileCard key={alumni.id} alumni={alumni} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-blue">Upcoming Events</h2>
          <Button variant="outline" asChild>
            <Link to="/events">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border border-medium-gray overflow-hidden shadow-sm"
            >
              <div className="h-2 bg-gradient-to-r from-soft-blue to-medium-blue"></div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-dark-blue mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-dark-gray">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-dark-gray">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-dark-gray">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-dark-gray">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <Button className="w-full">Register Now</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Forum Highlights */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-blue">Popular Discussions</h2>
          <Button variant="outline" asChild>
            <Link to="/alumni">
              View Forum <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forumThreads.map((thread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-soft-blue flex items-center justify-center mr-3">
                    <span className="text-dark-blue font-bold">
                      {thread.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-blue mb-1">{thread.title}</h3>
                    <div className="flex items-center text-sm text-dark-gray mb-2">
                      <span>{thread.author}</span>
                      <span className="mx-2">•</span>
                      <span>{thread.timestamp}</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-0.5 bg-soft-blue text-dark-blue rounded-full text-xs">
                        {thread.category}
                      </span>
                    </div>
                    <p className="text-sm text-dark-gray line-clamp-2 mb-3">
                      {thread.content}
                    </p>
                    <div className="flex items-center text-sm text-dark-gray">
                      <div className="flex items-center mr-4">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>{thread.comments} comments</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="mr-1 h-4 w-4" />
                        <span>{thread.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-dark-blue mb-6">Get Involved</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-medium-blue" />
              </div>
              <h3 className="font-semibold text-dark-blue mb-1">Mentorship</h3>
              <p className="text-sm text-dark-gray">Become a mentor or find one</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-medium-blue" />
              </div>
              <h3 className="font-semibold text-dark-blue mb-1">Job Board</h3>
              <p className="text-sm text-dark-gray">Find or post job opportunities</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-medium-blue" />
              </div>
              <h3 className="font-semibold text-dark-blue mb-1">Donate</h3>
              <p className="text-sm text-dark-gray">Support your alma mater</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-medium-blue" />
              </div>
              <h3 className="font-semibold text-dark-blue mb-1">Resources</h3>
              <p className="text-sm text-dark-gray">Access exclusive content</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;