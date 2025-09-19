import React, { useState, useMemo } from 'react';
import { SavedPost, Platform } from '../types';
import CalendarIcon from './icons/CalendarIcon';

interface ContentCalendarViewProps {
  posts: SavedPost[];
  onBack: () => void;
}

const platformColors: { [key in Platform]: string } = {
    [Platform.Instagram]: '#E1306C',
    [Platform.Twitter]: '#1DA1F2',
    [Platform.Facebook]: '#4267B2',
    [Platform.LinkedIn]: '#0077B5',
    [Platform.TikTok]: '#FFFFFF',
};
const platformTextColors: { [key in Platform]: string } = {
    [Platform.Instagram]: '#FFFFFF',
    [Platform.Twitter]: '#FFFFFF',
    [Platform.Facebook]: '#FFFFFF',
    [Platform.LinkedIn]: '#FFFFFF',
    [Platform.TikTok]: '#000000',
};


const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({ posts, onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const postsByDate = useMemo(() => {
        const grouped: { [key: string]: SavedPost[] } = {};
        posts.forEach(post => {
            if (post.scheduledFor) {
                const localScheduledDate = new Date(post.scheduledFor);
                
                const year = localScheduledDate.getFullYear();
                const month = (localScheduledDate.getMonth() + 1).toString().padStart(2, '0');
                const day = localScheduledDate.getDate().toString().padStart(2, '0');
                const dateKey = `${year}-${month}-${day}`;

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(post);
            }
        });
        return grouped;
    }, [posts]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderHeader = () => {
        const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
        return (
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&larr;</button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{dateFormat.format(currentDate)}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&rarr;</button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-400">
                {days.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

        const rows = [];
        let days = [];
        let day = new Date(startDate);
        const today = new Date();
        today.setHours(0,0,0,0);

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day);
                const isCurrentMonth = cloneDay.getMonth() === currentDate.getMonth();
                const isToday = cloneDay.getTime() === today.getTime();
                
                const year = cloneDay.getFullYear();
                const month = (cloneDay.getMonth() + 1).toString().padStart(2, '0');
                const dayOfMonth = cloneDay.getDate().toString().padStart(2, '0');
                const dateKey = `${year}-${month}-${dayOfMonth}`;
                const dayPosts = postsByDate[dateKey] || [];

                days.push(
                    <div key={cloneDay.toString()} className={`min-h-[120px] p-2 border-t border-r border-gray-200 dark:border-gray-700 ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-700/50'}`}>
                        <div className={`flex justify-center items-center w-7 h-7 rounded-full text-sm ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'} ${isToday ? 'bg-brand-primary text-white font-bold' : ''}`}>
                            {cloneDay.getDate()}
                        </div>
                        <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                            {dayPosts.map(post => (
                                <div key={post.id} title={post.topic} className="text-xs p-1 rounded-md flex items-center gap-1.5 truncate" style={{ backgroundColor: platformColors[post.platform] || '#6B7280', color: platformTextColors[post.platform] || '#FFFFFF' }}>
                                    <span className="font-semibold">{post.platform}</span>
                                    <span className="flex-1 truncate">{post.topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div className="border-l border-b border-gray-200 dark:border-gray-700">{rows}</div>;
    };


    return (
        <div className="animate-fade-in-up w-full">
             <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                    <CalendarIcon />
                    Content Calendar
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Visualize your saved content schedule.
                </p>
            </header>
            <div className="bg-white/50 p-4 rounded-lg shadow-md dark:bg-gray-800/50">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
             <div className="text-center mt-8">
                <button
                onClick={onBack}
                className="px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 transition-colors"
                >
                Back to Generator
                </button>
            </div>
        </div>
    );
};

export default ContentCalendarView;