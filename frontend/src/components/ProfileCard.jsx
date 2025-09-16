// src/components/ProfileCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ProfileCard = ({ alumni, className }) => {
  const {
    id,
    name,
    photo,
    graduationYear,
    jobTitle,
    company,
    location,
    linkedinUrl,
    bio,
    skills
  } = alumni;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Cover background */}
            <div className="h-24 bg-gradient-to-r from-soft-blue to-medium-blue"></div>
            
            {/* Profile picture */}
            <div className="absolute -bottom-12 left-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
                {photo ? (
                  <img 
                    src={photo} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-medium-blue flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-14 px-4 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-dark-blue">{name}</h3>
                <div className="flex items-center text-sm text-dark-gray mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>Class of {graduationYear}</span>
                </div>
              </div>
              
              {linkedinUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-medium-blue hover:text-dark-blue"
                  >
                    <Linkedin size={20} />
                  </a>
                </Button>
              )}
            </div>
            
            <div className="mt-3 space-y-2">
              {jobTitle && (
                <div className="flex items-center text-sm">
                  <Briefcase size={14} className="mr-2 text-dark-gray" />
                  <span className="text-dark-gray">
                    {jobTitle} {company && `at ${company}`}
                  </span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center text-sm">
                  <MapPin size={14} className="mr-2 text-dark-gray" />
                  <span className="text-dark-gray">{location}</span>
                </div>
              )}
            </div>
            
            {bio && (
              <p className="mt-3 text-sm text-dark-gray line-clamp-2">
                {bio}
              </p>
            )}
            
            {skills && skills.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span className="px-2 py-1 bg-light-gray text-dark-gray text-xs rounded-full">
                      +{skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              <Button size="sm" className="flex-1">
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;