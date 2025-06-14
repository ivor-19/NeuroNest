import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Clock, Play, User } from "lucide-react"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Head, router } from "@inertiajs/react"
import HeaderLayout from "@/layouts/header-layout"

interface User {
	id: number;
	name: string;
	email: string;
	role?: string;
}

interface Subject {
	id: number;
	code: string;
	title: string;
	description: string;
	isActive: boolean;
	instructor_name?: string;  // Added instructor info
	instructor_email?: string; // Added instructor email
}

interface StudentDashboardProps {
	user: User;
	subjects: Subject[];
}

export default function Dashboard({ user, subjects }: StudentDashboardProps) {
	const [studentSubjects, setStudentSubjects] = useState<Subject[]>(subjects || []);

	// Update subjects when props change
	useEffect(() => {
		setStudentSubjects(subjects || []);
	}, [subjects]);

	return (
		<HeaderLayout>
				<Head title={'Dashboard'} />
					<div className="min-h-screen mt-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
							{/* Student Dashboard */}
							<div className="mb-8">
								<h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
								<p className="text-gray-600 mt-2">Continue your learning journey</p>
							</div>

							{/* Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
								<Card>
									<CardContent className="p-6">
										<div className="flex items-center">
											<BookOpen className="h-8 w-8 text-blue-600" />
											<div className="ml-4">
												<p className="text-sm font-medium text-gray-600">Enrolled Subjects</p>
												<p className="text-2xl font-bold">{studentSubjects.length}</p>
											</div>
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-6">
										<div className="flex items-center">
											<Clock className="h-8 w-8 text-green-600" />
											<div className="ml-4">
												<p className="text-sm font-medium text-gray-600">Hours Learned</p>
												<p className="text-2xl font-bold">47</p>
											</div>
										</div>
									</CardContent>
								</Card>
									<Card>
										<CardContent className="p-6">
											<div className="flex items-center">
												<Award className="h-8 w-8 text-purple-600" />
												<div className="ml-4">
													<p className="text-sm font-medium text-gray-600">Certificates</p>
													<p className="text-2xl font-bold">2</p>
												</div>
											</div>
										</CardContent>
										</Card>
										<Card>
											<CardContent className="p-6">
												<div className="flex items-center">
													<Users className="h-8 w-8 text-orange-600" />
													<div className="ml-4">
														<p className="text-sm font-medium text-gray-600">Avg. Progress</p>
														<p className="text-2xl font-bold text-gray-900">47%</p>
													</div>
												</div>
										</CardContent>
									</Card>
							</div>

							{/* My Subjects */}
							<div>
								<h2 className="text-2xl font-bold mb-6">My Subjects</h2>

								{studentSubjects.length === 0 ? (
									<div className="text-center text-gray-500 py-10 border rounded-md">
										<p className="text-lg">You are not enrolled in any subjects yet.</p>
										<p className="text-sm mt-2">Please contact your administrator or check back later.</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{studentSubjects.map((subject) => (
											<Card
												key={subject.id}
												onClick={() => router.visit(route('student.modules', { subject_id: subject.id }))}
												className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
											>
												<div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
													<PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
												</div>
												<CardHeader>
													<div className="flex items-center justify-between">
														<Badge variant="secondary" className="text-xs">{subject.code}</Badge>
														<Badge 
															variant={subject.isActive ? "default" : "secondary"}
															className="text-xs"
														>
															{subject.isActive ? "Active" : "Inactive"}
														</Badge>
													</div>
													<CardTitle className="text-lg">{subject.title}</CardTitle>
													<CardDescription className="space-y-1">
														<div>{subject.description}</div>
														{/* Instructor Info */}
														{subject.instructor_name && (
															<div className="flex items-center text-sm text-muted-foreground mt-2">
																<User className="h-3 w-3 mr-1" />
																<span>Instructor: {subject.instructor_name}</span>
															</div>
														)}
													</CardDescription>
												</CardHeader>
												<CardContent>
													<Button variant="ghost" size="sm" className="w-full">
													<Play className="h-4 w-4 mr-2" />View Modules</Button>
												</CardContent>
											</Card>
									))}
							</div>
						)}
					</div>
				</div>
			</div>
		</HeaderLayout>
	)
}