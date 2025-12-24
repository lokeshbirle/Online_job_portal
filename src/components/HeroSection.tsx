import { Button } from '@/components/ui/button';
import { Search, Briefcase, Users, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Briefcase className="h-4 w-4" />
            Find Your Dream Career Today
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Connect with{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Top Employers
            </span>{' '}
            & Opportunities
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover thousands of job opportunities from leading companies. 
            Whether you're a job seeker or a recruiter, we've got you covered.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="#jobs">
              <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                <Search className="h-5 w-5" />
                Browse Jobs
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto border-2">
                <Building className="h-5 w-5" />
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground md:text-4xl">500+</div>
              <div className="text-sm text-muted-foreground md:text-base">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground md:text-4xl">200+</div>
              <div className="text-sm text-muted-foreground md:text-base">Companies</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground md:text-4xl">10k+</div>
              <div className="text-sm text-muted-foreground md:text-base">Job Seekers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
