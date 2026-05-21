import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Globe, Users, Calendar, Wrench } from 'lucide-react';
import { useParallax, useScrollIntro } from '../hooks/useParallax';

interface ProjectImage {
    src: string;
    alt: string;
}

interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    techStack: string[];
    images: ProjectImage[];
    links: {
        label: string;
        url?: string;
        icon: React.ReactNode;
        disabled: boolean;
    }[];
    meta: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }[];
}

const projects: Project[] = [
    {
        id: 'cerco',
        title: 'Cerco',
        subtitle: 'Local Service Provider Platform',
        description:
            'Cerco is a community-focused service provider website designed and developed by a collaborative team during a hackathon. The platform bridges the gap between local service providers and community members, offering an intuitive interface for discovering, connecting with, and hiring skilled professionals for everyday needs — from home repairs to tutoring and beyond. Built under tight hackathon constraints, Cerco demonstrates rapid prototyping, effective teamwork, and a user-first design philosophy aimed at solving real-world local challenges.',
        features: [
            'Intuitive service discovery and browsing by category',
            'Service provider profiles with detailed offerings',
            'Responsive design optimized for mobile and desktop',
            'Streamlined contact and inquiry workflow',
            'Clean, accessible UI built for non-technical users',
        ],
        techStack: ['React', 'JavaScript', 'CSS3', 'HTML5'],
        images: [
            { src: '/projects/cerco/01.png', alt: 'Cerco — Homepage hero section with service categories' },
            { src: '/projects/cerco/02.png', alt: 'Cerco — Service listings and provider cards' },
            { src: '/projects/cerco/03.png', alt: 'Cerco — Detailed service page and contact section' },
        ],
        links: [

        ],
        meta: [
            {
                icon: <Calendar size={16} />,
                label: 'Timeline',
                value: 'Hackathon Sprint',
            },
            {
                icon: <Users size={16} />,
                label: 'Team',
                value: 'Collaborative Team Project',
            },
            {
                icon: <Globe size={16} />,
                label: 'Status',
                value: 'Not Yet Deployed',
            },
        ],
    },
    {
        id: 'scn',
        title: 'SCN',
        subtitle: 'Strategic Creative Notes — Personal Notes Management',
        description:
            'SCN (Strategic Creative Notes) is a full-featured notes-storing web application that provides users with a clean, distraction-free environment to create, organize, and manage personal notes. Designed with simplicity and usability at its core, SCN offers a rich text editing experience, categorization tools, and an elegant dashboard for quick access to all saved content. The application prioritizes data privacy and a seamless user experience, making it an ideal digital companion for students, professionals, and anyone who values organized note-taking.',
        features: [
            'Rich-text note editor with formatting capabilities',
            'Dashboard with quick notes and quick search',
            'Folder and category-based note organization',
            'Responsive layout for on-the-go access across devices',
            'Clean, minimal interface designed for focused writing',
        ],
        techStack: ['React', 'JavaScript', 'CSS3', 'HTML5'],
        images: [
            { src: '/projects/scn/01.png', alt: 'SCN — Login / authentication screen' },
            { src: '/projects/scn/02.png', alt: 'SCN — Main dashboard with note cards' },
            { src: '/projects/scn/03.png', alt: 'SCN — Note creation and rich-text editor' },
            { src: '/projects/scn/04.png', alt: 'SCN — Note detail view with formatting' },
            { src: '/projects/scn/05.png', alt: 'SCN — Category and folder management' },
            { src: '/projects/scn/06.png', alt: 'SCN — Search and filter interface' },
            { src: '/projects/scn/07.png', alt: 'SCN — Settings and profile page' },
            { src: '/projects/scn/08.png', alt: 'SCN — Additional note management view' },
        ],
        links: [
            {
                label: 'Live Demo',
                icon: <ExternalLink size={18} />,
                disabled: true,
            },
            {
                label: 'Source Code',
                icon: <Github size={18} />,
                disabled: true,
            },
        ],
        meta: [
            {
                icon: <Calendar size={16} />,
                label: 'Timeline',
                value: 'Personal Project',
            },
            {
                icon: <Users size={16} />,
                label: 'Role',
                value: 'Team Project',
            },
            {
                icon: <Globe size={16} />,
                label: 'Status',
                value: 'Not Yet Deployed',
            },
        ],
    },
];

