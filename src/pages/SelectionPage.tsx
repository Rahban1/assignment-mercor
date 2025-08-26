import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHiringStore } from '../store';
import CandidateListItem from '../components/features/CandidateListItem';
import Button from '../components/ui/Button';
import DarkModeToggle from '../components/ui/DarkModeToggle';
import { UsersIcon, ArrowLeftIcon } from '../components/ui/Icons';

const SelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { applicants, scores, shortlisted, selected } = useHiringStore();

  const selectedOrShortlistedApplicants = applicants.filter(
    (applicant) => applicant.id in selected || applicant.id in shortlisted
  );

  // Sort to show selected candidates first
  selectedOrShortlistedApplicants.sort((a, b) => {
    const aIsSelected = a.id in selected;
    const bIsSelected = b.id in selected;
    if (aIsSelected && !bIsSelected) return -1;
    if (!aIsSelected && bIsSelected) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <motion.header
        className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)] flex items-center gap-3">
                <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                Team Selection
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-medium mt-1">
                {selectedOrShortlistedApplicants.length} candidates in consideration
              </p>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2 sm:gap-3 lg:gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<ArrowLeftIcon size={14} />} 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <DarkModeToggle size="sm" />
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {selectedOrShortlistedApplicants.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">No Candidates Selected</h2>
            <p className="text-[var(--muted-foreground)] mt-2">
              Go back to the dashboard to shortlist or select candidates.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
          >
            {selectedOrShortlistedApplicants.map((applicant, index) => (
              <motion.div
                key={applicant.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              >
                <CandidateListItem
                  applicant={applicant}
                  score={scores[applicant.id]}
                  isShortlisted={applicant.id in shortlisted}
                  isSelected={applicant.id in selected}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SelectionPage;
