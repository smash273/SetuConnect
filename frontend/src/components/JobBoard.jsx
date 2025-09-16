// src/components/JobBoard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2 days ago',
    description: 'We are looking for an experienced software engineer to join our team...',
    requirements: ['5+ years of experience', 'React expertise', 'Bachelor\'s degree'],
    logo: null,
    saved: false
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    posted: '1 week ago',
    description: 'Seeking a product manager to lead our new product initiatives...',
    requirements: ['3+ years in product management', 'Agile methodology', 'MBA preferred'],
    logo: null,
    saved: true
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Contract',
    salary: '$80,000 - $100,000',
    posted: '3 days ago',
    description: 'Join our design team to create amazing user experiences...',
    requirements: ['Portfolio required', 'Figma proficiency', '3+ years experience'],
    logo: null,
    saved: false
  },
  {
    id: 4,
    title: 'Data Analyst',
    company: 'DataInsights',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$70,000 - $90,000',
    posted: '1 day ago',
    description: 'Looking for a data analyst to help us derive insights from complex datasets...',
    requirements: ['SQL expertise', 'Python/R knowledge', 'Visualization skills'],
    logo: null,
    saved: false
  },
  {
    id: 5,
    title: 'Marketing Intern',
    company: 'GrowthHackers',
    location: 'Boston, MA',
    type: 'Internship',
    salary: '$20 - $25 per hour',
    posted: '5 days ago',
    description: 'Exciting opportunity for a marketing student to gain real-world experience...',
    requirements: ['Currently enrolled', 'Social media knowledge', 'Creative thinking'],
    logo: null,
    saved: false
  }
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

const JobBoard = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter jobs based on search term and filters
  useEffect(() => {
    let result = jobs;
    
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'All') {
      result = result.filter(job => 
        job.type === selectedType || (selectedType === 'Remote' && job.location === 'Remote')
      );
    }
    
    // This is a simplified filter - in a real app, experience level would be a job property
    if (selectedExperience !== 'All') {
      // For demo purposes, we'll just filter based on job title
      if (selectedExperience === 'Entry Level') {
        result = result.filter(job => job.title.includes('Intern') || job.title.includes('Junior'));
      } else if (selectedExperience === 'Senior Level') {
        result = result.filter(job => job.title.includes('Senior'));
      } else if (selectedExperience === 'Executive') {
        result = result.filter(job => job.title.includes('Manager') || job.title.includes('Director'));
      }
    }
    
    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedType, selectedExperience]);

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedExperience('All');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Job Board</h1>
          <p className="text-dark-gray">Discover opportunities posted by alumni and community partners</p>
        </div>
        <Button className="bg-medium-blue hover:bg-dark-blue">
          Post a Job
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-gray" size={18} />
              <Input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
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
                  <h3 className="text-sm font-medium text-dark-blue mb-2">Job Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map(type => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className={selectedType === type ? "bg-medium-blue" : ""}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-dark-blue mb-2">Experience Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map(level => (
                      <Button
                        key={level}
                        variant={selectedExperience === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedExperience(level)}
                        className={selectedExperience === level ? "bg-medium-blue" : ""}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">No jobs found</h3>
                <p className="text-dark-gray mb-4">Try adjusting your search or filters</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`h-full cursor-pointer ${selectedJob?.id === job.id ? 'border-medium-blue border-2' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-lg bg-soft-blue flex items-center justify-center mr-4">
                          {job.logo ? (
                            <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-dark-blue font-bold">
                              {job.company.charAt(0)}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-lg text-dark-blue">{job.title}</h3>
                          <p className="text-dark-gray">{job.company}</p>
                          
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center text-sm text-dark-gray">
                              <MapPin size={14} className="mr-1" />
                              <span>{job.location}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-dark-gray">
                              <Briefcase size={14} className="mr-1" />
                              <span>{job.type}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-dark-gray">
                              <DollarSign size={14} className="mr-1" />
                              <span>{job.salary}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-dark-gray">
                              <Clock size={14} className="mr-1" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                      >
                        <Bookmark 
                          size={20} 
                          className={job.saved ? 'fill-medium-blue text-medium-blue' : 'text-dark-gray'} 
                        />
                      </Button>
                    </div>
                    
                    <p className="mt-3 text-sm text-dark-gray line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-light-gray text-dark-gray text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-light-gray text-dark-gray text-xs rounded-full">
                          +{job.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Job Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-soft-blue flex items-center justify-center mr-3">
                      {selectedJob.logo ? (
                        <img src={selectedJob.logo} alt={selectedJob.company} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-dark-blue font-bold">
                          {selectedJob.company.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedJob.company}</p>
                      <p className="text-sm text-dark-gray">{selectedJob.location}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Job Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-dark-gray">Employment Type</span>
                        <span className="text-sm">{selectedJob.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-dark-gray">Salary</span>
                        <span className="text-sm">{selectedJob.salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-dark-gray">Posted</span>
                        <span className="text-sm">{selectedJob.posted}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Description</h4>
                    <p className="text-sm text-dark-gray">
                      {selectedJob.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-blue mb-2">Requirements</h4>
                    <ul className="text-sm text-dark-gray space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-medium-blue mr-2">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-2">
                    <Button className="bg-medium-blue hover:bg-dark-blue">
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toggleSaveJob(selectedJob.id)}
                    >
                      {selectedJob.saved ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="sticky top-24">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">Job Details</h3>
                <p className="text-dark-gray">Select a job to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;