function Lightbox({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    onGoTo,
}: {
    images: ProjectImage[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    onGoTo: (index: number) => void;
}) {
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrev();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, onPrev, onNext]);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${currentIndex + 1} of ${images.length}: ${images[currentIndex].alt}`}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
                aria-label="Close lightbox"
            >
                <X size={22} className="md:size-24" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/80 text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full z-20">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-2 md:left-6 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={24} className="md:size-28" />
                </button>
            )}

            {/* Image container — full screen */}
            <div
                className="w-full h-full flex items-center justify-center p-4 md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className="w-full h-full object-contain animate-fadeIn"
                />
            </div>

            {/* Next button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-2 md:right-6 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
                    aria-label="Next image"
                >
                    <ChevronRight size={24} className="md:size-28" />
                </button>
            )}

            {/* Bottom thumbnail strip for quick navigation */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (i !== currentIndex) onGoTo(i);
                            }}
                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                                ? 'bg-white scale-125 shadow-lg shadow-white/30'
                                : 'bg-white/40 hover:bg-white/70'
                                }`}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Click-outside zone: clicking the dark background closes */}
            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
                aria-hidden="true"
            />
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
    }, []);

    const goToPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
    }, [project.images.length]);

    const goToNext = useCallback(() => {
        setLightboxIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
    }, [project.images.length]);

    const goToImage = useCallback((index: number) => {
        setLightboxIndex(index);
    }, []);

    return (
        <>
            <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10">
                {/* Image Gallery — Horizontal Scroll */}
                <div className="relative overflow-hidden">
                    <div className="flex gap-3 overflow-x-auto p-4 pb-2 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent snap-x snap-mandatory">
                        {project.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => openLightbox(i)}
                                className="flex-shrink-0 w-64 md:w-72 h-44 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 snap-start focus:outline-none focus:ring-2 focus:ring-cyan-400 group/image"
                                aria-label={`View ${img.alt}`}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Scroll hint */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white/60 text-xs px-2 py-1 rounded-full pointer-events-none">
                        ← scroll →
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Title & Subtitle */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-cyan-400/80 text-sm font-semibold uppercase tracking-wider mb-4">
                        {project.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
                        {project.description}
                    </p>

                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {project.meta.map((m, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300"
                            >
                                <span className="text-cyan-400">{m.icon}</span>
                                <span className="text-gray-400">{m.label}:</span>
                                <span className="font-medium">{m.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Wrench size={14} className="text-cyan-400" />
                        Key Features
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                        {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 rounded-md bg-gray-700/60 text-xs text-gray-300 border border-gray-600/40 hover:border-cyan-500/40 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700/50">
                        {project.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={link.disabled}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${link.disabled
                                    ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed border border-gray-600/30'
                                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50'
                                    }`}
                                title={link.disabled ? 'Not yet deployed — coming soon' : undefined}
                            >
                                {link.icon}
                                {link.label}
                                {link.disabled && (
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 ml-1">(Soon)</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && createPortal(
                <Lightbox
                    images={project.images}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={goToPrev}
                    onNext={goToNext}
                    onGoTo={goToImage}
                />,
                document.body
            )}
        </>
    );
}

function Experience() {
    const { ref: titleRef, translateY: titleY } = useParallax({ speed: 0.4, direction: 'up' });
    const { ref: sectionRef, isVisible } = useScrollIntro(0.1);

    return (
        <section id="experience" className="py-20 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800" />

            {/* Parallax ambient elements */}
            <div className="absolute top-32 right-10 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl opacity-40" />
            <div className="absolute bottom-32 left-10 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl opacity-40" />

            <div ref={sectionRef} className="max-w-6xl mx-auto relative z-10">
                {/* Title */}
                <div ref={titleRef} style={{ transform: `translateY(${titleY * -0.3}px)` }}>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                        Experience
                    </h2>
                </div>
                <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
                    A showcase of projects I've built — each one a step forward in my journey as a full-stack developer.
                </p>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: isVisible ? `${index * 200}ms` : '0ms' }}
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                {/* Note about deployment */}
                <div
                    className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}
                >

                </div>


            </div>

            {/* Custom scrollbar styles for the gallery */}
            <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
        </section>
    );
}

export default Experience;