import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Briefcase,
  CheckCircle,
  Loader2,
  Share2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const jobTypeBadgeVariants: Record<string, string> = {
  'full-time': 'bg-accent/10 text-accent border-accent/20',
  'part-time': 'bg-primary/10 text-primary border-primary/20',
  'contract': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'internship': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'remote': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setJob(data as Job | null);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} per year`;
    if (min) return `From $${min.toLocaleString()} per year`;
    if (max) return `Up to $${max.toLocaleString()} per year`;
    return null;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied!',
      description: 'Job link has been copied to clipboard.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 font-display text-xl font-semibold">Job not found</h2>
          <p className="mb-6 text-muted-foreground">
            This job posting may have been removed or is no longer available.
          </p>
          <Link to="/">
            <Button>Browse Other Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Link 
          to="/" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <Card className="mb-6 overflow-hidden border-border/50">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-lg font-medium opacity-90">{job.company}</span>
                </div>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{job.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                >
                  {job.job_type.replace('-', ' ')}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                >
                  {job.experience_level} level
                </Badge>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="mb-6 flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{job.location}</span>
              </div>
              {salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Apply Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 font-display text-xl font-semibold">Job Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {job.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-display text-xl font-semibold">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">Job Overview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium capitalize">{job.job_type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium capitalize">{job.experience_level} Level</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  {salary && (
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-medium">{salary}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">About {job.company}</h3>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.company} is hiring for this position. Apply now to join their team!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
