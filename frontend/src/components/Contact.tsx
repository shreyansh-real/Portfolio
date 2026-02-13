import { useState } from 'react';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useParallax, useScrollIntro } from '../hooks/useParallax';
import { getApiUrl } from '../utils/apiConfig';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const { ref: titleRef, translateY: titleY } = useParallax({ speed: 0.4, direction: 'up' });
  const { ref: introRef, isVisible: isIntroVisible } = useScrollIntro(0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/contact`;
      
      console.log('📤 Sending to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage(data.message || 'Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setStatus('idle');
          setIsFlipped(false);
        }, 3000);
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      console.error('❌ Form submission error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const endpoint = getApiUrl();
      setStatusMessage(`Failed to connect to ${endpoint}. Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(180deg);
          }
        }

        @keyframes flip-back {
          0% {
            transform: rotateY(180deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        @keyframes glow-pulse-contact {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.6);
          }
        }

        .flip-card {
          perspective: 1200px;
          height: 600px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .form-glow {
          animation: glow-pulse-contact 2.5s ease-in-out infinite;
        }

        /* Remove autofill background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
          box-shadow: 0 0 0 30px #1f2937 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
        }

        input:-webkit-autofill::first-line {
          font-size: 16px;
        }
      `}</style>

      <section id="contact" className="py-20 px-4 relative overflow-hidden">
        {/* Parallax background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Title with parallax */}
          <div ref={titleRef} style={{ transform: `translateY(${titleY * -0.3}px)` }}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Get In Touch
            </h2>
          </div>
          <p className="text-center text-gray-400 mb-16">Let's build something amazing together!</p>

          {/* Content grid with intro animation */}
          <div ref={introRef} className="grid md:grid-cols-2 gap-12">
            <div
              className={`transform transition-all duration-500 ${
                isIntroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">Connect With Me</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm always excited to collaborate on interesting projects or discuss new opportunities. Feel free to reach out!
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'shreyanshmpatel1408@gmail.com',
                    href: 'mailto:shreyanshmpatel1408@gmail.com'
                  },
                  {
                    icon: Github,
                    label: 'GitHub',
                    value: 'shreyansh-real',
                    href: 'https://github.com/shreyansh-real'
                  },
                  {
                    icon: Linkedin,
                    label: 'LinkedIn',
                    value: 'Shreyansh Patel',
                    href: 'https://www.linkedin.com/in/shreyansh-patel-581b41371/'
                  },
                  {
                    icon: Instagram,
                    label: 'Instagram',
                    value: 'not.real_shreyansh',
                    href: 'https://www.instagram.com/not.real_shreyansh/'
                  }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className={`flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 group transform ${
                      isIntroVisible
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-8'
                    }`}
                    style={{
                      transitionDelay: isIntroVisible ? `${(idx + 1) * 100}ms` : '0ms'
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                      <item.icon size={24} className="text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="text-cyan-400 font-semibold">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div
              className={`transform transition-all duration-500 ${
                isIntroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isIntroVisible ? '200ms' : '0ms'
              }}
            >
              {/* 3D Flip Card Container */}
              <div className="flip-card">
                <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                  {/* Front - Button Side */}
                  <div className="flip-card-front">
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="w-full px-8 py-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 group form-glow hover:scale-105 transform flex flex-col items-center justify-center gap-6"
                    >
                      <div className="text-5xl">✉️</div>
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">Fill The Form</h3>
                        <p className="text-gray-400">Click to open the contact form</p>
                      </div>
                      <div className="mt-4 text-cyan-300/60 text-sm font-semibold animate-pulse">
                        CLICK TO FLIP →
                      </div>
                    </button>
                  </div>

                  {/* Back - Form Side */}
                  <div className="flip-card-back">
                    <form onSubmit={handleSubmit} className="w-full h-full space-y-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-colors flex flex-col justify-between overflow-y-auto">
                      {status === 'success' && (
                        <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                          <CheckCircle size={20} className="text-green-400" />
                          <span className="text-green-300 text-sm">{statusMessage}</span>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                          <AlertCircle size={20} className="text-red-400" />
                          <span className="text-red-300 text-xs">{statusMessage}</span>
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className="block text-s font-semibold mb-4 text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder='Incognito'
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white text-sm"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-s font-semibold mb-4 text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder='incognito@example.com'
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white text-sm"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-s font-semibold mb-4 text-gray-300">
                          Message
                        </label>
                        <textarea
                          id="message"
                          placeholder='Your message here...'
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-white resize-none text-sm"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsFlipped(false)}
                          className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transform transition-all duration-300 text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin">⚙️</div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                              Send
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
