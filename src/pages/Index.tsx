import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AttendanceTable from "@/components/AttendanceTable";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import StudentManagement from "@/components/StudentManagement";
import { Student } from "@/types/student";
import { toast } from "sonner";
import { Calendar, Users, Settings } from "lucide-react";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Ahmed Benali",
      attendance: [],
      observations: [],
    },
    {
      id: 2,
      name: "Fatima Zahra",
      attendance: [],
      observations: [],
    },
    {
      id: 3,
      name: "Mohammed Alami",
      attendance: [],
      observations: [],
    },
  ]);

  const handleAddStudent = (name: string) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      attendance: [],
      observations: [],
    };
    setStudents([...students, newStudent]);
    toast.success(`${name} a été ajouté`);
  };

  const handleEditStudent = (id: number, name: string) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, name } : student
      )
    );
    toast.success("Élève modifié");
  };

  const handleDeleteStudent = (id: number) => {
    const student = students.find((s) => s.id === id);
    setStudents(students.filter((s) => s.id !== id));
    toast.success(`${student?.name} a été supprimé`);
  };

  const handleMarkAttendance = (studentId: number, date: string, present: boolean) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const existingIndex = student.attendance.findIndex((a) => a.date === date);
          const updatedAttendance = [...student.attendance];

          if (existingIndex >= 0) {
            updatedAttendance[existingIndex] = { date, present };
          } else {
            updatedAttendance.push({ date, present });
          }

          return { ...student, attendance: updatedAttendance };
        }
        return student;
      })
    );
  };

  const handleAddObservation = (studentId: number, observation: string) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            observations: [...student.observations, observation],
          };
        }
        return student;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-[1800px]">
        <Header />
        
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Aujourd'hui</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gestion</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <AttendanceTable
              students={students}
              onMarkAttendance={handleMarkAttendance}
              onAddObservation={handleAddObservation}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <MonthlyCalendar
              students={students}
              onMarkAttendance={handleMarkAttendance}
            />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentManagement
              students={students}
              onAddStudent={handleAddStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
