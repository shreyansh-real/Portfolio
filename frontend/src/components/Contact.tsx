import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

// ── Live local time (IST) ─────────────────────────────────────────────────────
function LiveTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ color: 'var(--accent)' }}>{time} IST</span>
  );
}

// ── Socials ────────────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: 'Email',
    icon: Mail,
    value: 'shreyanshmpatel1408@gmail.com',
    href: 'mailto:shreyanshmpatel1408@gmail.com',
  },
  {
    label: 'GitHub',
    icon: Github,
    value: 'shreyansh-real',
    href: 'https://github.com/shreyansh-real',
  },
  {
    label: 'LinkedIn',
    icon: Linkedin,
    value: 'Shreyansh Patel',
    href: 'https://www.linkedin.com/in/shreyansh-patel-581b41371/',
  },
  {
    label: 'Instagram',
    icon: Instagram,
    value: '@not.real_shreyansh',
    href: 'https://www.instagram.com/not.real_shreyansh/',
  },
];

// ── Input / Textarea ──────────────────────────────────────────────────────────
function Field({
  label, id, type = 'text', value, onChange, placeholder, disabled, multiline = false,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled: boolean;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const sharedStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused ? 'var(--accent)' : 'rgba(165,165,172,0.25)'}`,
    color: 'var(--fg-white)',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'none',
    caretColor: 'var(--accent)',
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: focused ? 'var(--accent)' : 'var(--fg-mute)',
          marginBottom: '8px',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={4}
          required
          disabled={disabled}
          style={{ ...sharedStyle, display: 'block' }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          disabled={disabled}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const endpoint = `${getApiUrl()}/api/contact`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage(data.message || "Message sent! I'll be in touch soon.");
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to send. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatusMessage(`Connection failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = (i: number) => ({
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    },
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-pad"
      style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--bg-void), var(--bg-surface) 20%, var(--bg-surface))',
        overflow: 'hidden',
      }}
    >
      {/* Aqua ambient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(47,230,255,0.08), transparent 70%)',
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
          style={{ marginBottom: '20px' }}
        >
          04 — Let's Connect
        </motion.p>

        <motion.h2
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp(1)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            color: 'var(--fg-white)',
            marginBottom: '24px',
          }}
        >
          Let's build<br />
          <span style={{ color: 'var(--accent)' }}>something.</span>
        </motion.h2>

        {/* Live time */}
        <motion.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp(2)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--fg-mute)',
            marginBottom: '72px',
            letterSpacing: '0.05em',
          }}
        >
          It's currently <LiveTime /> — I typically reply within a day.
        </motion.p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* — Form — */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp(3)}
          >
            <form onSubmit={handleSubmit} noValidate>
              <Field
                label="Your Name"
                id="contact-name"
                value={formData.name}
                onChange={v => setFormData(d => ({ ...d, name: v }))}
                placeholder="e.g. Priya Sharma"
                disabled={loading}
              />
              <Field
                label="Email Address"
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={v => setFormData(d => ({ ...d, email: v }))}
                placeholder="you@example.com"
                disabled={loading}
              />
              <Field
                label="What are you looking to build?"
                id="contact-message"
                value={formData.message}
                onChange={v => setFormData(d => ({ ...d, message: v }))}
                placeholder="Tell me about your project, idea, or opportunity..."
                disabled={loading}
                multiline
              />

              {/* Status feedback */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 20px',
                    background: 'rgba(47,230,255,0.06)',
                    border: '1px solid rgba(47,230,255,0.2)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                  }}
                >
                  <CheckCircle size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--fg-white)' }}>
                    {statusMessage}
                  </span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '14px 20px',
                    background: 'rgba(255,80,80,0.06)',
                    border: '1px solid rgba(255,80,80,0.2)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                  }}
                >
                  <AlertCircle size={16} style={{ color: '#FF5050', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--fg-mute)' }}>
                    {statusMessage}
                  </span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 36px',
                  background: loading ? 'rgba(47,230,255,0.3)' : 'var(--accent)',
                  color: '#0A0A0B',
                  border: 'none',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'blink 1s step-end infinite' }}>···</span>
                    Sending
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* — Socials + Direct email — */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp(4)}
          >
            {/* Direct email */}
            <div style={{ marginBottom: '48px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--fg-mute)', marginBottom: '12px',
              }}>
                Direct email
              </p>
              <a
                href="mailto:shreyanshmpatel1408@gmail.com"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(16px, 2vw, 22px)',
                  fontWeight: 500,
                  color: 'var(--fg-white)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(47,230,255,0.3)',
                  paddingBottom: '2px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--fg-white)';
                  e.currentTarget.style.borderColor = 'rgba(47,230,255,0.3)';
                }}
              >
                shreyanshmpatel1408@gmail.com
              </a>
            </div>

            {/* Social links */}
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--fg-mute)', marginBottom: '20px',
              }}>
                Find me online
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {SOCIALS.map(({ label, icon: Icon, value, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      textDecoration: 'none',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid transparent',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(47,230,255,0.2)';
                      e.currentTarget.style.background = 'rgba(47,230,255,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'var(--fg-mute)', marginBottom: '2px',
                      }}>
                        {label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '15px',
                        color: 'var(--fg-white)',
                      }}>
                        {value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
        textarea::placeholder, input::placeholder {
          color: rgba(165,165,172,0.4);
          font-family: var(--font-body);
        }
      `}</style>
    </section>
  );
}
