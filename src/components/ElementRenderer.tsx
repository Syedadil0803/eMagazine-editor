import React, { useState, useRef, useEffect } from 'react';
import { Element } from './ElementTypes';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Element>) => void;
  onMouseDown?: (id: string) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onMouseDown
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

  const isResizable = element.type === 'text' || element.type === 'image' || element.type === 'video' || element.type === 'audio' || element.type === 'spacer' || element.type === 'divider';
  const baseStyle = {
    position: 'absolute' as const,
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: (element as any).height ? `${(element as any).height}px` : 'auto',
    cursor: isResizing ? 'grabbing' : 'move',
    border: isSelected ? '2px solid #1890ff' : '1px dashed #ccc',
    padding: '4px',
    backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
    transition: isResizing ? 'none' : 'all 0.2s ease'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMouseDown) {
      onMouseDown(element.id);
    }
    onSelect(element.id);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (!onUpdate) return;

    setIsResizing(true);

    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: (element as any).height || 50,
      left: element.x,
      top: element.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;

      let newWidth = startPos.current.width;
      let newHeight = startPos.current.height;
      let newLeft = startPos.current.left;
      let newTop = startPos.current.top;

      // Handle different resize directions
      if (direction.includes('right')) {
        newWidth = Math.max(50, startPos.current.width + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(50, startPos.current.width - deltaX);
        newLeft = startPos.current.left + deltaX;
        if (newWidth === 50) {
          newLeft = startPos.current.left + startPos.current.width - 50;
        }
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(30, startPos.current.height + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(30, startPos.current.height - deltaY);
        newTop = startPos.current.top + deltaY;
        if (newHeight === 30) {
          newTop = startPos.current.top + startPos.current.height - 30;
        }
      }

      // Update both size and position for left/top resizing
      const updates: Partial<Element> = {
        width: newWidth,
        height: newHeight
      };

      if (direction.includes('left') || direction.includes('top')) {
        updates.x = newLeft;
        updates.y = newTop;
      }

      onUpdate(element.id, updates);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderResizeHandles = () => {
    if (!isSelected || !isResizable) return null;

    const handles = [
      { position: 'top', cursor: 'n-resize', style: { top: '-8px', left: '50%', transform: 'translateX(-50%)' } },
      { position: 'bottom', cursor: 's-resize', style: { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' } },
      { position: 'left', cursor: 'w-resize', style: { left: '-8px', top: '50%', transform: 'translateY(-50%)' } },
      { position: 'right', cursor: 'e-resize', style: { right: '-8px', top: '50%', transform: 'translateY(-50%)' } }
    ];

    return handles.map(handle => (
      <div
        key={handle.position}
        className="resize-handle"
        style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          backgroundColor: '#1890ff',
          border: '3px solid white',
          borderRadius: '50%',
          cursor: handle.cursor,
          zIndex: 1000,
          boxShadow: '0 3px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(24,144,255,0.3)',
          transition: 'all 0.15s ease',
          opacity: 0.9,
          ...handle.style
        }}
        onMouseDown={(e) => handleResizeStart(e, handle.position)}
        onMouseEnter={(e) => {
          const element = e.currentTarget;
          element.style.transform = handle.style.transform ?
            handle.style.transform.replace('scale(1)', '') + ' scale(1.3)' : 'scale(1.3)';
          element.style.backgroundColor = '#40a9ff';
          element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(24,144,255,0.5)';
          element.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const element = e.currentTarget;
          element.style.transform = handle.style.transform || 'scale(1)';
          element.style.backgroundColor = '#1890ff';
          element.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(24,144,255,0.3)';
          element.style.opacity = '0.9';
        }}
      />
    ));
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        const textEl = element as any;
        return (
          <div
            ref={elementRef}
            style={{
              ...baseStyle,
              fontSize: `${textEl.fontSize}px`,
              color: textEl.color,
              fontWeight: textEl.fontWeight,
              fontFamily: textEl.fontFamily,
              textAlign: textEl.textAlign,
              lineHeight: textEl.lineHeight,
              whiteSpace: 'pre-wrap',
              minHeight: '30px',
              overflow: 'hidden',
              wordWrap: 'break-word'
            }}
            onMouseDown={handleMouseDown}
          >
            {textEl.content}
            {renderResizeHandles()}
          </div>
        );

      case 'image':
        const imgEl = element as any;
        return (
          <div
            ref={elementRef}
            style={{
              ...baseStyle,
              padding: 0,
              overflow: 'hidden',
              borderRadius: `${imgEl.borderRadius}px`,
              cursor: isSelected ? 'move' : 'pointer'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            <img
              src={imgEl.src}
              alt={imgEl.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imgEl.objectFit || 'contain',
                display: 'block',
                pointerEvents: 'none'
              }}
            />
            {renderResizeHandles()}
          </div>
        );

      case 'video':
        const vidEl = element as any;
        return (
          <div
            ref={elementRef}
            style={{
              ...baseStyle,
              padding: 0,
              backgroundColor: '#000',
              cursor: isSelected ? 'move' : 'pointer'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
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
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
            {renderResizeHandles()}
          </div>
        );

      case 'audio':
        const audEl = element as any;
        return (
          <div
            ref={elementRef}
            style={{
              ...baseStyle,
              cursor: isSelected ? 'move' : 'pointer'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            <audio
              src={audEl.src}
              controls={audEl.controls}
              autoPlay={audEl.autoplay}
              style={{ width: '100%' }}
            />
            {renderResizeHandles()}
          </div>
        );

      case 'button':
        const btnEl = element as any;
        return (
          <button
            style={{
              ...baseStyle,
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
            onClick={(e) => {
              handleClick(e);
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
            ref={elementRef}
            style={{
              ...baseStyle,
              height: `${divEl.height}px`,
              backgroundColor: divEl.color,
              border: 'none',
              borderBottom: `1px ${divEl.style} ${divEl.color}`,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#999',
              cursor: 'move'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            <span style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px' }}>Divider</span>
            {renderResizeHandles()}
          </div>
        );

      case 'spacer':
        const spacerEl = element as any;
        return (
          <div
            ref={elementRef}
            style={{
              ...baseStyle,
              border: '1px dashed #ccc',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#999'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            Spacer {spacerEl.width}×{spacerEl.height}
            {renderResizeHandles()}
          </div>
        );

      default:
        return null;
    }
  };

  return renderElement();
};
