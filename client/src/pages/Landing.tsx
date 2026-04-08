import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-['Inter']">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        
        {/* Navigation Bar */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">DesignPro</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-gray-700">
            {['Home', 'About Us', 'Courses', 'Instructors', 'Testimonials', 'Blog'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-white/80 hover:text-white text-sm px-4 py-1 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center">
            <button className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 group px-6 py-2">
              Contact us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <button className="lg:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        {/* Top Info Section */}
        <div className="w-full max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-2 gap-8 items-start">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white/80 text-sm md:text-base max-w-md leading-relaxed"
          >
            We deliver transformative programs that empower emerging product designers with cutting-edge expertise and vision to thrive globally.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white/80 text-sm md:text-base lg:text-right font-medium"
          >
            8000+ Talented Designers Launched !
          </motion.p>
        </div>

        {/* Main Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-bold"
          >
            Empowering Your Future
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
          >
            <div className="text-white font-medium">Elevate Your</div>
            <ShinyText text="Product Vision" />
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <Button 
              onClick={handleLogin}
              className="bg-black hover:bg-gray-900 text-white rounded-full px-8 md:px-10 py-6 md:py-8 text-lg font-bold group border border-white/10 transition-all active:scale-95"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
