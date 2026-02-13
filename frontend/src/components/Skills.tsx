const skillsData = [
  { name: 'HTML', level: 90, color: 'bg-cyan-500' },
  { name: 'CSS', level: 85, color: 'bg-cyan-500' },
  { name: 'JavaScript', level: 80, color: 'bg-cyan-500' },
  { name: 'React.js', level: 75, color: 'bg-cyan-500' },
  { name: 'Firebase', level: 70, color: 'bg-cyan-600' },
  { name: 'MySQL', level: 70, color: 'bg-cyan-600' },
  { name: 'Responsive UI', level: 85, color: 'bg-cyan-500' },
  { name: 'C++', level: 75, color: 'bg-cyan-600' },
  { name: 'C', level: 75, color: 'bg-cyan-600' },
  { name: 'Python', level: 70, color: 'bg-cyan-600' }
];

import { useParallax, useScrollIntro } from '../hooks/useParallax';

function Skills() {
  const { ref: titleRef, translateY: titleY } = useParallax({ speed: 0.4, direction: 'up' });
  const { ref: introRef, isVisible: isIntroVisible } = useScrollIntro(0.2);

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title with parallax */}
        <div ref={titleRef} style={{ transform: `translateY(${titleY * -0.3}px)` }}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Technical Skills
          </h2>
        </div>

        {/* Skills Grid with scroll intro */}
        <div ref={introRef} className="grid md:grid-cols-2 gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={skill.name}
              className={`group transition-all duration-500 transform ${
                isIntroVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isIntroVisible ? `${index * 60}ms` : '0ms'
              }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                  {skill.name}
                </span>
                <span className="text-cyan-400 font-bold">{skill.level}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg shadow-gray-900/50">
                <div
                  className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:scale-105 origin-left`}
                  style={{
                    width: isIntroVisible ? `${skill.level}%` : '0%',
                    animation: isIntroVisible ? `growWidth 1.5s ease-out ${index * 60}ms both` : 'none'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning section with parallax */}
        <div
            className={`mt-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 transform ${
            isIntroVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: isIntroVisible ? `${skillsData.length * 60}ms` : '0ms'
          }}
        >
          <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center hover:text-cyan-300 transition-colors">
            What I'm Currently Learning
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Advanced React Patterns', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js'].map((tech, idx) => (
              <span
                key={tech}
                className={`px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/50 rounded-full text-cyan-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform ${
                  isIntroVisible
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                style={{
                  transitionDelay: isIntroVisible ? `${(skillsData.length + idx) * 50}ms` : '0ms'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
