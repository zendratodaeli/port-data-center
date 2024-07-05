"use client";

import NavbarLadingPage from "@/components/navbar-landing-page";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import TypewriterComponent from "typewriter-effect";
import Image from "next/image";
import LandingPageExternalComponent from "./landing-page-external-component";

const LandingPageComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div>
      <div className="h-screen flex flex-col md:flex-row justify-between">
        <div className="w-full h-[20rem] relative">
          <div className="bg-[url('/background.jpg')] bg-cover h-[30rem] pl-48 md:flex items-center shadow-2xl relative z-10">
            <div className="absolute inset-0 grid-pattern z-0"></div>
          </div>
          <div className="h-[200px] bg-blue-700 w-[300px] md:w-[500px] mx-auto mt-[-80px] rounded-3xl relative z-20">
            <NavbarLadingPage />
            <div className="text-center text-xl font-serif text-white mt-2">
              Welcome to
            </div>
            <div className="text-center text-4xl font-serif text-white mt-2">
              Port Data Center
            </div>
          </div>
        </div>
      </div>
      
      <LandingPageExternalComponent />

      <motion.div
        ref={ref}
        className="h-screen"
        style={{
          scale: scaleProgress,
          opacity: scrollYProgress,
        }}
      >
        <main className="flex-grow container mx-auto mt-5 p-6">
          <section className="text-center mb-10 space-y-2">
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
            <Image
              src={"/background.jpg"}
              width={400}
              height={400}
              className="w-full"
              alt="background"
            />
          </section>
        </main>
      </motion.div>
    </div>
  );
};

export default LandingPageComponent;