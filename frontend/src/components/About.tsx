import { useState } from 'react';
import { User, Target, Heart } from 'lucide-react';
import { useParallax, useScrollIntro } from '../hooks/useParallax';

const cards = [
  {
    id: 1,
    title: 'Who I Am',
    icon: User,
    description: 'A passionate BSc Computer Science First Year student with a keen interest in Full Stack Development. I love turning ideas into reality through code.',
    gradient: 'from-cyan-400 to-cyan-600',
    details: 'Curious, driven, and always eager to learn new technologies'
  },
  {
    id: 2,
    title: 'My Goal',
    icon: Target,
    description: 'To become a proficient Full Stack Developer and create impactful web applications that solve real-world problems and enhance user experiences.',
    gradient: 'from-cyan-600 to-teal-400',
    details: 'Building products that make a difference in the world'
  },
  {
    id: 3,
    title: 'What I Love',
    icon: Heart,
    description: 'Building responsive UIs, exploring new technologies, solving complex problems, and continuously learning to stay updated with the latest in web development.',
    gradient: 'from-cyan-300 to-cyan-500',
    details: 'Passionate about clean code and beautiful designs'
  },
];

function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref: titleRef, translateY: titleY } = useParallax({ speed: 0.4, direction: 'up' });
  const { ref: introRef, isVisible: isIntroVisible } = useScrollIntro(0.2);
  const { ref: stackRef, translateY: stackY } = useParallax({ speed: 0.12, direction: 'up' });

  const handleCardClick = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes stack-pop {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95) rotateX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }

        @keyframes stack-exit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.95) rotateX(-10deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(34, 211, 238, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }

        .float-animate {
          animation: float 3s ease-in-out infinite;
        }

        .glow-pulse {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        .stacked-card {
          perspective: 1200px;
        }

        .card-container {
          position: relative;
          height: 550px;
          perspective: 1200px;
        }

        @media (max-width: 768px) {
          .card-container {
            height: auto;
            padding: 0 1rem;
          }
        }

        .card-inner {
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
          animation: stack-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
        }

        @media (max-width: 768px) {
          .card-inner {
            position: relative;
            margin-bottom: 1rem;
            transform: translateY(0) !important;
            opacity: 1 !important;
            height: auto;
            animation: none;
          }
        }

        .card-inner.exiting {
          animation: stack-exit 0.4s ease-in forwards;
        }

        .card-inner:hover .card-content {
          transform: translateY(-5px);
        }

        .card-content {
          relative: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
      `}</style>

      <section id="about" className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl -translate-y-1/2 opacity-40 float-animate"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl translate-y-1/2 opacity-40 float-animate" style={{ animationDelay: '1.5s' }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Title with parallax */}
          <div ref={titleRef} style={{ transform: `translateY(${titleY * -0.3}px)` }}>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-center text-gray-400 mb-20">Pick each card to reveal my story</p>
          </div>

          {/* Stacked Cards Section */}
          <div ref={introRef} className={`stacked-card mb-12 transition-opacity duration-500 ${isIntroVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="card-container" ref={stackRef}>
                  {cards.map((card, index) => {
                    const Icon = card.icon;
                    const position = index - currentIndex;
                    const isVisible = position >= 0 && position <= 2;
                    
                    if (!isVisible) return null;

                    return (
                      <div
                        key={card.id}
                        className="card-inner"
                        style={{
                          zIndex: 100 - position,
                          // stacking offset + subtle parallax movement based on scroll
                          transform: `translateY(${position * 40 + (stackY * -0.06 * position)}px) scale(${1 - position * 0.035}) rotateX(${position * 3}deg)`,
                          opacity: 1 - position * 0.08
                        }}
                        onClick={handleCardClick}
                      >
                        <div className="card-content">
                          <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-slate-950 rounded-3xl p-8 md:p-12 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl group glow-pulse h-full cursor-pointer hover:border-cyan-500/70 transition-colors">
                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"></div>

                            {/* Top decorative line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-t-3xl"></div>

                            {/* Icon section */}
                            <div className="relative mb-8 flex justify-center">
                              <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-cyan-600/30 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 float-animate`}>
                                  <Icon size={36} className="text-gray-900 md:w-12 md:h-12 w-9 h-9" />
                                </div>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cyan-100 group-hover:text-white transition-colors duration-300">
                              {card.title}
                            </h3>

                            {/* Details tagline */}
                            <p className="text-center text-cyan-300 text-sm font-semibold mb-6 uppercase tracking-widest">
                              {card.details}
                            </p>

                            {/* Main description */}
                            <p className="text-center text-white text-base md:text-lg leading-relaxed mb-8 group-hover:text-gray-100 transition-colors duration-300">
                              {card.description}
                            </p>

                            {/* Click indicator */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-cyan-400/60 text-xs font-semibold animate-bounce">
                              CLICK TO NEXT →
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-b-3xl"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="text-center mt-12">
            <div className="flex justify-center gap-2 mb-4">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-cyan-500' : 'w-2 bg-cyan-500/40'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              <span className="text-cyan-400 font-semibold">{currentIndex + 1}</span> / {cards.length}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
