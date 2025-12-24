import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Briefcase, 
  Loader2, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MapPin,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data as Job[]) || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, is_active: !currentStatus } : job
      ));

      toast({
        title: currentStatus ? 'Job deactivated' : 'Job activated',
        description: currentStatus 
          ? 'This job is now hidden from job seekers.' 
          : 'This job is now visible to job seekers.',
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job status.',
        variant: 'destructive',
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(jobs.filter(job => job.id !== jobId));
      toast({
        title: 'Job deleted',
        description: 'The job posting has been removed.',
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Recruiter Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your job postings
            </p>
          </div>
          <Link to="/post-job">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="font-display text-2xl font-bold text-foreground">{jobs.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {jobs.filter(j => j.is_active).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <EyeOff className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Jobs</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {jobs.filter(j => !j.is_active).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">No jobs yet</h3>
            <p className="mb-6 text-muted-foreground">
              Post your first job to start finding great candidates.
            </p>
            <Link to="/post-job">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post Your First Job
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className={!job.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <Badge variant={job.is_active ? 'default' : 'secondary'}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </span>
                        <Badge variant="outline">{job.job_type.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleJobStatus(job.id, job.is_active)}
                        className="gap-1.5"
                      >
                        {job.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Link to={`/edit-job/${job.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the job posting.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteJob(job.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
