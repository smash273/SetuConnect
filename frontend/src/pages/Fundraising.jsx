import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Users, Calendar, TrendingUp, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Fundraising from '../components/Fundraising';

// Mock campaigns data
const mockCampaigns = [
  {
    id: 1,
    title: 'Annual Scholarship Fund',
    description: 'Help us provide scholarships to deserving students who need financial support to pursue their education.',
    goal: 100000,
    raised: 75000,
    donors: 245,
    endDate: '2023-12-31',
    image: null,
    category: 'Scholarships',
    featured: true
  },
  {
    id: 2,
    title: 'Campus Library Renovation',
    description: 'Support the renovation and modernization of our campus library to create a better learning environment for students.',
    goal: 250000,
    raised: 120000,
    donors: 178,
    endDate: '2024-03-31',
    image: null,
    category: 'Facilities',
    featured: true
  },
  {
    id: 3,
    title: 'Research Innovation Fund',
    description: 'Contribute to cutting-edge research initiatives that address global challenges and create new knowledge.',
    goal: 150000,
    raised: 45000,
    donors: 92,
    endDate: '2023-11-30',
    image: null,
    category: 'Research',
    featured: false
  },
  {
    id: 4,
    title: 'Athletics Program Enhancement',
    description: 'Help us upgrade our athletics facilities and provide better resources for our student-athletes.',
    goal: 80000,
    raised: 35000,
    donors: 67,
    endDate: '2024-01-15',
    image: null,
    category: 'Athletics',
    featured: false
  }
];

// Mock donation history
const mockDonationHistory = [
  {
    id: 1,
    campaign: 'Annual Scholarship Fund',
    date: '2023-09-15',
    amount: 500,
    status: 'Completed'
  },
  {
    id: 2,
    campaign: 'Campus Library Renovation',
    date: '2023-08-22',
    amount: 250,
    status: 'Completed'
  },
  {
    id: 3,
    campaign: 'Research Innovation Fund',
    date: '2023-07-10',
    amount: 100,
    status: 'Completed'
  }
];

const FundraisingPage = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [donationHistory, setDonationHistory] = useState(mockDonationHistory);
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' or 'history'
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);

  // Calculate total statistics
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalGoal = campaigns.reduce((sum, campaign) => sum + campaign.goal, 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donors, 0);

  // Handle donation
  const handleDonate = () => {
    if (!donationAmount || !selectedCampaign) return;
    
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    // Update campaign raised amount
    setCampaigns(campaigns.map(campaign => 
      campaign.id === selectedCampaign.id 
        ? { 
            ...campaign, 
            raised: campaign.raised + amount, 
            donors: campaign.donors + 1 
          } 
        : campaign
    ));
    
    // Add to donation history
    const newDonation = {
      id: donationHistory.length + 1,
      campaign: selectedCampaign.title,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      status: 'Completed'
    };
    
    setDonationHistory([newDonation, ...donationHistory]);
    
    // Reset form
    setDonationAmount('');
    setShowDonationForm(false);
    setSelectedCampaign(null);
    
    alert(`Thank you for your donation of $${amount.toFixed(2)} to ${selectedCampaign.title}!`);
  };

  // Get featured campaigns
  const featuredCampaigns = campaigns.filter(campaign => campaign.featured);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Fundraising</h1>
          <p className="text-dark-gray">Support our mission and make a difference in the lives of students</p>
        </div>
        <Button className="bg-medium-blue hover:bg-dark-blue">
          Start a Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <DollarSign className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">
              ${(totalRaised / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm text-dark-gray">Total Raised</p>
            <div className="mt-2 text-xs text-dark-gray">
              ${(totalGoal / 1000).toFixed(0)}K goal
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">{totalDonors}</h3>
            <p className="text-sm text-dark-gray">Total Donors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Target className="h-8 w-8 text-medium-blue mb-2" />
            <h3 className="text-2xl font-bold text-dark-blue">{campaigns.length}</h3>
            <p className="text-sm text-dark-gray">Active Campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-dark-blue mb-6">Featured Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-medium-gray overflow-hidden shadow-sm"
              >
                <div className="h-2 bg-gradient-to-r from-soft-blue to-medium-blue"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-dark-blue">{campaign.title}</h3>
                    <span className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full">
                      {campaign.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-dark-gray mb-4">
                    {campaign.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-dark-gray mb-1">
                      <span>Raised: ${campaign.raised.toLocaleString()}</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2.5">
                      <div 
                        className="bg-medium-blue h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-dark-gray mt-1">
                      <span>{campaign.donors} donors</span>
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-dark-gray">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Ends {campaign.endDate}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowDonationForm(true);
                      }}
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="border-b border-medium-gray">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'campaigns' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('campaigns')}
          >
            All Campaigns
          </button>
          <button
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'history' 
                ? 'border-medium-blue text-dark-blue' 
                : 'border-transparent text-dark-gray hover:text-dark-blue hover:border-medium-gray'
            }`}
            onClick={() => setActiveTab('history')}
          >
            My Donation History
          </button>
        </nav>
      </div>

      {/* Donation Form */}
      {showDonationForm && selectedCampaign && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-dark-blue mb-1">Campaign</h3>
                <p className="text-dark-gray">{selectedCampaign.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Donation Amount ($)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[25, 50, 100, 250, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setDonationAmount(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">Payment Information</label>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Card Number"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="MM/YY"
                    />
                    <Input
                      type="text"
                      placeholder="CVV"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Name on Card"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="anonymous"
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-sm text-dark-gray">
                  Make this donation anonymous
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDonationForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDonate}>
                  Donate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <span className="px-2 py-1 bg-soft-blue text-dark-blue text-xs rounded-full">
                      {campaign.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-dark-gray mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-dark-gray mb-1">
                      <span>Raised: ${campaign.raised.toLocaleString()}</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2.5">
                      <div 
                        className="bg-medium-blue h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-dark-gray mt-1">
                      <span>{campaign.donors} donors</span>
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-dark-gray">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Ends {campaign.endDate}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowDonationForm(true);
                      }}
                    >
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Donation History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {donationHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-dark-blue mb-2">No donation history</h3>
                <p className="text-dark-gray mb-4">You haven't made any donations yet</p>
                <Button onClick={() => setActiveTab('campaigns')}>
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {donationHistory.map((donation) => (
                <Card key={donation.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-dark-blue">{donation.campaign}</h3>
                        <div className="flex items-center text-sm text-dark-gray mt-1">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{donation.date}</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                            <span>{donation.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-dark-blue">${donation.amount}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Receipt
                        </Button>
                      </div>
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

export default FundraisingPage;