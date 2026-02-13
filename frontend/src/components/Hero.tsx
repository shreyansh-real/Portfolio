import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useParallax } from "../hooks/useParallax";
import profilePic from '../profilepic.jpeg';

function Hero() {
  const [text, setText] = useState("");
  const fullText = "Full Stack Developer (Fresher)";
  const [showCursor, setShowCursor] = useState(true);
  
  const { ref: bgRef, translateY: bgY } = useParallax({ speed: 0.3, direction: 'down' });
  const { ref: contentRef, translateY: contentY } = useParallax({ speed: 0.5, direction: 'up' });

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translateY(${bgY * 0.5}px)` }}
      >
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Parallax Content - Disabled on mobile */}
      <div
        ref={contentRef}
        className="container"
        style={{ transform: window.innerWidth >= 768 ? `translateY(${contentY * 0.3}px)` : 'translateY(0)' }}
      >
        <div className="relative z-10 flex flex-col items-center px-4 animate-fade-in">
          {/* Professional Photo - Circular on Top */}
          <div className="mb-8 md:mb-12">
            <div className="relative group">
              {/* Animated background gradient circles */}
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-cyan-500/40 to-cyan-600/40 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-600/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>

              {/* Main photo container - circular */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-cyan-500/60 group-hover:border-cyan-400 transition-all duration-500 shadow-2xl shadow-cyan-500/40 group-hover:shadow-cyan-500/70">
                {/* Actual profile photo */}
                <img 
                  src={profilePic}
                  alt="Professional Profile Photo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-transparent to-cyan-600/20 opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* Text Content - Centered Below Photo */}
          <div className="max-w-2xl text-center">
            {/* Main heading with stagger animation */}
            <h1
              className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent animate-gradient transition-all duration-1000 opacity-100 translate-y-0`}
            >
              Hello, I'm Shreyansh Patel
            </h1>

            {/* Typing text with parallax */}
            <div className="text-2xl md:text-3xl text-cyan-400 mb-8 h-10 font-mono">
              {text}
              <span
                className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}
              >
                |
              </span>
            </div>

            {/* Description with fade-in */}
            <p
              className={`text-gray-300 text-lg md:text-xl mb-8 transition-all duration-1000 delay-200 opacity-100 translate-y-0`}
            >
              BSc Computer Science First Year Student with a passion for building websites
              and make the web world more beautiful.
            </p>

            {/* CTA buttons with hover parallax - hidden on mobile */}
            <div className="hidden sm:flex gap-4 flex-wrap justify-center">
              <a
                href="#journey"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg shadow-cyan-500/50 flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/70"
              >
                <Sparkles size={20} />
                View My Journey
              </a>
              <a
                href="#contact"
                className="px-8 py-3 border-2 border-cyan-500 rounded-full font-semibold hover:bg-cyan-500/10 transform transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with parallax */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-500 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
