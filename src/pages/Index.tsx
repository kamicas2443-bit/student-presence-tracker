import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AttendanceTable from "@/components/AttendanceTable";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import StudentManagement from "@/components/StudentManagement";
import ImportExport from "@/components/ImportExport";
import MonthlyReport from "@/components/MonthlyReport";
import { Student } from "@/types/student";
import { toast } from "sonner";
import { Calendar, Users, Settings, FileSpreadsheet, BarChart3 } from "lucide-react";

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

  const handleImportStudents = (importedStudents: Student[]) => {
    setStudents(importedStudents);
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
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 h-auto">
            <TabsTrigger value="today" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Aujourd'hui</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Bilan</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Import/Export</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Gestion</span>
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

          <TabsContent value="report" className="space-y-6">
            <MonthlyReport students={students} />
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <ImportExport students={students} onImportStudents={handleImportStudents} />
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
