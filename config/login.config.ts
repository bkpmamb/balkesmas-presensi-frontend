import type { Variants } from "framer-motion";

export const loginAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  leftSection: {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  rightSection: {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  logo: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  },
  card: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "backOut" },
    },
  },
  formItem: {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  },
} satisfies Record<string, Variants>;

export const alertMessages = {
  timeout: {
    className: "border-amber-200 bg-amber-50 text-amber-800",
    message:
      "Sesi Anda telah berakhir karena tidak aktif. Silakan login kembali.",
  },
  unauthorized: {
    className: "border-red-200 bg-red-50 text-red-800",
    message: "Sesi Anda tidak valid. Silakan login kembali.",
  },
};
