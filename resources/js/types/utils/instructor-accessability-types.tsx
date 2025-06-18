export interface ClassInstructor {
  id: number
  course: { id: number; name: string; code: string }
  subject: {
    id: number
    code: string
    title: string
    description: string
    year_level: string
    semester: string
    isActive: boolean
  }
  year_level: string
  section: string
}

export interface ModuleAccess {
  id: number
  module_id: number
  class_instructor_id: number
  is_available: boolean
  module: {
    id: number
    subject_id: number
    title: string
    description: string
    status: "published" | "draft"
    order: number
    materials?: any
    pdf?: string | null
  }
}

export interface AssessmentList {
  id: number
  title: string
  description: string
  instructor: { id: number; name: string }
  subject: { id: number; code: string; title: string }
  instructor_id: number
  subject_id: number
  assignments?: AssessmentAssignment[]
  created_at: string
  updated_at: string
}

export interface AssessmentAssignment {
  id: number
  assessment_id: number
  course: { id: number; code: string; name: string }
  course_id: number
  year_level: string
  section: string
  is_available: boolean
  opened_at?: string
  closed_at?: string
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
}

export interface InstructorAccessabilityProps {
  classInstructor: ClassInstructor
  modules: ModuleAccess[]
  assessments: AssessmentList[]
  assignments: AssessmentAssignment[]
}