import { Calendar, Users } from "lucide-react";

const Header = () => {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-gradient-primary text-primary-foreground rounded-xl p-8 shadow-lg mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Users className="h-8 w-8" />
            Gestion des Présences
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Suivez les présences et absences de vos élèves
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-3 rounded-lg">
          <Calendar className="h-5 w-5" />
          <span className="font-medium capitalize">{today}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
