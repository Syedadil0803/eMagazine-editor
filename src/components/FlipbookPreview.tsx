import React, { useState } from 'react';
import { Element } from './ElementTypes';

interface FlipbookPreviewProps {
  pages: Array<{ id: string; elements: Element[] }>;
  currentPage: number;
}

export const FlipbookPreview: React.FC<FlipbookPreviewProps> = ({ pages, currentPage }) => {
  const [previewPage, setPreviewPage] = useState(currentPage);

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
              justifyContent: 'center',
              textDecoration: btnEl.href ? 'underline' : 'none'
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
        const shapeStyle = {
          position: 'absolute' as const,
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
        };

        if (shapeEl.shape === 'triangle') {
          return (
            <div
              style={{
                ...shapeStyle,
                width: 0,
                height: 0,
                borderLeft: `${shapeEl.width/2}px solid transparent`,
                borderRight: `${shapeEl.width/2}px solid transparent`,
                borderBottom: `${shapeEl.height}px solid ${shapeEl.backgroundColor}`,
                backgroundColor: 'transparent'
              }}
            />
          );
        }

        return <div style={shapeStyle} />;

      case 'spacer':
        const spacerEl = element as any;
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

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      {/* Preview Header */}
      <div style={{ 
        marginBottom: '20px', 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Flipbook Preview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
              disabled={previewPage === 0}
              style={{
                padding: '8px 16px',
                backgroundColor: previewPage === 0 ? '#ccc' : '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: previewPage === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous
            </button>
            <span style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              Page {previewPage + 1} of {pages.length}
            </span>
            <button
              onClick={() => setPreviewPage(Math.min(pages.length - 1, previewPage + 1))}
              disabled={previewPage === pages.length - 1}
              style={{
                padding: '8px 16px',
                backgroundColor: previewPage === pages.length - 1 ? '#ccc' : '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: previewPage === pages.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        overflow: 'auto'
      }}>
        <div
          style={{
            width: '800px',
            height: '1123px',
            backgroundColor: 'white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px'
          }}
        >
          {pages[previewPage]?.elements.map((element) => (
            <div key={element.id}>
              {renderElement(element)}
            </div>
          ))}
          
          {/* Page number */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            right: '20px',
            fontSize: '12px',
            color: '#666'
          }}>
            {previewPage + 1}
          </div>
        </div>
      </div>
    </div>
  );
};
