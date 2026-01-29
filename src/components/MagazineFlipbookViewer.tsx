import React, { useState, useEffect, useRef } from 'react';
import { Element } from './ElementTypes';

interface MagazineFlipbookViewerProps {
  pages: Array<{ id: string; elements: Element[] }>;
  currentPage: number;
}

declare global {
  interface Window {
    St: any;
  }
}

export const MagazineFlipbookViewer: React.FC<MagazineFlipbookViewerProps> = ({ pages, currentPage }) => {
  const [pageFlip, setPageFlip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bookRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const renderElement = (element: Element) => {
    switch (element.type) {
      case 'text':
        const textEl = element as any;
        // Show empty text boxes with a subtle border instead of hiding them
        const isEmpty = !textEl.content || textEl.content.trim() === '';
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
              whiteSpace: 'pre-wrap',
              border: isEmpty ? '1px dashed #ccc' : 'none',
              backgroundColor: isEmpty ? '#f9f9f9' : 'transparent',
              minHeight: '20px'
            }}
          >
            {textEl.content || (isEmpty && <span style={{ color: '#999' }}>Empty text</span>)}
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

  const renderPage = (page: any, index: number) => {
    if (!page) return null;

    return (
      <div
        key={page.id}
        className="page"
        style={{
          background: 'white',
          color: '#000',
          position: 'relative',
          width: '400px',
          height: '566px',
          overflow: 'hidden'
        }}
      >
        <div className="page-content" style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: '20px',
          maxHeight: '526px',
          position: 'relative'
        }}>
          {page.elements.map((element: Element) => (
            <div key={element.id}>
              {renderElement(element)}
            </div>
          ))}
        </div>
        <div className="page-footer" style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          fontSize: '10px',
          color: '#666'
        }}>
          {index + 1}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Load page-flip library
    if (!scriptRef.current && !window.St) {
      scriptRef.current = document.createElement('script');
      scriptRef.current.src = 'https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.js';
      scriptRef.current.onload = () => {
        initializeFlipbook();
      };
      document.head.appendChild(scriptRef.current);
    } else if (window.St && bookRef.current) {
      initializeFlipbook();
    }

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [pages]);

  const initializeFlipbook = () => {
    if (!bookRef.current || !window.St) return;

    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - 50;
    
    let maxHeight = Math.min(availableHeight * 0.85, 800);
    const initialBookHeight = maxHeight;
    const initialBookWidth = initialBookHeight * 0.707;
    
    if ((initialBookWidth * 2) > (availableWidth * 0.9)) {
      // Adjust width if needed for smaller screens
    }

    const flipBook = new window.St.PageFlip(bookRef.current, {
      width: initialBookWidth, 
      height: initialBookHeight,
      size: "fixed",
      minWidth: 200,
      maxWidth: 1600,
      minHeight: 300,
      maxHeight: 2000,
      maxShadowOpacity: 0.5,
      showCover: true,
      usePortrait: false,
      startPage: 0,
      mobileScrollSupport: false
    });

    const pageElements = bookRef.current.querySelectorAll('.page');
    flipBook.loadFromHTML(pageElements);
    
    flipBook.on('flip', (e: any) => {
      updatePageDisplay(e.data);
    });
    
    setPageFlip(flipBook);
    setIsLoading(false);
    updatePageDisplay(0);
  };

  const updatePageDisplay = (index: number) => {
    const totalPagesCount = pages.length;
    
    let displayText;
    if (index === 0) {
      displayText = '1';
    } else if (index === totalPagesCount - 1) {
      displayText = totalPagesCount.toString();
    } else {
      const leftPage = index + 1;
      const rightPage = index + 2;
      if (rightPage <= totalPagesCount) {
        displayText = `${leftPage}-${rightPage}`;
      } else {
        displayText = leftPage.toString();
      }
    }
    
    const pageDisplay = document.getElementById('pageDisplay');
    if (pageDisplay) {
      pageDisplay.innerText = displayText;
    }
  };

  const handlePrev = () => {
    if (pageFlip) {
      pageFlip.prev();
    }
  };

  const handleNext = () => {
    if (pageFlip) {
      pageFlip.next();
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#525659',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Toolbar */}
      <div style={{
        height: '50px',
        background: 'rgba(82, 86, 89, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <button
          onClick={handlePrev}
          disabled={!pageFlip}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e8eaed',
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            cursor: pageFlip ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => {
            if (pageFlip) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ←
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#e8eaed',
          minWidth: '80px',
          justifyContent: 'center'
        }}>
          <span id="pageDisplay" style={{ fontWeight: '600' }}>1</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>/ {pages.length}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!pageFlip}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e8eaed',
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            cursor: pageFlip ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => {
            if (pageFlip) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          →
        </button>
      </div>

      {/* Stage */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {isLoading && (
          <div style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ animation: 'spin 1s linear infinite' }}>⟳</div>
            Loading flipbook...
          </div>
        )}

        <div ref={bookRef} style={{ display: 'none' }}>
          {pages.map((page, index) => renderPage(page, index))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
