import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, Platform, PostSuggestion, SavedPost, BrandContext } from './types';
import PlatformSelector from './components/PlatformSelector';
import TopicInput from './components/TopicInput';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import SavedPosts from './components/SavedPosts';
import ContentCalendarView from './components/ContentCalendarView';
import ProvideContext from './components/ProvideContext';
import EditBrandContext from './components/EditBrandContext';
import SchedulePostModal from './components/SchedulePostModal';
import UndoToast from './components/UndoToast';
import { generateSocialMediaContent, generateNextPostIdeas } from './services/geminiService';
import SparklesIcon from './components/icons/SparklesIcon';
import BrandLogo from './components/BrandLogo';
import BookmarkIcon from './components/icons/BookmarkIcon';
import CalendarIcon from './components/icons/CalendarIcon';
import UserIcon from './components/icons/UserIcon';
import ThemeToggleButton from './components/ThemeToggleButton';
import Footer from './components/Footer';

const USAGE_LIMIT = 10;
const USAGE_KEY = 'aiUsageLimit';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingNextSteps, setIsGeneratingNextSteps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [brandContext, setBrandContext] = useState<BrandContext | null>(null);
  const [previousStep, setPreviousStep] = useState<AppStep>(AppStep.SELECT_PLATFORM);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [schedulingPost, setSchedulingPost] = useState<PostSuggestion | SavedPost | null>(null);
  const [undoableAction, setUndoableAction] = useState<{ action: 'deletePost'; data: SavedPost; timerId: number } | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  // Theme Management Effect
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem('savedSocialPosts');
      if (storedPosts) {
        setSavedPosts(JSON.parse(storedPosts));
      }
      const storedContext = localStorage.getItem('brandContext');
      if (storedContext) {
        const parsedContext = JSON.parse(storedContext);
        if (parsedContext && parsedContext.brandName) {
            setBrandContext(parsedContext);
            setStep(AppStep.SELECT_PLATFORM);
        } else {
            // Force re-setup if brandName is missing
            setStep(AppStep.PROVIDE_CONTEXT);
        }
      } else {
        setStep(AppStep.PROVIDE_CONTEXT);
      }
      
      // Check and set usage limit
      const usageDataRaw = localStorage.getItem(USAGE_KEY);
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

      if (usageDataRaw) {
        const usageData = JSON.parse(usageDataRaw);
        if (usageData.date === today) {
          setUsageCount(usageData.count);
        } else {
          // New day, reset count
          setUsageCount(0);
          localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        }
      } else {
        // First time user, initialize
        localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        setUsageCount(0);
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      localStorage.removeItem('brandContext');
      setStep(AppStep.PROVIDE_CONTEXT);
    }
  }, []);

  // Effect to clean up the undo timer if the component unmounts or the action changes
  useEffect(() => {
    return () => {
      if (undoableAction) {
        clearTimeout(undoableAction.timerId);
      }
    };
  }, [undoableAction]);
  
  const handleSaveBrandContext = (context: BrandContext) => {
    setBrandContext(context);
    localStorage.setItem('brandContext', JSON.stringify(context));
    // If coming from the edit screen, go back to where they were. Otherwise, proceed to platform selection.
    if (step === AppStep.EDIT_BRAND_CONTEXT) {
        setStep(previousStep);
    } else {
        setStep(AppStep.SELECT_PLATFORM);
    }
  };

  const handleOpenScheduleModal = (post: PostSuggestion | SavedPost) => {
    setSchedulingPost(post);
  };

  const handleConfirmSchedule = (postToSchedule: PostSuggestion | SavedPost, scheduleDate: string | null) => {
    // Check if it's an existing post by looking for the 'id' property
    if ('id' in postToSchedule && typeof postToSchedule.id === 'string') {
        // This is an existing SavedPost, so we update it
        setSavedPosts(prevPosts => {
            const updatedPosts = prevPosts.map(p => 
                p.id === (postToSchedule as SavedPost).id 
                ? { ...p, scheduledFor: scheduleDate || undefined } 
                : p
            );
            localStorage.setItem('savedSocialPosts', JSON.stringify(updatedPosts));
            return updatedPosts;
        });
    } else {
        // This is a new PostSuggestion, so we create a new SavedPost
        const newPost: SavedPost = {
            ...(postToSchedule as PostSuggestion),
            id: `${Date.now()}-${Math.random()}`,
            platform: platform!,
            handle: brandContext!.brandName,
            topic: topic,
            savedAt: new Date().toISOString(),
            scheduledFor: scheduleDate || undefined,
        };
        setSavedPosts(prevPosts => {
            const updatedPosts = [...prevPosts, newPost];
            localStorage.setItem('savedSocialPosts', JSON.stringify(updatedPosts));
            return updatedPosts;
        });
    }
    setSchedulingPost(null);
  };

  const handleCancelSchedule = () => {
    setSchedulingPost(null);
  };

  const handleUndoDelete = () => {
    if (!undoableAction || undoableAction.action !== 'deletePost') return;

    // Prevent the scheduled deletion from happening
    clearTimeout(undoableAction.timerId);

    // Restore the post to the state
    const restoredPosts = [...savedPosts, undoableAction.data];
    setSavedPosts(restoredPosts);

    // Persist the restored state immediately
    localStorage.setItem('savedSocialPosts', JSON.stringify(restoredPosts));
    
    // Clear the undo state, hiding the toast
    setUndoableAction(null);
  };

  const handleDeletePost = (postId: string) => {
    // If there's a pending undo action, clear its timer and commit the deletion it was responsible for.
    if (undoableAction) {
        clearTimeout(undoableAction.timerId);
        localStorage.setItem('savedSocialPosts', JSON.stringify(savedPosts));
    }

    const postToDelete = savedPosts.find(p => p.id === postId);
    if (!postToDelete) return;

    // Optimistically update UI
    const updatedPosts = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updatedPosts);
    
    // Set a timer to commit the deletion after a delay
    const timerId = window.setTimeout(() => {
        localStorage.setItem('savedSocialPosts', JSON.stringify(updatedPosts));
        setUndoableAction(null); // Hide toast after timeout
    }, 5000);

    setUndoableAction({ action: 'deletePost', data: postToDelete, timerId });
  };

  const handlePlatformSelect = (selectedPlatform: Platform) => {
    setPlatform(selectedPlatform);
    setStep(AppStep.ENTER_TOPIC);
  };
  
  const navigateTo = (newStep: AppStep) => {
    setPreviousStep(step!);
    setStep(newStep);
  };
  
  const goBack = (defaultStep: AppStep) => {
    setStep(previousStep || defaultStep);
  };

  const checkAndIncrementUsage = (): boolean => {
    if (usageCount >= USAGE_LIMIT) {
      setError(`You have reached your daily limit of ${USAGE_LIMIT} generations. Please try again tomorrow.`);
      return false;
    }
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    return true;
  };


  const handleGenerateContent = useCallback(async (postTopic: string) => {
    if (!platform || !brandContext?.brandName || !checkAndIncrementUsage()) return;

    setTopic(postTopic);
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setNextSteps([]);
    setStep(AppStep.GENERATING);

    try {
      const results = await generateSocialMediaContent(platform, brandContext.brandName, postTopic, brandContext);
      setSuggestions(results);
      setStep(AppStep.SHOW_RESULTS);
      setIsLoading(false); // Main content is loaded

      // Fetch next steps in the background
      setIsGeneratingNextSteps(true);
      try {
        const nextStepIdeas = await generateNextPostIdeas(platform, brandContext.brandName, postTopic, brandContext);
        setNextSteps(nextStepIdeas);
      } catch (nextStepError) {
        console.error("Could not generate next step ideas:", nextStepError);
        setNextSteps([]); // Fail gracefully
      } finally {
        setIsGeneratingNextSteps(false);
      }

    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while generating content. Please try again.');
      setStep(AppStep.ENTER_TOPIC); // Revert to topic input on error
      setIsLoading(false);
    }
  }, [platform, brandContext, usageCount]);

  const handleRegenerateForPlatform = useCallback(async (newPlatform: Platform) => {
    if (!topic || !brandContext?.brandName || !checkAndIncrementUsage()) return;

    setPlatform(newPlatform);
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setNextSteps([]);
    setStep(AppStep.GENERATING);

    try {
        const results = await generateSocialMediaContent(newPlatform, brandContext.brandName, topic, brandContext);
        setSuggestions(results);
        setStep(AppStep.SHOW_RESULTS);
        setIsLoading(false); // Main content is loaded

        // Fetch next steps in the background
        setIsGeneratingNextSteps(true);
        try {
            const nextStepIdeas = await generateNextPostIdeas(newPlatform, brandContext.brandName, topic, brandContext);
            setNextSteps(nextStepIdeas);
        } catch (nextStepError) {
            console.error("Could not generate next step ideas:", nextStepError);
            setNextSteps([]);
        } finally {
            setIsGeneratingNextSteps(false);
        }
    } catch (err) {
        console.error(err);
        setError('Sorry, something went wrong while generating content. Please try again.');
        setStep(AppStep.ENTER_TOPIC);
        setIsLoading(false);
    }
  }, [topic, brandContext, usageCount]);

  const handleReset = () => {
    setStep(AppStep.SELECT_PLATFORM);
    setPlatform(null);
    setTopic('');
    setSuggestions([]);
    setNextSteps([]);
    setError(null);
  };
  
  const renderStep = () => {
    if (step === null) {
      return <LoadingSpinner />;
    }

    switch (step) {
      case AppStep.PROVIDE_CONTEXT:
        return <ProvideContext onSave={handleSaveBrandContext} />;
      case AppStep.SELECT_PLATFORM:
        return <PlatformSelector onSelect={handlePlatformSelect} />;
      case AppStep.ENTER_TOPIC:
        return <TopicInput 
                    platform={platform!} 
                    brandName={brandContext!.brandName} 
                    onSubmit={handleGenerateContent} 
                    onBack={() => setStep(AppStep.SELECT_PLATFORM)} 
                    error={error}
                    usageCount={usageCount}
                    usageLimit={USAGE_LIMIT}
                />;
      case AppStep.GENERATING:
        return <LoadingSpinner />;
      case AppStep.SHOW_RESULTS:
        return <ResultsDisplay 
                  suggestions={suggestions} 
                  onReset={handleReset} 
                  platform={platform!} 
                  brandName={brandContext!.brandName} 
                  topic={topic} 
                  onRegenerate={handleRegenerateForPlatform}
                  nextSteps={nextSteps}
                  isGeneratingNextSteps={isGeneratingNextSteps}
                  onSave={handleOpenScheduleModal}
                  savedPosts={savedPosts}
               />;
      case AppStep.SHOW_SAVED:
        return <SavedPosts posts={savedPosts} onDelete={handleDeletePost} onBack={() => goBack(AppStep.SELECT_PLATFORM)} onSchedule={handleOpenScheduleModal} />;
      case AppStep.SHOW_CALENDAR:
        return <ContentCalendarView posts={savedPosts} onBack={() => goBack(AppStep.SELECT_PLATFORM)} />;
      case AppStep.EDIT_BRAND_CONTEXT:
          return <EditBrandContext initialContext={brandContext} onSave={handleSaveBrandContext} onBack={() => goBack(AppStep.SELECT_PLATFORM)} />
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
       <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10 relative">
            <BrandLogo />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-center gap-3">
              <SparklesIcon />
              AI Content Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Craft the perfect social media post in seconds.</p>
             <div className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center gap-2">
                 <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                 <button
                  onClick={() => navigateTo(AppStep.EDIT_BRAND_CONTEXT)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  aria-label="Edit brand profile"
                >
                  <UserIcon />
                  <span className="hidden sm:inline">Brand Profile</span>
                </button>
                <button
                  onClick={() => navigateTo(AppStep.SHOW_SAVED)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  aria-label="View saved posts"
                >
                  <BookmarkIcon />
                  <span className="hidden sm:inline">Saved ({savedPosts.length})</span>
                </button>
                <button
                  onClick={() => navigateTo(AppStep.SHOW_CALENDAR)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  aria-label="View content calendar"
                >
                  <CalendarIcon />
                   <span className="hidden sm:inline">Calendar</span>
                </button>
             </div>
        </header>
        <main className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">
            {renderStep()}
        </main>
        {schedulingPost && (
          <SchedulePostModal
            post={schedulingPost}
            onSchedule={handleConfirmSchedule}
            onCancel={handleCancelSchedule}
          />
        )}
        {undoableAction?.action === 'deletePost' && (
          <UndoToast 
            message="Post deleted."
            onUndo={handleUndoDelete}
          />
        )}
        <Footer />
       </div>
    </div>
  );
};

export default App;