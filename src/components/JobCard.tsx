import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Building2, ArrowRight } from 'lucide-react';
import { Job } from '@/types/job';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  index: number;
}

const jobTypeBadgeVariants: Record<string, string> = {
  'full-time': 'bg-accent/10 text-accent border-accent/20',
  'part-time': 'bg-primary/10 text-primary border-primary/20',
  'contract': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'internship': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'remote': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};

const experienceBadgeVariants: Record<string, string> = {
  'entry': 'bg-green-500/10 text-green-600 border-green-500/20',
  'mid': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'senior': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'lead': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'executive': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export function JobCard({ job, index }: JobCardProps) {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return null;
  };

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Card 
      className="group gradient-card border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{job.company}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={jobTypeBadgeVariants[job.job_type]}>
                {job.job_type.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className={experienceBadgeVariants[job.experience_level]}>
                {job.experience_level} level
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span>{salary}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
            </div>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {job.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            {job.requirements && job.requirements.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.requirements.slice(0, 3).map((req, i) => (
                  <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {req}
                  </span>
                ))}
                {job.requirements.length > 3 && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    +{job.requirements.length - 3}
                  </span>
                )}
              </div>
            )}
            <Link to={`/jobs/${job.id}`} className="ml-auto">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                View Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
