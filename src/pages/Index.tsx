import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SearchFilters } from '@/components/SearchFilters';
import { JobCard } from '@/components/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { Job, JobType, ExperienceLevel } from '@/types/job';
import { Loader2, Briefcase } from 'lucide-react';

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<JobType | 'all'>('all');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | 'all'>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data as Job[]) || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedJobType === 'all' || job.job_type === selectedJobType;
      const matchesExperience = selectedExperience === 'all' || job.experience_level === selectedExperience;

      return matchesSearch && matchesType && matchesExperience;
    });
  }, [jobs, searchQuery, selectedJobType, selectedExperience]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <main id="jobs" className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Latest Job Openings
          </h2>
          <p className="text-muted-foreground">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedJobType={selectedJobType}
            setSelectedJobType={setSelectedJobType}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-muted-foreground">
              {jobs.length === 0
                ? 'Be the first to post a job!'
                : 'Try adjusting your filters or search query.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
