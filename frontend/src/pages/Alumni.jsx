import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, Mail, Phone, Calendar, Users, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProfileCard from '../components/ProfileCard';

// Mock alumni data
const mockAlumni = [
  {
    id: 1,
    name: 'Sarah Johnson',
    photo: null,
    graduationYear: 2015,
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    bio: 'Computer Science graduate with expertise in full-stack development and team leadership. Passionate about creating scalable web applications and mentoring junior developers.',
    skills: ['JavaScript', 'React', 'Node.js', 'Team Leadership', 'Agile'],
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    industry: 'Technology',
    degree: 'B.S. Computer Science'
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
    bio: 'Business Administration graduate with a passion for creating user-centered products. Experienced in leading cross-functional teams and launching successful products.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Leadership'],
    email: 'michael.chen@example.com',
    phone: '(555) 987-6543',
    industry: 'Technology',
    degree: 'MBA Business Administration'
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
    bio: 'Design graduate specializing in creating intuitive and accessible digital experiences. Advocate for user-centered design principles and inclusive design practices.',
    skills: ['UI/UX Design', 'Figma', 'User Testing', 'Prototyping', 'Accessibility'],
    email: 'emily.rodriguez@example.com',
    phone: '(555) 456-7890',
    industry: 'Design',
    degree: 'B.A. Design'
  },
  {
    id: 4,
    name: 'David Kim',
    photo: null,
    graduationYear: 2010,
    jobTitle: 'Marketing Director',
    company: 'GrowthHackers',
    location: 'Los Angeles, CA',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    bio: 'Marketing graduate with over a decade of experience in digital marketing and brand strategy. Led successful campaigns for Fortune 500 companies.',
    skills: ['Digital Marketing', 'Brand Strategy', 'SEO/SEM', 'Content Marketing', 'Analytics'],
    email: 'david.kim@example.com',
    phone: '(555) 234-5678',
    industry: 'Marketing',
    degree: 'B.S. Marketing'
  },
  {
    id: 5,
    name: 'Jessica Williams',
    photo: null,
    graduationYear: 2016,
    jobTitle: 'Financial Analyst',
    company: 'FinanceCorp',
    location: 'Chicago, IL',
    linkedinUrl: 'https://linkedin.com/in/jessicawilliams',
    bio: 'Finance graduate specializing in investment analysis and financial planning. CFA charterholder with expertise in risk management and portfolio optimization.',
    skills: ['Financial Analysis', 'Investment Strategy', 'Risk Management', 'Excel', 'Financial Modeling'],
    email: 'jessica.williams@example.com',
    phone: '(555) 345-6789',
    industry: 'Finance',
    degree: 'B.S. Finance'
  },
  {
    id: 6,
    name: 'Robert Taylor',
    photo: null,
    graduationYear: 2013,
    jobTitle: 'Operations Manager',
    company: 'LogiTech',
    location: 'Seattle, WA',
    linkedinUrl: 'https://linkedin.com/in/roberttaylor',
    bio: 'Supply Chain Management graduate with experience in optimizing operations and logistics for tech companies. Passionate about sustainable business practices.',
    skills: ['Operations Management', 'Supply Chain', 'Process Improvement', 'Six Sigma', 'Sustainability'],
    email: 'robert.taylor@example.com',
    phone: '(555) 567-8901',
    industry: 'Operations',
    degree: 'B.S. Supply Chain Management'
  }
];

