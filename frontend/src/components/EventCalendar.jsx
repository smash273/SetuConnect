// src/components/EventCalendar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const EventCalendar = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation functions
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  // Get upcoming events (next 30 days)
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Event Calendar
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setView('calendar')} className={view === 'calendar' ? 'bg-soft-blue' : ''}>
                Calendar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView('list')} className={view === 'list' ? 'bg-soft-blue' : ''}>
                List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'calendar' ? (
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-dark-gray py-2">
                      {day}
                    </div>
                  ))}
                  
                  {daysInMonth.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          min-h-24 p-1 border rounded-md cursor-pointer transition-colors
                          ${isCurrentMonth ? 'bg-white' : 'bg-light-gray text-dark-gray'}
                          ${isSelected ? 'border-medium-blue border-2' : 'border-medium-gray'}
                          ${isToday ? 'bg-soft-blue' : ''}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-right text-sm font-medium p-1">
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="text-xs p-1 rounded truncate bg-medium-blue text-white"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-center text-dark-gray">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">All Events</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-center text-dark-gray py-8">No events scheduled</p>
                  ) : (
                    events
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 border border-medium-gray rounded-lg hover:bg-soft-blue cursor-pointer"
                          onClick={() => setSelectedDate(parseISO(event.date))}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <span className="text-sm text-dark-gray">
                              {format(parseISO(event.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-dark-gray mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{event.time}</span>
                          </div>
                        </motion.div>
                      ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events for Selected Date & Upcoming Events */}
      <div className="space-y-6">
        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Events on {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              <AnimatePresence>
                {eventsForSelectedDate.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-dark-gray py-4"
                  >
                    No events scheduled for this day
                  </motion.p>
                ) : (
                  eventsForSelectedDate.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-medium-gray rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-dark-blue">{event.title}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-dark-gray">
                          <Clock size={14} className="mr-2" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-dark-gray">
                            <MapPin size={14} className="mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && (
                          <div className="flex items-center text-sm text-dark-gray">
                            <Users size={14} className="mr-2" />
                            <span>{event.attendees} attending</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {upcomingEvents.length === 0 ? (
                <p className="text-center text-dark-gray py-4">No upcoming events</p>
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-2 hover:bg-soft-blue rounded-lg cursor-pointer"
                    onClick={() => {
                      setSelectedDate(parseISO(event.date));
                      setView('calendar');
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-medium-blue flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-bold">
                        {format(parseISO(event.date), 'MMM')}
                      </span>
                      <span className="text-lg font-bold">
                        {format(parseISO(event.date), 'd')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-dark-blue">{event.title}</h4>
                      <div className="flex items-center text-xs text-dark-gray mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventCalendar;