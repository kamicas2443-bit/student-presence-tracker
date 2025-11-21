import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { Student } from "@/types/student";

interface StudentFormProps {
  student?: Student;
  onSave: (name: string, studentId?: number) => void;
}

const StudentForm = ({ student, onSave }: StudentFormProps) => {
  const [name, setName] = useState(student?.name || "");

  useEffect(() => {
    setName(student?.name || "");
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), student?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studentName">Nom complet de l'élève</Label>
        <Input
          id="studentName"
          placeholder="Ex: Ahmed Benali"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" disabled={!name.trim()}>
            {student ? "Modifier" : "Ajouter"}
          </Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default StudentForm;
