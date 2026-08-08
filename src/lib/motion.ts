export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
};

export const viewportOnce = { once: true, margin: "-80px" as const };
