import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavbarLadingPage = () => {
  return (
    <div className=" bg-slate-50">
      <div className="flex justify-center p-5 shadow-lg">
        <div className="flex items-center">
          <div>
            <SignedIn>
              <div className="grid  place-content-center bg-slate-900 p-4 rounded-full">
                <DrawOutlineButton>
                  <Link href={"/data"}>Go to Data</Link>
                </DrawOutlineButton>
              </div>
            </SignedIn>
          </div>
        </div>
        <div>
          <SignedOut>
            <div className="grid  place-content-center bg-slate-900 p-4 rounded-full">
              <DrawOutlineButton>
                <Link href={"/sign-in"}>Login</Link>
              </DrawOutlineButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

interface DrawOutlineButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const DrawOutlineButton: React.FC<DrawOutlineButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className="group relative px-4 py-2 font-medium text-slate-100 transition-colors duration-[400ms] hover:text-indigo-300 rounded-full"
    >
      <span>{children}</span>
{/* 
      TOP
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full rounded-full" />

      <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full rounded-full" />
<span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full rounded-full" />

      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full rounded-full" /> */}
    </button>
  );
};

export default NavbarLadingPage;
