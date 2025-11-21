import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Student } from "@/types/student";
import { cn } from "@/lib/utils";

interface MonthlyCalendarProps {
  students: Student[];
  onMarkAttendance: (studentId: number, date: string, present: boolean) => void;
}

const MonthlyCalendar = ({ students, onMarkAttendance }: MonthlyCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAttendanceForDate = (student: Student, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return student.attendance.find((a) => a.date === dateStr);
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Calendrier Mensuel</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg min-w-[200px] text-center">
            {monthNames[month]} {year}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Ajoutez des élèves pour voir le calendrier
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left font-semibold border-b border-border sticky left-0 bg-card z-10">
                  Élève
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const date = new Date(year, month, day);
                  const isToday = isCurrentMonth && day === today.getDate();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <th
                      key={day}
                      className={cn(
                        "p-2 text-center text-xs font-medium border-b border-border min-w-[50px]",
                        isWeekend && "bg-muted/30",
                        isToday && "bg-primary/10 font-bold"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">
                          {dayNames[date.getDay()]}
                        </span>
                        <span className={cn(isToday && "text-primary font-bold")}>{day}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-2 font-medium sticky left-0 bg-card z-10 border-r border-border">
                    {student.name}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const date = new Date(year, month, day);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isToday = isCurrentMonth && day === today.getDate();
                    const attendance = getAttendanceForDate(student, day);
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    return (
                      <td
                        key={day}
                        className={cn(
                          "p-1 text-center",
                          isWeekend && "bg-muted/30",
                          isToday && "bg-primary/10"
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {attendance ? (
                            <Badge
                              variant={attendance.present ? "default" : "destructive"}
                              className={cn(
                                "h-6 w-6 p-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity",
                                attendance.present && "bg-success hover:bg-success/90"
                              )}
                              onClick={() => onMarkAttendance(student.id, dateStr, !attendance.present)}
                            >
                              {attendance.present ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Badge>
                          ) : (
                            <div className="flex gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-success/20"
                                onClick={() => onMarkAttendance(student.id, dateStr, true)}
                              >
                                <Check className="h-3 w-3 text-success" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-destructive/20"
                                onClick={() => onMarkAttendance(student.id, dateStr, false)}
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default MonthlyCalendar;
