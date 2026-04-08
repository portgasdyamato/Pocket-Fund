import { motion } from "framer-motion";

interface ShinyTextProps {
  text: string;
  baseColor?: string;
  shineColor?: string;
  speed?: number;
  spread?: number;
}

export const ShinyText = ({ 
  text, 
  baseColor = "#64CEFB", 
  shineColor = "#ffffff", 
  speed = 3,
  spread = 100
}: ShinyTextProps) => {
  return (
    <motion.span
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${baseColor} 0%, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%, ${baseColor} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block"
      }}
      animate={{
        backgroundPosition: ["100% 0%", "-100% 0%"]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {text}
    </motion.span>
  );
};
