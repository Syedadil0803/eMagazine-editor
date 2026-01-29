import React, { useState, useEffect } from 'react';
import { Element } from './ElementTypes';

interface FlipbookViewerProps {
  pages: Array<{ id: string; elements: Element[] }>;
  currentPage: number;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pages, currentPage }) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  // Calculate spreads (2 pages per spread)
  const spreads = [];
  for (let i = 0; i < pages.length; i += 2) {
    spreads.push({
      leftPage: pages[i],
      rightPage: pages[i + 1] || null
    });
  }

  // Sync with current page
  useEffect(() => {
    const targetSpread = Math.floor(currentPage / 2);
    if (targetSpread !== currentSpread && targetSpread >= 0 && targetSpread < spreads.length) {
      setCurrentSpread(targetSpread);
    }
  }, [currentPage, currentSpread, spreads.length]);

  const renderElement = (element: Element) => {
    switch (element.type) {
      case 'text':
        const textEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              fontSize: `${textEl.fontSize}px`,
              color: textEl.color,
              fontWeight: textEl.fontWeight,
              fontFamily: textEl.fontFamily,
              textAlign: textEl.textAlign,
              lineHeight: textEl.lineHeight,
              whiteSpace: 'pre-wrap'
            }}
          >
            {textEl.content}
          </div>
        );

      case 'image':
        const imgEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              overflow: 'hidden',
              borderRadius: `${imgEl.borderRadius}px`
            }}
          >
            <img
              src={imgEl.src}
              alt={imgEl.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imgEl.objectFit,
                display: 'block'
              }}
            />
          </div>
        );

      case 'video':
        const vidEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: '#000'
            }}
          >
            <video
              src={vidEl.src}
              poster={vidEl.poster}
              autoPlay={vidEl.autoplay}
              controls={vidEl.controls}
              muted={vidEl.muted}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        );

      case 'audio':
        const audEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{audEl.title}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{audEl.artist}</div>
            </div>
            <audio
              src={audEl.src}
              controls={audEl.controls}
              autoPlay={audEl.autoplay}
              style={{ width: '100%' }}
            />
          </div>
        );

      case 'button':
        const btnEl = element as any;
        return (
          <button
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: btnEl.backgroundColor,
              color: btnEl.textColor,
              fontSize: `${btnEl.fontSize}px`,
              fontWeight: btnEl.fontWeight,
              borderRadius: `${btnEl.borderRadius}px`,
              padding: `${btnEl.padding}px`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              if (btnEl.href) {
                window.open(btnEl.href, '_blank');
              }
            }}
          >
            {btnEl.text}
          </button>
        );

      case 'divider':
        const divEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: divEl.color,
              border: 'none',
              borderBottom: `1px ${divEl.style} ${divEl.color}`,
              padding: 0
            }}
          />
        );

      case 'shape':
        const shapeEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: shapeEl.backgroundColor,
              borderColor: shapeEl.borderColor,
              borderWidth: `${shapeEl.borderWidth}px`,
              borderStyle: 'solid',
              borderRadius: shapeEl.shape === 'circle' ? '50%' : `${shapeEl.borderRadius}px`,
              padding: 0
            }}
          />
        );

      case 'spacer':
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`
            }}
          />
        );

      case 'product':
        const prodEl = element as any;
        return (
          <div
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <img
              src={prodEl.image}
              alt={prodEl.title}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '12px'
              }}
            />
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              {prodEl.title}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', flex: 1 }}>
              {prodEl.description}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
              {prodEl.price}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPage = (page: any, isLeft: boolean) => {
    if (!page) return null;

    return (
      <div
        style={{
          width: '400px',
          height: '566px',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #ddd',
          borderRadius: '4px',
          transform: isLeft ? 'rotateY(0deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: isFlipping && ((isLeft && flipDirection === 'prev') || (!isLeft && flipDirection === 'next')) 
            ? 'transform 0.6s ease-in-out' 
            : 'none',
          transformOrigin: isLeft ? 'right center' : 'left center'
        }}
      >
        {page.elements.map((element: Element) => (
          <div key={element.id}>
            {renderElement(element)}
          </div>
        ))}
        
        {/* Page number */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          fontSize: '10px',
          color: '#666'
        }}>
          {pages.indexOf(page) + 1}
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (currentSpread < spreads.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentSpread(currentSpread + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  };

  const handlePrev = () => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentSpread(currentSpread - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  };

  const currentSpreadData = spreads[currentSpread];

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#2c3e50',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '20px', 
        backgroundColor: '#34495e', 
        padding: '15px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'white' }}>📖 Flipbook Viewer</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={handlePrev}
              disabled={currentSpread === 0 || isFlipping}
              style={{
                padding: '10px 20px',
                backgroundColor: currentSpread === 0 || isFlipping ? '#7f8c8d' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentSpread === 0 || isFlipping ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              ← Previous
            </button>
            <span style={{ 
              padding: '10px 20px', 
              backgroundColor: '#2c3e50', 
              borderRadius: '5px',
              color: 'white',
              fontWeight: 'bold',
              minWidth: '150px',
              textAlign: 'center'
            }}>
              Spread {currentSpread + 1} of {spreads.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSpread === spreads.length - 1 || isFlipping}
              style={{
                padding: '10px 20px',
                backgroundColor: currentSpread === spreads.length - 1 || isFlipping ? '#7f8c8d' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentSpread === spreads.length - 1 || isFlipping ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Flipbook Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        perspective: '2000px'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '40px',
          transformStyle: 'preserve-3d'
        }}>
          {/* Left Page */}
          {renderPage(currentSpreadData?.leftPage, true)}
          
          {/* Right Page */}
          {renderPage(currentSpreadData?.rightPage, false)}
        </div>
      </div>

      {/* Page Navigation Dots */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px',
        marginTop: '20px'
      }}>
        {spreads.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: index === currentSpread ? '#3498db' : '#7f8c8d',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={() => {
              if (!isFlipping) {
                setCurrentSpread(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
