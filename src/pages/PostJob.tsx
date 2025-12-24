import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),
  company: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100),
  location: z.string().trim().min(2, 'Location must be at least 2 characters').max(100),
  description: z.string().trim().min(50, 'Description must be at least 50 characters').max(5000),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
});

export default function PostJob() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    job_type: 'full-time' as const,
    experience_level: 'entry' as const,
    salary_min: '',
    salary_max: '',
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const addRequirement = () => {
    if (newRequirement.trim() && requirements.length < 10) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = jobSchema.parse({
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
      });
      setErrors({});

      setLoading(true);

      const { error } = await supabase.from('jobs').insert({
        recruiter_id: user?.id,
        title: validatedData.title,
        company: validatedData.company,
        location: validatedData.location,
        description: validatedData.description,
        job_type: validatedData.job_type,
        experience_level: validatedData.experience_level,
        salary_min: validatedData.salary_min || null,
        salary_max: validatedData.salary_max || null,
        requirements: requirements.length > 0 ? requirements : null,
      });

      if (error) throw error;

      toast({
        title: 'Job posted!',
        description: 'Your job posting is now live.',
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error posting job:', err);
        toast({
          title: 'Error',
          description: 'Failed to post job. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
      
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Link 
          to="/dashboard" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Post a New Job</CardTitle>
            <CardDescription>
              Fill in the details below to create a new job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. TechCorp Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={errors.company ? 'border-destructive' : ''}
                  />
                  {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={errors.location ? 'border-destructive' : ''}
                  />
                  {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Job Type *</Label>
                  <Select 
                    value={formData.job_type} 
                    onValueChange={(value: any) => setFormData({ ...formData, job_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Experience Level *</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value: any) => setFormData({ ...formData, experience_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Min Salary ($)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      placeholder="50000"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Max Salary ($)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      placeholder="80000"
                      value={formData.salary_max}
                      onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-3">
                <Label>Requirements / Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. React, Python, 5+ years experience"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" variant="outline" onClick={addRequirement}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {requirements.map((req, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Job
                </Button>
                <Link to="/dashboard">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
