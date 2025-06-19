import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import type { 
  InstructorAccessabilityProps,
  AssessmentList,
  Question 
} from "@/types/utils/instructor-accessability-types";
import type { SharedData } from "@/types";

interface CreateAssessmentTabProps {
  classInstructor: InstructorAccessabilityProps['classInstructor'];
  setActiveTab: (tab: string) => void;
  setQuestionBuilderOpen: (open: boolean) => void;
  setSelectedAssessment: (assessment: AssessmentList | null) => void;
  setQuestions: (questions: Question[]) => void;
}

export function CreateAssessmentTab({ 
  classInstructor, 
  setActiveTab,
  setQuestionBuilderOpen,
  setSelectedAssessment,
  setQuestions
}: CreateAssessmentTabProps) {
  const { auth } = usePage<SharedData>().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    instructor_id: auth.user.id,
    subject_id: classInstructor.subject.id,
    title: "",
    description: "",
  });

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    post(route("instructor.createAssessment"), {
      ...data,
      onSuccess: (response) => {
        reset();
        setQuestionBuilderOpen(true);
        
        // Get the latest assessment from the updated assessments array
        const assessments = response.props.assessments as any[];
        const latestAssessment = assessments[assessments.length - 1]; // Get the last one (newest)

        console.log(latestAssessment);
        setSelectedAssessment(
          latestAssessment || {
            id: Date.now(),
            ...data,
            instructor: auth.user,
            subject: classInstructor.subject,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        );
        setQuestions([]);
        toast("Assessment created successfully!", {
          description: "You can now add questions to your assessment.",
        });
      },
      onError: (errors) => console.error("Error occurred", errors),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Assessment</CardTitle>
        <CardDescription>
          Create a new assessment. You can add questions and assign it to students after creation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input
            id="title"
            placeholder="e.g., Midterm Exam, Weekly Quiz #1"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the assessment..."
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            rows={3}
          />
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Next Steps
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                After creating this assessment, you'll be able to:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Add questions and answers immediately</li>
                  <li>Configure assessment settings</li>
                  <li>Assign to specific sections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setActiveTab("section-assessments")}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateAssessment}
            disabled={processing || !data.title || !data.description}
            className="transition-all"
          >
            {processing ? "Creating..." : "Create Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}