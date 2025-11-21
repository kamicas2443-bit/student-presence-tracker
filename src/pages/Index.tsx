import Header from "@/components/Header";
import AttendanceTable from "@/components/AttendanceTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        <AttendanceTable />
      </div>
    </div>
  );
};

export default Index;
