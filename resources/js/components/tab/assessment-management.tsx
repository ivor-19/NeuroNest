import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, Edit, Users, Trash2, Calendar, UserCheck, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import type { AssessmentList, AssessmentAssignment, InstructorAccessabilityProps, Question } from "@/types/utils/instructor-accessability-types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { QuestionBuilderModal } from "../modal/question-builder";
import axios from "axios";

interface AssessmentManagementTabProps {
  classInstructor: InstructorAccessabilityProps['classInstructor'];
  assessments: AssessmentList[];
  assignments: AssessmentAssignment[];
  assessmentAssignments: AssessmentAssignment[];
  setAssessmentAssignments: React.Dispatch<React.SetStateAction<AssessmentAssignment[]>>;
}

export function AssessmentManagementTab({
  classInstructor,
  assessments,
  assignments,
  assessmentAssignments,
  setAssessmentAssignments
}: AssessmentManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentList | null>(null);
  const [assignmentData, setAssignmentData] = useState({ is_available: false, opened_at: "", closed_at: "" });

  const getAssignmentForAssessment = (assessmentId: number) =>
    assessmentAssignments.find(
      (assignment) =>
        assignment.assessment_id === assessmentId &&
        assignment.course_id === classInstructor.course.id &&
        assignment.year_level === classInstructor.year_level &&
        assignment.section === classInstructor.section,
    );

  const getAssignedSectionsForAssessment = (assessmentId: number) =>
    assessmentAssignments.filter((assignment) => assignment.assessment_id === assessmentId);

  const handleAssignToSection = (assessment: AssessmentList) => {
    setSelectedAssessment(assessment);
    setAssignModalOpen(true);
    setAssignmentData({ is_available: false, opened_at: "", closed_at: "" });
  };

  const handleDeleteAssessment = (assessment: AssessmentList) => {
    setSelectedAssessment(assessment);
    setDeleteDialogOpen(true);
  };

  const handleAssignAssessment = async () => {
    if (!selectedAssessment) return;
    
    const newAssignment: AssessmentAssignment = {
      id: Date.now(),
      assessment_id: selectedAssessment.id,
      course_id: classInstructor.course.id,
      course: classInstructor.course,
      year_level: classInstructor.year_level,
      section: classInstructor.section,
      is_available: assignmentData.is_available,
      opened_at: assignmentData.opened_at || undefined,
      closed_at: assignmentData.closed_at || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAssessmentAssignments([...assessmentAssignments, newAssignment]);
    router.post(route("instructor.assignAssessment"), newAssignment as any, {
      onSuccess: () => {
        setAssignModalOpen(false);
        setSelectedAssessment(null);
        setAssignmentData({ is_available: false, opened_at: "", closed_at: "" });
        toast("Assessment has been assigned", {
          description: `New assessment for ${newAssignment.course.code} ${newAssignment.year_level} ${newAssignment.section}`,
          action: { label: "Close", onClick: () => console.log("Close") },
        });
      },
      onError: (errors) => {
        console.error("Assignment failed:", errors);
        toast("There has been some problem", {
          description: "There is already an assessment dedicated for this section.",
          action: { label: "Close", onClick: () => console.log("Close") },
        });
      },
    });
  };

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [questionBuilderOpen, setQuestionBuilderOpen] = useState(false);
const [questions, setQuestions] = useState<Question[]>([]);
const fetchQuestions = async (assessmentId : number) => {
  try {
    const response = await axios.get(`/instructor/sections/${assessmentId}/questions`);
    setQuestions(response.data.questions);
  } catch (error) {
    console.error('Error fetching questiosns:', error);
    toast.error("Failed to load questions");
  }
};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Management</CardTitle>
          <CardDescription>
            Edit assessment details, assign to specific sections, configure questions, or remove assessments as needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 overflow-auto h-[26rem]">
            {filteredAssessments.map((assessment) => {
              const assignment = getAssignmentForAssessment(assessment.id);
              const allAssignments = getAssignedSectionsForAssessment(assessment.id);
              
              return (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold truncate">{assessment.title}</h3>
                            <Badge variant="secondary">
                              {assessment.subject.code} - {assessment.subject.title}
                            </Badge>
                            {assignment ? (
                              <Badge
                                className={`text-xs ${
                                  assignment.is_available
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {assignment.is_available ? "Available" : "Scheduled"}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Not Assigned
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                            {assessment.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            {allAssignments.length > 0 && (
                              <span className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" /> Assigned to {allAssignments.length} section
                                {allAssignments.length !== 1 ? "s" : ""}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Created at:{" "}
                              {assessment?.created_at ? new Date(assessment.created_at).toLocaleDateString() : "Not available"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Updated at:{" "}
                              {assessment?.updated_at ? new Date(assessment.updated_at).toLocaleDateString() : "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit Assessment
                            </DropdownMenuItem>
                            <DropdownMenuItem 
  onClick={() => { 
    setSelectedAssessment(assessment); 
    fetchQuestions(assessment.id);
    setQuestionBuilderOpen(true); 
  }}
>
  <Settings className="h-4 w-4 mr-2" /> Manage Questions
</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignToSection(assessment)}>
                              <Users className="h-4 w-4 mr-2" /> Assign to Section
                            </DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteAssessment(assessment)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Assessment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredAssessments.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">No assessments found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">
                        {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first assessment."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Assessment Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Assessment to Section</DialogTitle>
            <DialogDescription>
              Configure assignment settings for "{selectedAssessment?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 text-white font-bold">
                    {classInstructor.subject.code.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Assessment Target</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {classInstructor.subject.code} - {classInstructor.year_level} {classInstructor.section}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Course:</span>
                  <div className="font-medium">{classInstructor.course.name}</div>
                </div>
                <div>
                  <span className="text-slate-500">Year Level:</span>
                  <div className="font-medium">{classInstructor.year_level}</div>
                </div>
                <div>
                  <span className="text-slate-500">Section:</span>
                  <div className="font-medium">{classInstructor.section}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Availability Settings</h4>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={assignmentData.is_available}
                  onCheckedChange={(checked) => setAssignmentData({ ...assignmentData, is_available: checked })}
                />
                <Label htmlFor="is_available">Make available immediately</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opened_at">Available From (Optional)</Label>
                  <Input
                    id="opened_at"
                    type="datetime-local"
                    value={assignmentData.opened_at}
                    onChange={(e) => setAssignmentData({ ...assignmentData, opened_at: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">When students can start accessing the assessment</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closed_at">Available Until (Optional)</Label>
                  <Input
                    id="closed_at"
                    type="datetime-local"
                    value={assignmentData.closed_at}
                    onChange={(e) => setAssignmentData({ ...assignmentData, closed_at: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Deadline for assessment submission</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Assignment Details</div>
                  <div className="text-blue-700 dark:text-blue-300">
                    <ul className="list-disc list-inside space-y-1">
                      <li>This assessment will be assigned to the entire section</li>
                      <li>All students in {classInstructor.year_level} {classInstructor.section} will have access</li>
                      <li>You can control availability using the settings above</li>
                      <li>Students will see this assessment in their dashboard when available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant={"outline"} onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAssessment}>Assign to Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <QuestionBuilderModal
  open={questionBuilderOpen}
  onOpenChange={setQuestionBuilderOpen}
  selectedAssessment={selectedAssessment}
  questions={questions}
  setQuestions={setQuestions}
  onComplete={() => {
    setQuestionBuilderOpen(false);
    // Optionally refresh the assessment list
  }}
/>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assessment and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (selectedAssessment) {
                  // Handle delete logic here
                  console.log("Deleting assessment:", selectedAssessment.id);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Delete Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}