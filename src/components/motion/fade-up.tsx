"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, springTransition, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeUpProps = HTMLMotionProps<"div"> & { delay?: number };

export function FadeUp({ className, delay = 0, children, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ ...springTransition, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
