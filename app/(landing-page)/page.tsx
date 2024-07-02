import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="h-full">
      <div>
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
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

export default LandingPage;
