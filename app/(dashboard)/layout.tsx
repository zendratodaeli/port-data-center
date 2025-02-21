import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="h-full hidden">
        <SideBar />
      </div>
      <NavBar/>
      <div className="mt-16">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
