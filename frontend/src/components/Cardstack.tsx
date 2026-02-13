import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Target, Heart } from 'lucide-react';

// Card content interface
interface CardContent {
  id: number;
  gradient: string;
  front: {
    badge: string;
    badgeStyle: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    nextBtnText?: string;
    nextBtnStyle?: string;
  };
  back: {
    badge: string;
    title: string;
    features: string[];
  };
}

// Define card data
// Use the same three cards as `About.tsx` so the CardStack content matches
const CARDS: CardContent[] = [
  {
    id: 1,
    gradient: 'bg-gradient-to-br from-gray-900 to-gray-950',
    front: {
      badge: 'Who I Am',
      badgeStyle: 'bg-white/10 text-cyan-300',
      icon: <User size={48} className="text-cyan-300" />,
      title: 'Who I Am',
      description: 'A passionate BSc Computer Science First Year student with a keen interest in Full Stack Development.',
    },
    back: {
      badge: 'Details',
      title: 'Curious & Driven',
      features: ['Eager to learn', 'Builds full-stack projects', 'Focus on clean, accessible UI']
    }
  },
  {
    id: 2,
    gradient: 'bg-gradient-to-br from-cyan-700 to-teal-600',
    front: {
      badge: 'My Goal',
      badgeStyle: 'bg-white/10 text-cyan-300',
      icon: <Target size={48} className="text-cyan-300" />,
      title: 'My Goal',
      description: 'To become a proficient Full Stack Developer and create impactful web applications.',
    },
    back: {
      badge: 'Vision',
      title: 'Build Impactful Products',
      features: ['User-centered design', 'Maintainable code', 'Meaningful features']
    }
  },
  {
    id: 3,
    gradient: 'bg-gradient-to-br from-slate-800 to-cyan-700',
    front: {
      badge: 'What I Love',
      badgeStyle: 'bg-white/10 text-cyan-300',
      icon: <Heart size={48} className="text-cyan-300" />,
      title: 'What I Love',
      description: 'Building responsive UIs, exploring new technologies, and solving complex problems.',
    },
    back: {
      badge: 'Passion',
      title: 'Design & Code',
      features: ['Responsive UIs', 'Continuous learning', 'Collaboration']
    }
  }
];

// Animation constants
const SWIPE_THRESHOLD = 50;
const SWIPE_DURATION = 400;
const CARD_POSITIONS = {
  ACTIVE: 'active',
  NEXT: 'next',
  NEXT_2: 'next-2',
  NEXT_3: 'next-3',
  PREV: 'previous',
  PREV_2: 'previous-2',
  PREV_3: 'previous-3',
  HIDDEN: 'hidden'
} as const;

type CardPosition = typeof CARD_POSITIONS[keyof typeof CARD_POSITIONS];

const CardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedStates, setFlippedStates] = useState<boolean[]>(CARDS.map(() => false));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const cardStackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const swipeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  
  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (swipeTimeoutRef.current) {
        clearTimeout(swipeTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => {
          if (prev <= 0) return prev;
          
          // Add swipe animation to current card
          if (cardStackRef.current) {
            const currentCard = cardStackRef.current.children[prev] as HTMLElement;
            currentCard.classList.add('swipe-right');
          }
          
          swipeTimeoutRef.current = setTimeout(() => {
            setFlippedStates(prevStates => {
              const newState = [...prevStates];
              newState[prev - 1] = false;
              return newState;
            });
          }, SWIPE_DURATION);
          
          return prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => {
          if (prev >= CARDS.length - 1) return prev;
          
          // Add swipe animation to current card
          if (cardStackRef.current) {
            const currentCard = cardStackRef.current.children[prev] as HTMLElement;
            currentCard.classList.add('swipe-left');
          }
          
          swipeTimeoutRef.current = setTimeout(() => {
            setFlippedStates(prevStates => {
              const newState = [...prevStates];
              newState[prev + 1] = false;
              return newState;
            });
          }, SWIPE_DURATION);
          
          return prev + 1;
        });
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        // Don't intercept space when focus is inside a form control (e.g., textarea)
        const active = document.activeElement;
        if (active instanceof HTMLElement) {
          const tag = active.tagName.toUpperCase();
          const isFormControl = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || active.isContentEditable;
          if (isFormControl) return;
        }
        e.preventDefault();
        setFlippedStates(prev => {
          const newState = [...prev];
          newState[currentIndex] = !newState[currentIndex];
          return newState;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Get card position class based on index relationship to current index
  const getCardPosition = useCallback((cardIndex: number): CardPosition => {
    const diff = cardIndex - currentIndex;
    
    if (cardIndex === currentIndex) return CARD_POSITIONS.ACTIVE;
    if (diff === 1) return CARD_POSITIONS.NEXT;
    if (diff === 2) return CARD_POSITIONS.NEXT_2;
    if (diff === 3) return CARD_POSITIONS.NEXT_3;
    if (diff === -1) return CARD_POSITIONS.PREV;
    if (diff === -2) return CARD_POSITIONS.PREV_2;
    if (diff === -3) return CARD_POSITIONS.PREV_3;
    return CARD_POSITIONS.HIDDEN;
  }, [currentIndex]);

  // Handle card flip
  const handleFlipCard = (index: number) => {
    setFlippedStates(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Handle next card with swipe animation
  const handleNextCard = useCallback(() => {
    if (currentIndex >= CARDS.length - 1) return;
    
    // Add swipe animation to current card
    if (cardStackRef.current) {
      const currentCard = cardStackRef.current.children[currentIndex] as HTMLElement;
      currentCard.classList.add('swipe-left');
    }
    
    const cardEl = cardStackRef.current?.children[currentIndex] as HTMLElement | undefined;
    swipeTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      // Reset flip state for new card
      setFlippedStates(prev => {
        const newState = [...prev];
        newState[currentIndex + 1] = false;
        return newState;
      });
      // cleanup swipe class after animation
      if (cardEl) {
        setTimeout(() => {
          cardEl.classList.remove('swipe-left');
        }, 80);
      }
    }, SWIPE_DURATION);
  }, [currentIndex]);

  // Handle previous card with swipe animation
  const handlePrevCard = useCallback(() => {
    if (currentIndex <= 0) return;
    
    // Add swipe animation to current card
    if (cardStackRef.current) {
      const currentCard = cardStackRef.current.children[currentIndex] as HTMLElement;
      currentCard.classList.add('swipe-right');
    }
    const cardEl = cardStackRef.current?.children[currentIndex] as HTMLElement | undefined;
    swipeTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      // Reset flip state for new card
      setFlippedStates(prev => {
        const newState = [...prev];
        newState[currentIndex - 1] = false;
        return newState;
      });
      if (cardEl) {
        setTimeout(() => {
          cardEl.classList.remove('swipe-right');
        }, 80);
      }
    }, SWIPE_DURATION);
  }, [currentIndex]);

  // Handle mouse/touch start
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
    
    if (cardStackRef.current) {
      cardStackRef.current.style.cursor = 'grabbing';
      const activeCard = cardStackRef.current.children[currentIndex] as HTMLElement | undefined;
      if (activeCard) {
        // Disable transition while dragging for smooth follow
        activeCard.style.transition = 'none';
        activeCard.style.willChange = 'transform';
      }
    }
  };

  // Handle mouse/touch move
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !cardStackRef.current) return;
    
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
    
    // Smooth update via RAF
    animationFrameRef.current = requestAnimationFrame(() => {
      const activeCard = cardStackRef.current?.children[currentIndex] as HTMLElement | undefined;
      if (activeCard) {
        const rotate = Math.max(Math.min(diff * 0.08, 20), -20);
        activeCard.style.transform = `translateX(${diff}px) rotateZ(${rotate}deg)`;
      }
    });
  }, [isDragging, currentIndex]);

  // Handle mouse/touch end
  const handleDragEnd = useCallback(() => {
    if (!isDragging || !cardStackRef.current) return;

    setIsDragging(false);
    cardStackRef.current.style.cursor = '';

    // Reset transform and re-enable transition
    const activeCard = cardStackRef.current.children[currentIndex] as HTMLElement | undefined;
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.transition = '';
      activeCard.style.willChange = '';
    }

    // Handle swipe based on drag distance
    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        // swipe right -> previous
        handlePrevCard();
      } else {
        // swipe left -> next, but prevent swiping past the last card
        if (currentIndex >= CARDS.length - 1) {
          // small bounce feedback to indicate end of stack
          if (activeCard) {
            activeCard.style.transition = 'transform 200ms ease-out';
            activeCard.style.transform = 'translateX(-24px) rotateZ(-4deg)';
            setTimeout(() => {
              if (activeCard) activeCard.style.transform = '';
            }, 180);
          }
        } else {
          handleNextCard();
        }
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, currentIndex, handlePrevCard, handleNextCard]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleDragMove(e.clientX);
    }
  }, [isDragging, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length) {
      // prevent page scroll while dragging
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  }, [isDragging, handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  // Add mouse/touch event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Handle card click (non-active cards)
  const handleCardClick = (index: number) => {
    if (index !== currentIndex && !flippedStates[index]) {
      setCurrentIndex(index);
      // Reset flip state when selecting new card
      setFlippedStates(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  // Progress dot click handler
  const handleProgressClick = (index: number) => {
    if (index !== currentIndex) {
      // Add swipe animation in the appropriate direction
      if (cardStackRef.current) {
        const currentCard = cardStackRef.current.children[currentIndex] as HTMLElement;
        const directionClass = index > currentIndex ? 'swipe-left' : 'swipe-right';
        currentCard.classList.add(directionClass);
      }
      
      swipeTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(index);
        setFlippedStates(prev => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }, SWIPE_DURATION);
    }
  };

  return (
    <section id="cardstack" className="py-20 px-4 relative overflow-hidden">
      {/* Parallax background elements (match Skills background) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-30"></div>

      {/* Content */}
      <div className="max-w-lg w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">About</h1>
          <p className="text-white/80">Swipe each card to reveal my story</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 space-x-3">
            {CARDS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => handleProgressClick(index)}
                aria-label={`Navigate to card ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProgressClick(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Card Stack Container */}
        <div 
          ref={cardStackRef}
          className="card-stack mb-8"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="region"
          aria-live="polite"
          aria-label="Card stack navigation"
        >
          {CARDS.map((card, index) => {
            const position = getCardPosition(index);
            const isFlipped = flippedStates[index];
            const isActive = position === CARD_POSITIONS.ACTIVE;
            
            return (
              <div
                key={card.id}
                className={`card ${card.gradient} ${position} ${
                  isFlipped ? 'flipped' : ''
                } ${
                  isActive && !isFlipped ? 'bounce-in' : ''
                }`}
                data-index={index}
                onClick={() => handleCardClick(index)}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                aria-label={`Card ${index + 1}: ${card.front.title}`}
                onKeyDown={(e) => {
                  if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                    handleFlipCard(index);
                  }
                }}
              >
                {/* Front of card */}
                <div className={`card-front flex flex-col ${
                  card.id >= 4 ? 'text-gray-800' : 'text-white'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`${card.front.badgeStyle} px-3 py-1 rounded-full text-sm`}>
                      {card.front.badge}
                    </span>
                    <button
                      className={`${card.front.badgeStyle} w-10 h-10 rounded-full flex items-center justify-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipCard(index);
                      }}
                      aria-label="Flip card"
                    >
                      <i className="fas fa-sync-alt" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="floating mb-6 flex items-center justify-center">
                      {/* render Lucide icon element passed in the card data */}
                      <div className="text-6xl">{card.front.icon}</div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-center text-white">{card.front.title}</h2>
                    <p className={`text-center ${
                      card.id >= 4 ? 'text-gray-600' : 'text-white'
                    }`}>
                      {card.front.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      className={`${
                        card.id >= 4 ? 'bg-black/10' : 'bg-white/20'
                      } px-4 py-2 rounded-full flex items-center ${
                        !isActive && 'invisible'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevCard();
                      }}
                      disabled={currentIndex === 0 || !isActive}
                      aria-label="Previous card"
                    >
                      <i className="fas fa-arrow-left mr-2" /> Previous
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full flex items-center ${
                        card.front.nextBtnStyle || (card.id >= 4 ? 'bg-black/10' : 'bg-white/20')
                      } ${
                        !isActive && 'invisible'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index === CARDS.length - 1) {
                          // Handle final card action
                          console.log('Upgrade action triggered');
                        } else {
                          handleNextCard();
                        }
                      }}
                      disabled={currentIndex === CARDS.length - 1 || !isActive}
                      aria-label={index === CARDS.length - 1 ? "Upgrade now" : "Next card"}
                    >
                      {card.front.nextBtnText || 'Next'}{' '}
                      <i className={`fas ${
                        index === CARDS.length - 1 ? 'fa-crown' : 'fa-arrow-right'
                      } ml-2`} />
                    </button>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="card-back text-white bg-blue-800/90 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {card.back.badge}
                    </span>
                    <button
                      className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipCard(index);
                      }}
                      aria-label="Flip back to front"
                    >
                      <i className="fas fa-undo" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">{card.back.title}</h2>
                    <ul className="space-y-3">
                      {card.back.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <i className="fas fa-check-circle mr-3 text-green-300" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Custom CSS injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        .card-stack {
          perspective: 1500px;
          height: 500px;
          position: relative;
          width: 100%;
          margin: 0 auto;
        }
        
        .card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }
        
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          padding: 30px;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        
        .card.flipped {
          transform: rotateY(180deg);
        }
        
        /* Card positioning in stack */
        .card.active {
          z-index: 10;
          transform: translateX(0) scale(1) rotateY(0deg);
        }
        
        .card.next {
          z-index: 9;
          transform: translateX(30px) scale(0.95) rotateY(-5deg);
          opacity: 0.9;
          filter: brightness(0.9);
        }
        
        .card.next-2 {
          z-index: 8;
          transform: translateX(60px) scale(0.9) rotateY(-10deg);
          opacity: 0.7;
          filter: brightness(0.8);
        }
        
        .card.next-3 {
          z-index: 7;
          transform: translateX(90px) scale(0.85) rotateY(-15deg);
          opacity: 0.5;
          filter: brightness(0.7);
        }
        
        .card.previous {
          z-index: 9;
          transform: translateX(-30px) scale(0.95) rotateY(5deg);
          opacity: 0.9;
          filter: brightness(0.9);
        }
        
        .card.previous-2 {
          z-index: 8;
          transform: translateX(-60px) scale(0.9) rotateY(10deg);
          opacity: 0.7;
          filter: brightness(0.8);
        }
        
        .card.previous-3 {
          z-index: 7;
          transform: translateX(-90px) scale(0.85) rotateY(15deg);
          opacity: 0.5;
          filter: brightness(0.7);
        }
        
        .card.hidden {
          opacity: 0;
          transform: scale(0.8);
          z-index: 1;
        }
        
        .card.swipe-left {
          transform: translateX(-150%) rotateZ(-30deg) scale(0.8);
          opacity: 0;
        }
        
        .card.swipe-right {
          transform: translateX(150%) rotateZ(30deg) scale(0.8);
          opacity: 0;
        }
        
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .bounce-in {
          animation: bounceIn 0.8s ease-out;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .card-gradient-1 {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .card-gradient-2 {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .card-gradient-3 {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        
        .card-gradient-4 {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .card-gradient-5 {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
        
        .card-gradient-6 {
          background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
        }
        
        .swipe-hint {
          animation: swipeHint 2s ease-in-out infinite;
        }
        
        @keyframes swipeHint {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          50% { transform: translateX(20px); opacity: 1; }
        }


      `}</style>
    </section>
  );
};

export default CardStack;