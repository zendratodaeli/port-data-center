import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavbarLadingPage = () => {
  return (
    <div className=" bg-slate-50">
      <div className="flex justify-center p-5 shadow-lg">
        <div className="flex items-center">
          <div>
            <SignedIn>
              <Button>
                <Link href={"/data"}>Go to Data</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
        <div>
          <SignedOut>
            <Button>
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default NavbarLadingPage;
