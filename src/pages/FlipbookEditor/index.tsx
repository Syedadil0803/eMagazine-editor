import React, { useState, useCallback } from 'react';
import { Button, Input, Select, Card, Space, Modal, Slider, ColorPicker, Checkbox } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconImage, IconFile, IconMinus, IconPlayCircle, IconSound } from '@arco-design/web-react/icon';
import { Element, Page } from '../../components/ElementTypes';
import { ElementRenderer } from '../../components/ElementRenderer';
import { generateFlipBookHtml } from '../../components/FlipBookExport';

const PAGE_HEIGHT = 1000;
const PAGE_WIDTH = 800;

const FlipbookEditor: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', elements: [] }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementType, setElementType] = useState<string>('text');

  // Convert flipbook pages to magazine format for preview
  const convertToMagazinePages = () => {
    return pages.map((page, index) => ({
      id: page.id,
      name: `Page ${index + 1}`,
      content: {
        type: 'page',
        children: page.elements.map(element => ({
          type: element.type,
          attributes: {
            x: element.x,
            y: element.y,
            width: (element as any).width,
            height: (element as any).height,
            fontSize: (element as any).fontSize,
            color: (element as any).color,
            src: (element as any).src,
            alt: (element as any).alt,
            content: (element as any).content
          },
          children: [(element as any).content || '']
        }))
      },
      order: index,
      type: (index === 0 ? 'cover' : index === pages.length - 1 ? 'back_cover' : 'content') as 'cover' | 'content' | 'back_cover'
    }));
  };

  const onPreviewFlipbook = () => {
    const magazinePages = convertToMagazinePages();
    const html = generateFlipBookHtml({
      pages: magazinePages,
      currentPageIndex: currentPage,
      currentValues: {
        subject: 'Flipbook Preview',
        content: magazinePages[currentPage]?.content || { type: 'page', children: [] }
      },
      templateSubject: 'Flipbook Preview'
    });
    
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const addElement = useCallback((type: string) => {
    let newElement: Element;

    switch (type) {
      case 'text':
        newElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          content: 'New Text Element',
          x: 50,
          y: 50,
          width: 300,
          fontSize: 16,
          color: '#000000',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          textAlign: 'left',
          lineHeight: 1.4
        };
        break;
      case 'image':
        newElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: 'https://picsum.photos/seed/flipbook/400/300.jpg',
          alt: 'Sample Image',
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          borderRadius: 0,
          objectFit: 'cover'
        };
        break;
      case 'video':
        newElement = {
          id: `video-${Date.now()}`,
          type: 'video',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          x: 50,
          y: 50,
          width: 400,
          height: 300,
          autoplay: false,
          controls: true,
          muted: true
        };
        break;
      case 'audio':
        newElement = {
          id: `audio-${Date.now()}`,
          type: 'audio',
          src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          title: 'Audio Track',
          artist: 'Artist Name',
          x: 50,
          y: 50,
          width: 300,
          height: 100,
          controls: true,
          autoplay: false
        };
        break;
      case 'button':
        newElement = {
          id: `button-${Date.now()}`,
          type: 'button',
          text: 'Click Me',
          backgroundColor: '#1890ff',
          textColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'normal',
          borderRadius: 4,
          padding: 12,
          x: 50,
          y: 50,
          width: 150,
          height: 44
        };
        break;
      case 'divider':
        newElement = {
          id: `divider-${Date.now()}`,
          type: 'divider',
          x: 50,
          y: 50,
          width: 700,
          height: 1,
          color: '#cccccc',
          style: 'solid'
        };
        break;
      case 'shape':
        newElement = {
          id: `shape-${Date.now()}`,
          type: 'shape',
          shape: 'rectangle',
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          backgroundColor: '#1890ff',
          borderColor: '#0050b3',
          borderWidth: 2,
          borderRadius: 0
        };
        break;
      case 'spacer':
        newElement = {
          id: `spacer-${Date.now()}`,
          type: 'spacer',
          x: 50,
          y: 50,
          width: 100,
          height: 50
        };
        break;
      case 'product':
        newElement = {
          id: `product-${Date.now()}`,
          type: 'product',
          title: 'Product Title',
          description: 'Product description goes here',
          price: '$99.99',
          image: 'https://via.placeholder.com/200x150',
          x: 50,
          y: 50,
          width: 250,
          height: 300
        };
        break;
      default:
        return;
    }

    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage].elements.push(newElement);
      return newPages;
    });
    
    setShowAddModal(false);
  }, [currentPage]);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage].elements = newPages[currentPage].elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      );
      return newPages;
    });
  }, [currentPage]);

  const deleteElement = useCallback((elementId: string) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage].elements = newPages[currentPage].elements.filter(el => el.id !== elementId);
      return newPages;
    });
    setSelectedElement(null);
  }, [currentPage]);

  const handleMouseDown = useCallback((elementId: string) => {
    setDraggedElement(elementId);
    setSelectedElement(elementId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedElement) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, PAGE_WIDTH - 100));
    const y = Math.max(0, Math.min(e.clientY - rect.top, PAGE_HEIGHT - 50));

    updateElement(draggedElement, { x, y });
  }, [draggedElement, updateElement]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  const addNewPage = useCallback(() => {
    const newPage: Page = {
      id: `${pages.length + 1}`,
      elements: []
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPage(pages.length);
  }, [pages.length]);

  const selectedEl = pages[currentPage]?.elements.find(el => el.id === selectedElement);

  const renderPropertiesPanel = () => {
    if (!selectedEl) return null;

    return (
      <Card title={`${selectedEl.type.charAt(0).toUpperCase() + selectedEl.type.slice(1)} Properties`} style={{ width: '350px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Common properties */}
          <div>
            <label>X Position:</label>
            <Input
              value={selectedEl.x.toString()}
              onChange={(value) => updateElement(selectedEl.id, { x: parseInt(value) || 0 })}
              style={{ marginTop: '8px' }}
            />
          </div>
          
          <div>
            <label>Y Position:</label>
            <Input
              value={selectedEl.y.toString()}
              onChange={(value) => updateElement(selectedEl.id, { y: parseInt(value) || 0 })}
              style={{ marginTop: '8px' }}
            />
          </div>
          {(selectedEl as any).content && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Content</label>
              <Input
                value={(selectedEl as any).content || ''}
                onChange={(value) => updateElement(selectedEl.id, { content: value })}
              />
            </div>
          )}
          {(selectedEl as any).fontSize && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Font Size</label>
              <Slider
                value={(selectedEl as any).fontSize || 16}
                onChange={(value) => updateElement(selectedEl.id, { fontSize: value as number })}
                min={8}
                max={72}
              />
            </div>
          )}
          {(selectedEl as any).color && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Color</label>
              <ColorPicker
                value={(selectedEl as any).color || '#000000'}
                onChange={(value) => updateElement(selectedEl.id, { color: value })}
              />
            </div>
          )}
          
          {/* Video specific properties */}
          {selectedEl.type === 'video' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Video URL</label>
                <Input
                  value={(selectedEl as any).src || ''}
                  onChange={(value) => updateElement(selectedEl.id, { src: value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Poster Image URL (optional)</label>
                <Input
                  value={(selectedEl as any).poster || ''}
                  onChange={(value) => updateElement(selectedEl.id, { poster: value })}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
            </>
          )}
          
          {/* Audio specific properties */}
          {selectedEl.type === 'audio' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Audio URL</label>
                <Input
                  value={(selectedEl as any).src || ''}
                  onChange={(value) => updateElement(selectedEl.id, { src: value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            </>
          )}
          
          {/* Image specific properties */}
          {selectedEl.type === 'image' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Image URL</label>
                <Input
                  value={(selectedEl as any).src || ''}
                  onChange={(value) => updateElement(selectedEl.id, { src: value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Alt Text</label>
                <Input
                  value={(selectedEl as any).alt || ''}
                  onChange={(value) => updateElement(selectedEl.id, { alt: value })}
                  placeholder="Image description"
                />
              </div>
            </>
          )}
          
          <Button 
            type="primary" 
            status="danger" 
            onClick={() => deleteElement(selectedEl.id)}
            style={{ width: '100%' }}
          >
            <IconDelete /> Delete Element
          </Button>
        </Space>
      </Card>
    );
  };

  return (
    <div className="flipbook-editor-container">
      <div style={{ marginBottom: '20px' }}>
        <Space wrap>
          <Button type="primary" onClick={() => setShowAddModal(true)}>
            <IconPlus /> Add Element
          </Button>
          <Button onClick={addNewPage}>
            <IconPlus /> Add Page
          </Button>
          <Select
            value={currentPage.toString()}
            onChange={(value) => setCurrentPage(parseInt(value))}
            style={{ width: '120px' }}
          >
            {pages.map((page, index) => (
              <Select.Option key={page.id} value={index.toString()}>
                Page {index + 1}
              </Select.Option>
            ))}
          </Select>
          <Button 
            type="outline"
            onClick={onPreviewFlipbook}
            style={{ marginLeft: '20px' }}
          >
            📖 View Flipbook
          </Button>
        </Space>
      </div>

      {/* Editor Canvas */}
      <div style={{ display: 'flex', gap: '20px' }}>
          {/* Editor Canvas */}
          <div>
            <div
              className="flipbook-canvas"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pages[currentPage]?.elements.map((element) => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onSelect={setSelectedElement}
                  onUpdate={updateElement}
                  onMouseDown={handleMouseDown}
                />
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          {renderPropertiesPanel()}
        </div>

      {/* Add Element Modal */}
      <Modal
        title="Add Element"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <Button onClick={() => addElement('text')}>
            <IconPlus /> Text
          </Button>
          <Button onClick={() => addElement('image')}>
            <IconImage /> Image
          </Button>
          <Button onClick={() => addElement('video')}>
            <IconPlayCircle /> Video
          </Button>
          <Button onClick={() => addElement('audio')}>
            <IconSound /> Audio
          </Button>
          <Button onClick={() => addElement('button')}>
            <IconPlus /> Button
          </Button>
          <Button onClick={() => addElement('divider')}>
            <IconMinus /> Divider
          </Button>
          <Button onClick={() => addElement('spacer')}>
            <IconFile /> Spacer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FlipbookEditor;