const graduationYears = ['All', '2010-2014', '2015-2019', '2020-Present'];
const industries = ['All', 'Technology', 'Finance', 'Marketing', 'Design', 'Operations', 'Healthcare', 'Education'];
const locations = ['All', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Los Angeles, CA', 'Chicago, IL', 'Seattle, WA', 'Remote'];

const Alumni = () => {
  const [alumni, setAlumni] = useState(mockAlumni);
  const [filteredAlumni, setFilteredAlumni] = useState(mockAlumni);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // Filter alumni based on search term and filters
  useEffect(() => {
    let result = alumni;
    
    if (searchTerm) {
      result = result.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedYear !== 'All') {
      if (selectedYear === '2010-2014') {
        result = result.filter(person => person.graduationYear >= 2010 && person.graduationYear <= 2014);
      } else if (selectedYear === '2015-2019') {
        result = result.filter(person => person.graduationYear >= 2015 && person.graduationYear <= 2019);
      } else if (selectedYear === '2020-Present') {
        result = result.filter(person => person.graduationYear >= 2020);
      }
    }
    
    if (selectedIndustry !== 'All') {
      result = result.filter(person => person.industry === selectedIndustry);
    }
    
    if (selectedLocation !== 'All') {
      result = result.filter(person => person.location === selectedLocation);
    }
    
    setFilteredAlumni(result);
  }, [alumni, searchTerm, selectedYear, selectedIndustry, selectedLocation]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear('All');
    setSelectedIndustry('All');
    setSelectedLocation('All');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Alumni Directory</h1>
          <p className="text-dark-gray">Connect with fellow alumni from around the world</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button className="bg-medium-blue hover:bg-dark-blue">
            Update Your Profile
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
              <Input
                type="text"
                placeholder="Search alumni by name, company, or skills..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-dark-blue mb-2">Graduation Year</h3>
                  <div className="flex flex-wrap gap-2">
                    {graduationYears.map(year => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedYear(year)}
                        className={selectedYear === year ? "bg-medium-blue" : ""}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-dark-blue mb-2">Industry</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(industry => (
                      <Button
                        key={industry}
                        variant={selectedIndustry === industry ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedIndustry(industry)}
                        className={selectedIndustry === industry ? "bg-medium-blue" : ""}
                      >
                        {industry}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-dark-blue mb-2">Location</h3>
                  <div className="flex flex-wrap gap-2">
                    {locations.map(location => (
                      <Button
                        key={location}
                        variant={selectedLocation === location ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLocation(location)}
                        className={selectedLocation === location ? "bg-medium-blue" : ""}
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Alumni Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${selectedAlumni ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'}`}>
          {filteredAlumni.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">No alumni found</h3>
                <p className="text-dark-gray mb-4">Try adjusting your search or filters</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredAlumni.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'list' ? "flex items-center p-4 bg-white rounded-lg border border-medium-gray" : ""}
                  onClick={() => setSelectedAlumni(person)}
                >
                  {viewMode === 'grid' ? (
                    <ProfileCard alumni={person} />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-soft-blue flex items-center justify-center mr-4 flex-shrink-0">
                        {person.photo ? (
                          <img src={person.photo} alt={person.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-dark-blue font-bold">
                            {person.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark-blue">{person.name}</h3>
                        <p className="text-sm text-dark-gray">{person.jobTitle} at {person.company}</p>
                        <div className="flex items-center text-sm text-dark-gray mt-1">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>Class of {person.graduationYear}</span>
                        </div>
                        <div className="flex items-center text-sm text-dark-gray">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{person.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full mb-2">
                          {person.industry}
                        </span>
                        <Button size="sm">View Profile</Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Alumni Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedAlumni ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-soft-blue flex items-center justify-center mb-4">
                      {selectedAlumni.photo ? (
                        <img src={selectedAlumni.photo} alt={selectedAlumni.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-dark-blue text-2xl font-bold">
                          {selectedAlumni.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl text-center">{selectedAlumni.name}</CardTitle>
                    <p className="text-dark-gray text-center">{selectedAlumni.jobTitle}</p>
                    <p className="text-dark-gray text-center">{selectedAlumni.company}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-dark-gray" />
                        <span className="text-sm">{selectedAlumni.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-dark-gray" />
                        <span className="text-sm">{selectedAlumni.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-dark-gray" />
                        <span className="text-sm">{selectedAlumni.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Education</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-dark-gray" />
                        <span className="text-sm">Class of {selectedAlumni.graduationYear}</span>
                      </div>
                      <div className="text-sm">{selectedAlumni.degree}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Professional</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-dark-gray" />
                        <span className="text-sm">{selectedAlumni.industry}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedAlumni.skills.map((skill, index) => (
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
                    <h4 className="font-medium text-dark-blue mb-2">Bio</h4>
                    <p className="text-sm text-dark-gray">
                      {selectedAlumni.bio}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-2">
                    <Button className="bg-medium-blue hover:bg-dark-blue">
                      Send Message
                    </Button>
                    <Button variant="outline">
                      Connect on LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="sticky top-24">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">Alumni Details</h3>
                <p className="text-dark-gray">Select an alumni to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alumni;