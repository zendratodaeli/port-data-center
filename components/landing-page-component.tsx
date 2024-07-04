"use client"

import NavbarLadingPage from "@/components/navbar-landing-page";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion"

const LandingPageComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"]
  })

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="w-[350px] h-screen bg-blue-700 rounded-br-3xl relative">
          <div className="absolute inset-0 grid-pattern"></div>
        </div>
        <div className="flex flex-col items-center justify-center w-[350px] bg-slate-900 absolute z-50 bottom-32 top-32 shadow-2xl left-20 border-spacing-2 rounded-tl-3xl rounded-br-3xl">
          <div>
            <p className=" text-5xl text-white text-center">
              Port Data Center
            </p>
            <NavbarLadingPage />
          </div>
        </div>
        <div className="w-full h-[20rem]">
          <div className="bg-[url('/background.jpg')] bg-cover h-[20rem] pl-48 flex items-center shadow-2xl rounded-br-3xl">
            <div className="absolute inset-0 grid-pattern"></div>
          </div>
          <div className="bg-gray-50 h-[13rem] pl-48 mt-20 space-y-3">
            <p className="text-7xl font-serif font-bold">
              {"Let's"} collect the data from the vessel
            </p>
            <p className=" text-4xl font-serif">
              Effortlessly, efficiently, and effectively
            </p>
          </div>
        </div>
      </div>

      <motion.div 
        ref={ref} 
        className=" h-screen"
        style={{
          scale: scaleProgress,
          opacity: scrollYProgress
        }}
      >
        <main className="flex-grow container mx-auto p-6">
          <section className="text-center mt-16 mb-10 space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Uploading & Updating
            </h1>
            <h1 className="text-3xl md:text-5xl font-bold">
              Your {"Vessel's"} data through Port Data Center
            </h1>
            <p className="text-gray-500 my-6 text-sm md:text-base">
              {"Here's"} how you can successfully accomplish this with precision
              and confidence. Watch the video below for detailed guidance.
            </p>
          </section>
          <section className="bg-white shadow-md rounded-lg p-4 md:p-6">
            {/* <video
            src="/home-video.mp4"
              controls
            className="w-full h-auto rounded-lg"
          /> */}
            <h1 className="text-center">We are currently working on it.</h1>
          </section>
        </main>
      </motion.div>

      <div className=" flex justify-center mb-10">
            <div>
              <SignedOut>
                <Button>
                  <Link href={"/dashboard"}>Get started</Link>
                </Button>
              </SignedOut>
            </div>
            <div>
              <SignedIn>
                <Button>
                  <Link href={"/sign-in"}>Go to dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
    </div>
  );
};

export default LandingPageComponent;