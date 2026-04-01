export interface StudentDashboardData {
    averageGrade: number;
    successRate: number;
    coursesCount: number;
    attendanceRate: number;
    recentCourses: Array<{
        id: string;
        name: string;
        professor: string;
        status: 'ongoing' | 'upcoming';
    }>;
    upcomingExams: Array<{
        id: string;
        subject: string;
        date: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}
