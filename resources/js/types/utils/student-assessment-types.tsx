
export interface Course {
  id: number;
  title: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  title: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: number
  student_id: number
  course_id: number
  year_level: string
  section: string
  academic_year: string
  created_at: string
  updated_at: string
  course?: Course
}

export interface Question {
  id: number;
  assessment_id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  points: number;
  options?: string[] | null;
  correct_answer?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface Assessment {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  questions?: Question[];
  questions_sum_points?: number;  // From withSum()
  total_points: number;           // Added in the map() function
  subject?: Subject;              // Added subject relationship
  type?: string

  status: 'not_started' | 'in_progress' | 'completed';
  student_score?: number;         // Only present when completed
  percentage?: number;            // Only present when completed
}

export interface AssessmentAssignment {
  id: number;
  assessment_id: number;
  course_id: number;
  year_level: string;
  section: string;
  is_available: 0 | 1;
  opened_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  assessment: Assessment;
  course: Course;
}

export interface StudentAssessmentProps {
  assessments: AssessmentAssignment[];
  studentProfile: StudentProfile;
}