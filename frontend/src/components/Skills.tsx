import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillGroup {
  label: string;
  index: string;
  skills: string[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages',
    index: '01',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Python', 'C', 'C++'],
  },
  {
    label: 'Frameworks & Libraries',
    index: '02',
    skills: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Tools & Infrastructure',
    index: '03',
    skills: ['Firebase', 'MySQL', 'Git & GitHub', 'Vercel', 'Vite', 'VS Code'],
  },
  {
    label: 'Craft',
    index: '04',
    skills: ['Responsive UI', 'REST APIs', 'Performance', 'Accessibility', 'Clean Code'],
  },
];

function SkillPill({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06, borderColor: 'var(--accent)', color: 'var(--fg-white)' }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: '999px',
        border: '1px solid rgba(165,165,172,0.2)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--fg-mute)',
        cursor: 'default',
        transition: 'border-color 0.2s, color 0.2s',
        userSelect: 'none',
      }}
    >
      {name}
    </motion.span>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const fadeUp = (i: number) => ({
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    },
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-pad"
      style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--bg-void), var(--bg-surface) 30%, var(--bg-surface) 70%, var(--bg-void))',
      }}
    >
      {/* Aqua ambient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle at 0% 100%, rgba(47,230,255,0.04), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide">
        {/* Header */}
        <motion.p
          className="eyebrow"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp(0)}
          style={{ marginBottom: '16px' }}
        >
          03 — Skills
        </motion.p>

        <motion.h2
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp(1)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--fg-white)',
            marginBottom: '72px',
          }}
        >
          The stack I build with.
        </motion.h2>

        {/* Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp(gi * 0.15 + 2)}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: '40px',
                  alignItems: 'start',
                }}
                className="skill-row"
              >
                {/* Label */}
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--accent)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {group.index}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: 'var(--fg-white)',
                    }}
                  >
                    {group.label}
                  </span>
                </div>

                {/* Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {group.skills.map((skill, si) => (
                    <SkillPill
                      key={skill}
                      name={skill}
                      delay={gi * 0.06 + si * 0.04}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              {gi < SKILL_GROUPS.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(165,165,172,0.1)',
                    marginTop: '56px',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .skill-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
