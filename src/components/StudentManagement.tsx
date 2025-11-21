import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { Student } from "@/types/student";
import StudentForm from "./StudentForm";
import { toast } from "sonner";

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onEditStudent: (id: number, name: string) => void;
  onDeleteStudent: (id: number) => void;
}

const StudentManagement = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentManagementProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Gestion des Élèves</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un élève
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel élève</DialogTitle>
            </DialogHeader>
            <StudentForm onSave={(name) => onAddStudent(name)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {students.map((student) => (
          <Card key={student.id} className="p-4 bg-background border-border hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{student.name}</span>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier l'élève</DialogTitle>
                    </DialogHeader>
                    <StudentForm
                      student={student}
                      onSave={(name, id) => {
                        if (id) onEditStudent(id, name);
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer cet élève ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes les données de présence et observations de{" "}
                        <span className="font-semibold">{student.name}</span> seront supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteStudent(student.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun élève ajouté. Cliquez sur "Ajouter un élève" pour commencer.
        </div>
      )}
    </Card>
  );
};

export default StudentManagement;
