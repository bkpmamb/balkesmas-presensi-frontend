// config/employee.config.ts

export const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export const attendanceAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        // ease: [0.39, 0.24, 0.3, 1],
      },
    },
  },
  card: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        // ease: [0.39, 0.24, 0.3, 1],
      },
    },
  },
  button: {
    tap: { scale: 0.98 },
    hover: { scale: 1.02 },
  },
};

export const clockStatusConfig = {
  ontime: {
    label: "Tepat Waktu",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  late: {
    label: "Terlambat",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  normal: {
    label: "Normal",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  early: {
    label: "Pulang Awal",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
};
