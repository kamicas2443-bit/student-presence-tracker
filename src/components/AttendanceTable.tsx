import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, MessageSquare, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  attendance: { date: string; present: boolean }[];
  observations: string[];
}

const AttendanceTable = () => {
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
    {
      id: 4,
      name: "Yasmine Ouali",
      attendance: [],
      observations: [],
    },
    {
      id: 5,
      name: "Karim Hassani",
      attendance: [],
      observations: [],
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newObservation, setNewObservation] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const markAttendance = (studentId: number, present: boolean) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const existingIndex = student.attendance.findIndex((a) => a.date === today);
          const updatedAttendance = [...student.attendance];
          
          if (existingIndex >= 0) {
            updatedAttendance[existingIndex] = { date: today, present };
          } else {
            updatedAttendance.push({ date: today, present });
          }

          return { ...student, attendance: updatedAttendance };
        }
        return student;
      })
    );
    toast.success(present ? "Présence marquée" : "Absence marquée");
  };

  const addObservation = () => {
    if (!selectedStudent || !newObservation.trim()) return;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            observations: [...student.observations, newObservation],
          };
        }
        return student;
      })
    );

    toast.success("Observation ajoutée");
    setNewObservation("");
  };

  const calculateMonthlyAbsenceRate = (student: Student) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyAttendance = student.attendance.filter((a) => {
      const date = new Date(a.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    if (monthlyAttendance.length === 0) return 0;

    const absences = monthlyAttendance.filter((a) => !a.present).length;
    return Math.round((absences / monthlyAttendance.length) * 100);
  };

  const getTodayAttendance = (student: Student) => {
    return student.attendance.find((a) => a.date === today);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => {
          const todayRecord = getTodayAttendance(student);
          const absenceRate = calculateMonthlyAbsenceRate(student);

          return (
            <Card
              key={student.id}
              className="p-6 bg-gradient-card border-border hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{student.name}</h3>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={todayRecord?.present ? "default" : todayRecord?.present === false ? "destructive" : "secondary"}
                      className={
                        todayRecord?.present
                          ? "bg-success hover:bg-success/90"
                          : todayRecord?.present === false
                          ? "bg-destructive"
                          : "bg-muted"
                      }
                    >
                      {todayRecord?.present ? "Présent" : todayRecord?.present === false ? "Absent" : "Non marqué"}
                    </Badge>
                    {absenceRate > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        <span className="font-medium">{absenceRate}%</span>
                        <span>d'absence ce mois</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => markAttendance(student.id, true)}
                    disabled={todayRecord?.present === true}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Présent
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => markAttendance(student.id, false)}
                    disabled={todayRecord?.present === false}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Observation
                        {student.observations.length > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {student.observations.length}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Observations - {student.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Ajouter une observation..."
                            value={newObservation}
                            onChange={(e) => setNewObservation(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button onClick={addObservation} className="w-full">
                            Ajouter l'observation
                          </Button>
                        </div>

                        {student.observations.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              Observations précédentes
                            </h4>
                            {student.observations.map((obs, index) => (
                              <div
                                key={index}
                                className="p-3 bg-muted rounded-lg text-sm"
                              >
                                {obs}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTable;
