import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="h-full hidden">
        <SideBar />
      </div>
      <NavBar />
      {children}
    </div>
  );
};

export default DashboardLayout;
