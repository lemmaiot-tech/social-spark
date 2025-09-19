import React from 'react';
import { SavedPost } from '../types';
import TrashIcon from './icons/TrashIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import CalendarIcon from './icons/CalendarIcon';
import ClockIcon from './icons/ClockIcon';

interface SavedPostsProps {
  posts: SavedPost[];
  onDelete: (id: string) => void;
  onBack: () => void;
  onSchedule: (post: SavedPost) => void;
}

const SavedPosts: React.FC<SavedPostsProps> = ({ posts, onDelete, onBack, onSchedule }) => {
  return (
    <div className="animate-fade-in-up">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
            <BookmarkIcon />
            Saved Content
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You have {posts.length} saved suggestion{posts.length !== 1 ? 's' : ''}.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {posts.slice().reverse().map((post) => (
            <div key={post.id} className="bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800/60 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                    {post.scheduledFor ? (
                        <p className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full mb-2 inline-flex dark:bg-green-900/50 dark:text-green-300">
                            <CalendarIcon />
                            Scheduled for {new Date(post.scheduledFor).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                    ) : (
                        <p className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full inline-block mb-2 dark:bg-yellow-900/50 dark:text-yellow-300">
                            Draft
                        </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        For <span className="font-semibold text-brand-primary">{post.handle}</span> on <span className="font-semibold">{post.platform}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Topic: <span className="font-semibold">"{post.topic}"</span>
                    </p>
                </div>
                <div className="flex items-center flex-shrink-0 ml-4">
                    <button
                        onClick={() => onSchedule(post)}
                        className="p-2 text-gray-500 hover:text-brand-primary hover:bg-blue-100 rounded-full transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                        title={post.scheduledFor ? 'Edit Schedule' : 'Schedule Post'}
                        aria-label={post.scheduledFor ? 'Edit Schedule' : 'Schedule Post'}
                    >
                        <ClockIcon />
                    </button>
                    <button
                        onClick={() => onDelete(post.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-500"
                        aria-label="Delete post"
                    >
                        <TrashIcon />
                    </button>
                </div>
              </div>

              <div className="mb-4">
                  <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-2">Image Suggestion</h3>
                  <p className="text-gray-800 dark:text-gray-200 italic">"{post.imageSuggestion}"</p>
              </div>

              <div className="mb-4">
                  <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-2">Caption</h3>
                  <p className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200">{post.caption}</p>
              </div>
              
              <div>
                  <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-2">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">#{tag}</span>
                      ))}
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">You haven't saved any content yet.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Generate some content and click the 'Save' button to find it here!</p>
        </div>
      )}

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

export default SavedPosts;