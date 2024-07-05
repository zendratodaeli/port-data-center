const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-[url('/background.jpg')] bg-cover h-[20rem] w-full md:flex items-center shadow-2xl mt-[-150px]">
        <div className="absolute inset-0 grid-pattern"></div>
      </div>
      <div className="mt-[-50px]">{children}</div>
    </div>
  );
};

export default AuthLayout;
