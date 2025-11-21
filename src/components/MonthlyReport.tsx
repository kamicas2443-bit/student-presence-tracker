import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Student } from "@/types/student";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface MonthlyReportProps {
  students: Student[];
}

const MonthlyReport = ({ students }: MonthlyReportProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getMonthlyStats = (student: Student) => {
    const monthlyAttendance = student.attendance.filter((a) => {
      const date = new Date(a.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const totalDays = monthlyAttendance.length;
    const presences = monthlyAttendance.filter((a) => a.present).length;
    const absences = monthlyAttendance.filter((a) => !a.present).length;
    const absenceRate = totalDays > 0 ? Math.round((absences / totalDays) * 100) : 0;
    const presenceRate = totalDays > 0 ? Math.round((presences / totalDays) * 100) : 0;

    return {
      totalDays,
      presences,
      absences,
      absenceRate,
      presenceRate,
    };
  };

  const getOverallStats = () => {
    let totalPresences = 0;
    let totalAbsences = 0;
    let totalDays = 0;

    students.forEach((student) => {
      const stats = getMonthlyStats(student);
      totalPresences += stats.presences;
      totalAbsences += stats.absences;
      totalDays += stats.totalDays;
    });

    const avgAbsenceRate = totalDays > 0 ? Math.round((totalAbsences / totalDays) * 100) : 0;
    const avgPresenceRate = totalDays > 0 ? Math.round((totalPresences / totalDays) * 100) : 0;

    return {
      totalPresences,
      totalAbsences,
      totalDays,
      avgAbsenceRate,
      avgPresenceRate,
      totalStudents: students.length,
    };
  };

  const exportReport = () => {
    if (students.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const reportData = students.map((student) => {
      const stats = getMonthlyStats(student);
      return {
        Nom: student.name,
        "Jours enregistrés": stats.totalDays,
        Présences: stats.presences,
        Absences: stats.absences,
        "Taux de présence (%)": stats.presenceRate,
        "Taux d'absence (%)": stats.absenceRate,
        Observations: student.observations.length,
      };
    });

    // Ajouter les statistiques globales
    const overall = getOverallStats();
    reportData.push({
      Nom: "--- STATISTIQUES GLOBALES ---",
      "Jours enregistrés": overall.totalDays,
      Présences: overall.totalPresences,
      Absences: overall.totalAbsences,
      "Taux de présence (%)": overall.avgPresenceRate,
      "Taux d'absence (%)": overall.avgAbsenceRate,
      Observations: 0,
    });

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Bilan ${monthNames[month]}`);

    const fileName = `bilan_${monthNames[month]}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Rapport exporté : ${fileName}`);
  };

  const overall = getOverallStats();

  const getStatusIcon = (rate: number) => {
    if (rate >= 20) return <TrendingDown className="h-5 w-5 text-destructive" />;
    if (rate >= 10) return <Minus className="h-5 w-5 text-warning" />;
    return <TrendingUp className="h-5 w-5 text-success" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Bilan Mensuel des Absences</h2>
            <p className="text-muted-foreground">
              Rapport détaillé des présences et absences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg min-w-[180px] text-center">
              {monthNames[month]} {year}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-background border-border">
            <div className="text-sm text-muted-foreground mb-1">Total élèves</div>
            <div className="text-2xl font-bold text-foreground">{overall.totalStudents}</div>
          </Card>
          <Card className="p-4 bg-background border-border">
            <div className="text-sm text-muted-foreground mb-1">Total présences</div>
            <div className="text-2xl font-bold text-success">{overall.totalPresences}</div>
          </Card>
          <Card className="p-4 bg-background border-border">
            <div className="text-sm text-muted-foreground mb-1">Total absences</div>
            <div className="text-2xl font-bold text-destructive">{overall.totalAbsences}</div>
          </Card>
          <Card className="p-4 bg-background border-border">
            <div className="text-sm text-muted-foreground mb-1">Taux d'absence moyen</div>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
              {overall.avgAbsenceRate}%
              {getStatusIcon(overall.avgAbsenceRate)}
            </div>
          </Card>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={exportReport} disabled={students.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exporter le rapport Excel
          </Button>
        </div>
      </Card>

      {/* Détails par élève */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Détail par élève</h3>
        
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun élève à afficher
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => {
              const stats = getMonthlyStats(student);
              return (
                <Card
                  key={student.id}
                  className="p-5 bg-background border-border hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-3">{student.name}</h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Jours enregistrés</div>
                          <div className="text-lg font-semibold">{stats.totalDays}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Présences</div>
                          <div className="text-lg font-semibold text-success">{stats.presences}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Absences</div>
                          <div className="text-lg font-semibold text-destructive">{stats.absences}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Observations</div>
                          <div className="text-lg font-semibold">{student.observations.length}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Taux de présence</span>
                          <Badge className="bg-success hover:bg-success/90">
                            {stats.presenceRate}%
                          </Badge>
                        </div>
                        <Progress value={stats.presenceRate} className="h-2" />
                      </div>

                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Taux d'absence</span>
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            {stats.absenceRate}%
                            {getStatusIcon(stats.absenceRate)}
                          </Badge>
                        </div>
                        <Progress
                          value={stats.absenceRate}
                          className="h-2 [&>div]:bg-destructive"
                        />
                      </div>
                    </div>
                  </div>

                  {stats.totalDays === 0 && (
                    <div className="mt-3 text-sm text-muted-foreground italic">
                      Aucune présence enregistrée pour ce mois
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MonthlyReport;
