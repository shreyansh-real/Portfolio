
import { GraduationCap, Code, Rocket, Trophy } from 'lucide-react';
import { useParallax, useScrollIntro } from '../hooks/useParallax';

const journeyData = [
  {
    id: 1,
    icon: GraduationCap,
    title: 'Started Degree in CS',
    period: '2025 - 2028 (Present)',
    description: 'Began my journey in Computer Science, diving deep into programming fundamentals and web technologies.',
    color: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 2,
    icon: Code,
    title: 'Web Development',
    period: '2025-2026',
    description: 'Drive into the world of web development, by gaining knowledge of JavaScript, React.js, Firebase and MySQL, and building several projects to apply my skills.',
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Frontend Focus',
    period: '2025',
    description: 'Expanded knowledge in the field of Html and CSS, and made some intresting frontend projects.',
    color: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 4,
    icon: Trophy,
    title: 'Senior Secondary Education (12th)',
    period: '2023 - 2025',
    description: 'Developed the foundation in C, C++ and Python. Solved numerous coding challenges and build problem solving skills.',
    color: 'from-cyan-500 to-cyan-700'
  }
];

function Journey() {
  const { ref: titleRef, translateY: titleY } = useParallax({ speed: 0.4, direction: 'up' });
  const { ref: introRef, isVisible: isIntroVisible } = useScrollIntro(0.2);

  return (
    <section id="journey" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>

      {/* Parallax background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title with parallax */}
        <div ref={titleRef} style={{ transform: `translateY(${titleY * -0.3}px)` }}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            My Journey
          </h2>
        </div>
        <p className="text-center text-gray-400 mb-20">A timeline of my learning and growth</p>

        {/* Timeline Container */}
        <div ref={introRef} className="relative">
          {/* Central Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 via-cyan-400 to-cyan-600"></div>

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {journeyData.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative transform transition-all duration-500 ${
                    isIntroVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isIntroVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {/* Responsive Layout */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isEven ? 'md:direction-rtl' : ''}`}>
                    {/* Content Card */}
                    <div className={`${isEven ? 'md:col-start-1' : 'md:col-start-2'}`}>
                      <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-105">
                        {/* Decorative corner elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-tr-2xl"></div>

                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all group-hover:scale-110`}>
                          <Icon size={32} className="text-gray-900" />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-cyan-400/80 text-sm font-semibold mb-4 uppercase tracking-wider">
                          {item.period}
                        </p>

                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                          {item.description}
                        </p>

                        {/* Hover indicator */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:flex justify-center absolute left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        {/* Outer glow circle */}
                        <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-pulse"></div>
                        
                        {/* Main dot */}
                        <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-4 border-gray-900 shadow-lg shadow-cyan-500/50"></div>

                        {/* Number/counter */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-xs font-bold flex items-center justify-center text-cyan-900">
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Timeline Dot - Hidden */}
                    <div className="hidden">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-pulse"></div>
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-4 border-gray-900 shadow-lg shadow-cyan-500/50 flex items-center justify-center">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom accent */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 bottom-0 w-2 h-20 bg-gradient-to-b from-cyan-500 to-transparent"></div>
        </div>

        {/* Stats Section with parallax */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: '4+', desc: 'Key Milestones' },
            { label: '100%', desc: 'Committed' },
            { label: '∞', desc: 'Learning' },
            { label: '✓', desc: 'Passionate' }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-cyan-500/20 text-center hover:border-cyan-500/50 transition-all duration-300 transform ${
                isIntroVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: isIntroVisible ? `${(journeyData.length + index) * 50}ms` : '0ms'
              }}
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journey;
