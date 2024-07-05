"use client";

import NavbarLadingPage from "@/components/navbar-landing-page";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import TypewriterComponent from "typewriter-effect";
import Image from "next/image";

const LandingPageComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div>
      <div className="h-screen flex flex-col md:flex-row justify-between">
        <div className="w-full h-[20rem]">
          <div className="bg-[url('/background.jpg')] bg-cover h-[20rem] pl-48 md:flex items-center shadow-2xl">
            <div className="absolute inset-0 grid-pattern"></div>
          </div>
          <div className=" h-[200px] bg-blue-700 w-[300px] md:w-[500px] mx-auto mt-[-80px] rounded-3xl">
            <NavbarLadingPage />
            <div className=" text-center text-xl font-serif text-white mt-2">
              Welcome to
            </div>
            <div className=" text-center text-4xl font-serif text-white mt-2">
              Port Data Center
            </div>
          </div>
          <div className="bg-gray-50 md:h-[13rem] pl-4 mt-10 mb-14 space-y-3 text-center">
            <p className="text-7xl font-serif font-bold">
              {"Let's"} collect the data from the vessel
            </p>
            <div className=" text-4xl font-serif">
              <TypewriterComponent
                options={{
                  strings: ["Effortlessly", "Efficiently,", "and Effectively."],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
            <p className="text-3xl font-serif font-bold underline">
              {`"to speed up and increase the productivity of the port & vessel"`}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        ref={ref}
        className=" mt-[100px]"
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
