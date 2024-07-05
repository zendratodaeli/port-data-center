"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import TypewriterComponent from "typewriter-effect";

const LandingPageExternalComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }

    console.log(isInView);
  }, [isInView, mainControls, slideControls]);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-center gap-y-4 space-y-5"
      style={{ position: "relative", width: "fit-content", overflow: "hidden" }}
      ref={ref}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <p className="text-6xl md:text-8xl font-mono font-bold">
          {"Let's"} collect the data from the vessel
        </p>
        <div className=" text-4xl font-bold">
          <TypewriterComponent
            options={{
              strings: ["Effortlessly", "Efficiently,", "and Effectively."],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </motion.div>
      <p className="text-3xl font-serif font-bold underline">
        {`"to speed up and increase the productivity of the port & vessel"`}
      </p>
    </div>
  );
};

export default LandingPageExternalComponent;
