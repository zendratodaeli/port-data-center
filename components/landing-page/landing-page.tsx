"use client";

import React, { ReactNode, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import TypewriterComponent from "typewriter-effect";
import NavbarLadingPage from "../navbar-landing-page";
import Link from "next/link";

interface LandingPageComponentProps {
  mediaUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}

interface StickyMediaProps {
  mediaUrl: string;
}

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

const LandingPageComponent: React.FC = () => {

  return (
    <div className="bg-white">
      <TextParallaxContent
        mediaUrl={"/background.jpg"}
        subheading="Welcome to"
        heading="Port Data Center"
      >
        <Content />
      </TextParallaxContent>
      {/* <TextParallaxContent
        mediaUrl="/video.mp4"
        subheading="Here is how you can successfully accomplish this with precision
                  and confidence."
        heading="Watch the video below for detailed guidance."
      >
        <div className=" flex justify-center m-2">
          <a
            href="#navigation"
            className="w-full text-center rounded-3xl bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
          >
            Go Up <ArrowUp className="inline" />
          </a>
        </div>
      </TextParallaxContent> */}
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent: React.FC<LandingPageComponentProps> = ({
  mediaUrl,
  subheading,
  heading,
  children,
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyMedia mediaUrl={mediaUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyMedia: React.FC<StickyMediaProps> = ({ mediaUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const isVideo = mediaUrl.endsWith(".mp4");
  
  return (
    <motion.div
      style={{
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      {isVideo ? (
        <video
          src={mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
      ) : (
        <div
          style={{
            backgroundImage: `url(${mediaUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0"
        />
      )}
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy: React.FC<OverlayCopyProps> = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-8xl">{heading}</p>
    </motion.div>
  );
};

const Content: React.FC = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 text-center">
    <h2 className="col-span-1 text-3xl md:text-5xl font-bold">
      {`Let's`} upload, update and collect the data of the vessel
    </h2>
    <div className="col-span-1">
      <div className=" text-3xl font-bold mb-5">
        <TypewriterComponent
          options={{
            strings: ["Effortlessly", "Efficiently,", "and Effectively."],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <p className="text-2xl font-serif font-bold underline">
        {`"to speed up and increase the productivity of the port & vessel"`}
      </p>
      <div className=" mt-10" id="navigation">
        <NavbarLadingPage />
      </div>
    </div>
  </div>
);

export default LandingPageComponent;
