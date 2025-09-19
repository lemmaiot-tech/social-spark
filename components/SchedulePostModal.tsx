import React, { useState, useEffect } from 'react';
import { PostSuggestion, SavedPost } from '../types';
import ClockIcon from './icons/ClockIcon';

interface SchedulePostModalProps {
  post: PostSuggestion | SavedPost;
  onSchedule: (post: PostSuggestion | SavedPost, date: string | null) => void;
  onCancel: () => void;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ post, onSchedule, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const isEditing = post && 'id' in post;

  useEffect(() => {
    // Check if we are editing an existing post that has a scheduled date
    if (isEditing && (post as SavedPost).scheduledFor) {
        const scheduledDate = new Date((post as SavedPost).scheduledFor!);
        
        // Use local time components for the input fields
        const year = scheduledDate.getFullYear();
        const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
        const day = String(scheduledDate.getDate()).padStart(2, '0');
        
        const hours = String(scheduledDate.getHours()).padStart(2, '0');
        const minutes = String(scheduledDate.getMinutes()).padStart(2, '0');
        
        setSelectedDate(`${year}-${month}-${day}`);
        setSelectedTime(`${hours}:${minutes}`);
    } else {
        // Default for new posts or unscheduled drafts: use today's local date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
        setSelectedTime('10:00');
    }
  }, [post, isEditing]);


  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      // Combines local date and time from inputs, then converts to a full ISO string (in UTC) for storage
      const localDateTime = new Date(`${selectedDate}T${selectedTime}`);
      onSchedule(post, localDateTime.toISOString());
    }
  };

  const handleSaveAsDraft = () => {
    onSchedule(post, null);
  };
  
  const todayFormatted = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];


  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/10 mb-4">
               <ClockIcon />
            </div>
            <h3 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Schedule' : 'Schedule Post'}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">When would you like to publish this content?</p>
        </div>

        <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700/50 dark:border-gray-600">
            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 italic">"{post.caption}"</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publish Date
                </label>
                <input
                    type="date"
                    id="schedule-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={todayFormatted}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
            </div>
            <div className="flex-1 sm:max-w-[150px]">
                 <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publish Time
                </label>
                <input
                    type="time"
                    id="schedule-time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
                type="button"
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="w-full sm:w-auto flex-1 px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {isEditing ? 'Update Schedule' : 'Schedule'}
            </button>
             <button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-full sm:w-auto flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
                {isEditing ? 'Unschedule (Save as Draft)' : 'Save as Draft'}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePostModal;