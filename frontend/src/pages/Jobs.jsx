import React from 'react';
import JobBoard from '../components/JobBoard';

const Jobs = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Job Board</h1>
          <p className="text-dark-gray">Discover opportunities posted by alumni and community partners</p>
        </div>
      </div>
      
      <JobBoard />
    </div>
  );
};

export default Jobs;