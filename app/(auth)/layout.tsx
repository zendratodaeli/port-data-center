const AuthLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen shadow-md p-16">      
      <div className="mx-auto grid grid-cols-2 bg-[url('/background.jpg')] bg-cover h-[20rem] w-full md:flex items-center shadow-2xl">
        <div className="inset-0 grid-pattern z-0"></div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AuthLayoutPage;
