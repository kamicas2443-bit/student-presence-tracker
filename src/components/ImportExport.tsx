import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import { Student } from "@/types/student";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ImportExportProps {
  students: Student[];
  onImportStudents: (students: Student[]) => void;
}

const ImportExport = ({ students, onImportStudents }: ImportExportProps) => {
  const handleExport = () => {
    if (students.length === 0) {
      toast.error("Aucun élève à exporter");
      return;
    }

    // Préparer les données pour l'export
    const exportData = students.map((student) => ({
      ID: student.id,
      Nom: student.name,
      "Nombre d'observations": student.observations.length,
      "Présences enregistrées": student.attendance.length,
    }));

    // Créer un classeur Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Élèves");

    // Télécharger le fichier
    const fileName = `eleves_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Fichier ${fileName} téléchargé`);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<{
          ID?: number;
          Nom: string;
        }>(worksheet);

        // Transformer les données en format Student
        const importedStudents: Student[] = jsonData.map((row, index) => ({
          id: row.ID || Date.now() + index,
          name: row.Nom || `Élève ${index + 1}`,
          attendance: [],
          observations: [],
        }));

        if (importedStudents.length === 0) {
          toast.error("Aucun élève trouvé dans le fichier");
          return;
        }

        onImportStudents(importedStudents);
        toast.success(`${importedStudents.length} élève(s) importé(s)`);
      } catch (error) {
        console.error("Erreur lors de l'import:", error);
        toast.error("Erreur lors de la lecture du fichier Excel");
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = ""; // Reset input
  };

  const downloadTemplate = () => {
    // Créer un modèle Excel avec des exemples
    const templateData = [
      { ID: 1, Nom: "Ahmed Benali" },
      { ID: 2, Nom: "Fatima Zahra" },
      { ID: 3, Nom: "Mohammed Alami" },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Élèves");

    XLSX.writeFile(wb, "modele_eleves.xlsx");
    toast.success("Modèle téléchargé");
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <h2 className="text-2xl font-bold text-foreground mb-4">Import / Export Excel</h2>
      <p className="text-muted-foreground mb-6">
        Importez une liste d'élèves depuis un fichier Excel ou exportez la liste actuelle
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={downloadTemplate} variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Télécharger modèle
        </Button>

        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="file-input"
          />
          <Button variant="default" className="w-full bg-gradient-primary">
            <Upload className="h-4 w-4 mr-2" />
            Importer Excel
          </Button>
        </div>

        <Button
          onClick={handleExport}
          variant="default"
          className="w-full"
          disabled={students.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Format du fichier Excel :</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Colonne "ID"</strong> : Identifiant unique (optionnel)</li>
          <li>• <strong>Colonne "Nom"</strong> : Nom complet de l'élève (obligatoire)</li>
          <li>• Les présences et observations seront à ajouter après l'import</li>
        </ul>
      </div>
    </Card>
  );
};

export default ImportExport;
