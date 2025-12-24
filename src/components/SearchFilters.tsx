import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { JobType, ExperienceLevel } from '@/types/job';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedJobType: JobType | 'all';
  setSelectedJobType: (type: JobType | 'all') => void;
  selectedExperience: ExperienceLevel | 'all';
  setSelectedExperience: (level: ExperienceLevel | 'all') => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search jobs by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-card border-border"
        />
      </div>
      <div className="flex gap-3">
        <Select value={selectedJobType} onValueChange={(value) => setSelectedJobType(value as JobType | 'all')}>
          <SelectTrigger className="w-40 h-12 bg-card border-border">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedExperience} onValueChange={(value) => setSelectedExperience(value as ExperienceLevel | 'all')}>
          <SelectTrigger className="w-40 h-12 bg-card border-border">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="entry">Entry</SelectItem>
            <SelectItem value="mid">Mid</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
