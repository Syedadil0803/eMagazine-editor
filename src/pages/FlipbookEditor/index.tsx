import React, { useState, useCallback } from 'react';
import { Button, Input, Card, Space, Slider, ColorPicker, Select, Collapse, Radio } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconImage, IconMinus, IconPlayCircle, IconSound, IconFile, IconExpand } from '@arco-design/web-react/icon';
import { Element, Page } from '../../components/ElementTypes';
import { ElementRenderer } from '../../components/ElementRenderer';
import { generateFlipBookHtml } from '../../components/FlipBookExport';

const PAGE_HEIGHT = 1000;
const PAGE_WIDTH = 800;

const FlipbookEditor: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', elements: [], backgroundColor: '#ffffff' }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [activePropertyTab, setActivePropertyTab] = useState<'element' | 'page'>('page');

  const generateId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

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
            content: (element as any).content,
            // Add new properties
            fontFamily: (element as any).fontFamily,
            fontWeight: (element as any).fontWeight,
            fontStyle: (element as any).fontStyle,
            textDecoration: (element as any).textDecoration,
            textTransform: (element as any).textTransform,
            textAlign: (element as any).textAlign,
            lineHeight: (element as any).lineHeight,
            letterSpacing: (element as any).letterSpacing,
            wordSpacing: (element as any).wordSpacing,
            textIndent: (element as any).textIndent,
            whiteSpace: (element as any).whiteSpace,
            writingMode: (element as any).writingMode,
            direction: (element as any).direction,
            opacity: (element as any).opacity,
            textShadow: (element as any).textShadow,
            backgroundColor: (element as any).backgroundColor,
            padding: (element as any).padding,
            border: (element as any).border,
            borderRadius: (element as any).borderRadius,
            overflow: (element as any).overflow,
            objectFit: (element as any).objectFit, // For images/videos
            poster: (element as any).poster, // For videos
            textColor: (element as any).textColor // For buttons
          },
          children: [(element as any).content || '']
        }))
      },
      backgroundColor: page.backgroundColor || '#ffffff',
      order: index,
      type: (index === 0 ? 'cover' : index === pages.length - 1 ? 'back_cover' : 'content') as 'cover' | 'content' | 'back_cover'
    }));
  };

  const onPreviewFlipbook = () => {
    const magazinePages = convertToMagazinePages();
    const html = generateFlipBookHtml({
      pages: magazinePages,
      currentPageIndex: currentPage,
      templateSubject: 'eMagazine Preview'
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
          id: generateId('text'),
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
          lineHeight: 1.4,
          fontStyle: 'normal',
          textDecoration: 'none',
          textTransform: 'none',
          letterSpacing: 0,
          wordSpacing: 0,
          textIndent: 0,
          opacity: 1,
          textShadow: 'none',
          backgroundColor: 'transparent',
          padding: 4,
          borderRadius: 0,
          border: 'none',
          writingMode: 'horizontal-tb',
          direction: 'ltr',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden'
        };
        break;
      case 'image':
        newElement = {
          id: generateId('image'),
          type: 'image',
          src: 'https://picsum.photos/seed/flipbook/400/300.jpg',
          alt: 'Sample Image',
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          borderRadius: 0,
          objectFit: 'contain'
        };
        break;
      case 'video':
        newElement = {
          id: generateId('video'),
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
          id: generateId('audio'),
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
          id: generateId('button'),
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
          id: generateId('divider'),
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
          id: generateId('shape'),
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
          id: generateId('spacer'),
          type: 'spacer',
          x: 50,
          y: 50,
          width: 100,
          height: 50
        };
        break;
      case 'product':
        newElement = {
          id: generateId('product'),
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

      // Check for duplicate IDs in current page and remove the old one if found
      const existingIds = newPages[currentPage].elements.map(el => el.id);
      if (existingIds.includes(newElement.id)) {
        // Remove the old element with the same ID
        newPages[currentPage].elements = newPages[currentPage].elements.filter(el => el.id !== newElement.id);
      }

      newPages[currentPage].elements.push(newElement);
      return newPages;
    });
  }, [currentPage]);

  const updateElement = useCallback(<T extends Element>(elementId: string, updates: Partial<T>) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage].elements = newPages[currentPage].elements.map(el =>
        el.id === elementId ? { ...el, ...updates } as T : el
      );
      return newPages;
    });
  }, [currentPage]);

  const updatePage = useCallback((updates: Partial<Page>) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage] = { ...newPages[currentPage], ...updates };
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
      id: generateId('page'),
      elements: [],
      backgroundColor: '#ffffff'
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPage(pages.length);
  }, [pages.length]);

  const getPageDisplayName = (index: number) => {
    if (index === 0) return 'Cover';
    if (index === pages.length - 1 && pages.length > 1) return 'Closing';
    return `${index + 1}`;
  };

  const selectedEl = pages[currentPage]?.elements.find(el => el.id === selectedElement);
  const currentPageObj = pages[currentPage];

  const renderPropertiesPanel = () => {
    const showElementProps = activePropertyTab === 'element' && selectedEl;
    const showPageProps = activePropertyTab === 'page' || !selectedEl;

    // Auto-switch to element tab if element is selected, but respect user choice if they switch back to page
    React.useEffect(() => {
      if (selectedEl) {
        setActivePropertyTab('element');
      } else {
        setActivePropertyTab('page');
      }
    }, [selectedEl?.id]);

    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Properties</span>
            {selectedEl && (
              <Radio.Group
                type="button"
                value={activePropertyTab}
                onChange={setActivePropertyTab}
                size="small"
                options={[
                  { label: 'Element', value: 'element' },
                  { label: 'Page', value: 'page' },
                ]}
              />
            )}
          </div>
        }
        style={{
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0'
        }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px' }}
      >
        {showPageProps && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 600 }}>Page Background</label>
              <ColorPicker
                value={currentPageObj?.backgroundColor || '#ffffff'}
                onChange={(value) => {
                  const colorValue = typeof value === 'string' ? value :
                    (value && typeof value === 'object' && 'color' in value) ? (value as any).color :
                      '#ffffff';
                  updatePage({ backgroundColor: colorValue });
                }}
              />
            </div>
          </Space>
        )}

        {showElementProps && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Common properties */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>X Position</label>
                <Input
                  value={selectedEl.x.toString()}
                  onChange={(value) => updateElement(selectedEl.id, { x: parseInt(value) || 0 })}
                  suffix="px"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Y Position</label>
                <Input
                  value={selectedEl.y.toString()}
                  onChange={(value) => updateElement(selectedEl.id, { y: parseInt(value) || 0 })}
                  suffix="px"
                />
              </div>
            </div>

            {selectedEl.type === 'text' && (
              <>
                {/* Content Section - Always Visible */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 600 }}>Content</label>
                  <Input.TextArea
                    value={(selectedEl as any).content || ''}
                    onChange={(value) => updateElement(selectedEl.id, { content: value })}
                    placeholder="Enter text content..."
                    rows={3}
                  />
                </div>

                <Collapse defaultActiveKey={['1']} style={{ border: 'none', background: 'transparent' }}>
                  <Collapse.Item header="Typography" name="1" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Font Family</label>
                        <Select
                          value={(selectedEl as any).fontFamily || 'Arial'}
                          onChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="Arial">Arial</Select.Option>
                          <Select.Option value="Helvetica">Helvetica</Select.Option>
                          <Select.Option value="Times New Roman">Times New Roman</Select.Option>
                          <Select.Option value="Georgia">Georgia</Select.Option>
                          <Select.Option value="Courier New">Courier New</Select.Option>
                          <Select.Option value="Verdana">Verdana</Select.Option>
                          <Select.Option value="Impact">Impact</Select.Option>
                          <Select.Option value="Comic Sans MS">Comic Sans MS</Select.Option>
                          <Select.Option value="Trebuchet MS">Trebuchet MS</Select.Option>
                          <Select.Option value="Palatino">Palatino</Select.Option>
                          <Select.Option value="Garamond">Garamond</Select.Option>
                          <Select.Option value="Bookman">Bookman</Select.Option>
                          <Select.Option value="Tahoma">Tahoma</Select.Option>
                        </Select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Font Size</label>
                          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                            <Slider
                              value={(selectedEl as any).fontSize || 16}
                              onChange={(value) => updateElement(selectedEl.id, { fontSize: value as number })}
                              min={8}
                              max={72}
                              style={{ flex: 1, marginRight: '8px' }}
                            />
                            <span style={{ fontSize: '12px', width: '24px' }}>{(selectedEl as any).fontSize}</span>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Weight</label>
                          <Select
                            value={(selectedEl as any).fontWeight || 'normal'}
                            onChange={(value) => updateElement(selectedEl.id, { fontWeight: value })}
                          >
                            <Select.Option value="100">Thin</Select.Option>
                            <Select.Option value="300">Light</Select.Option>
                            <Select.Option value="normal">Normal</Select.Option>
                            <Select.Option value="500">Medium</Select.Option>
                            <Select.Option value="600">SemiBold</Select.Option>
                            <Select.Option value="bold">Bold</Select.Option>
                            <Select.Option value="800">ExtraBold</Select.Option>
                          </Select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Style</label>
                          <Select
                            value={(selectedEl as any).fontStyle || 'normal'}
                            onChange={(value) => updateElement(selectedEl.id, { fontStyle: value })}
                          >
                            <Select.Option value="normal">Normal</Select.Option>
                            <Select.Option value="italic">Italic</Select.Option>
                            <Select.Option value="oblique">Oblique</Select.Option>
                          </Select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Decoration</label>
                          <Select
                            value={(selectedEl as any).textDecoration || 'none'}
                            onChange={(value) => updateElement(selectedEl.id, { textDecoration: value })}
                          >
                            <Select.Option value="none">None</Select.Option>
                            <Select.Option value="underline">Underline</Select.Option>
                            <Select.Option value="overline">Overline</Select.Option>
                            <Select.Option value="line-through">Strike</Select.Option>
                          </Select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Transform</label>
                          <Select
                            value={(selectedEl as any).textTransform || 'none'}
                            onChange={(value) => updateElement(selectedEl.id, { textTransform: value })}
                          >
                            <Select.Option value="none">None</Select.Option>
                            <Select.Option value="uppercase">UPPER</Select.Option>
                            <Select.Option value="lowercase">lower</Select.Option>
                            <Select.Option value="capitalize">Capital</Select.Option>
                          </Select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Color</label>
                          <ColorPicker
                            value={(selectedEl as any).color || '#000000'}
                            onChange={(value) => {
                              const colorValue = typeof value === 'string' ? value :
                                (value && typeof value === 'object' && 'color' in value) ? (value as any).color :
                                  '#000000';
                              updateElement(selectedEl.id, { color: colorValue });
                            }}
                          />
                        </div>
                      </div>
                    </Space>
                  </Collapse.Item>

                  <Collapse.Item header="Paragraph & Formatting" name="2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Text Align</label>
                        <Select
                          value={(selectedEl as any).textAlign || 'left'}
                          onChange={(value) => updateElement(selectedEl.id, { textAlign: value })}
                        >
                          <Select.Option value="left">Left</Select.Option>
                          <Select.Option value="center">Center</Select.Option>
                          <Select.Option value="right">Right</Select.Option>
                          <Select.Option value="justify">Justify</Select.Option>
                        </Select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Line Height: {(selectedEl as any).lineHeight || 1.4}</label>
                          <Slider
                            value={(selectedEl as any).lineHeight || 1.4}
                            onChange={(value) => updateElement(selectedEl.id, { lineHeight: value as number })}
                            min={0.8}
                            max={3}
                            step={0.1}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Indent: {(selectedEl as any).textIndent || 0}px</label>
                          <Slider
                            value={(selectedEl as any).textIndent || 0}
                            onChange={(value) => updateElement(selectedEl.id, { textIndent: value as number })}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Char Space: {(selectedEl as any).letterSpacing || 0}px</label>
                          <Slider
                            value={(selectedEl as any).letterSpacing || 0}
                            onChange={(value) => updateElement(selectedEl.id, { letterSpacing: value as number })}
                            min={-5}
                            max={20}
                            step={0.5}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Word Space: {(selectedEl as any).wordSpacing || 0}px</label>
                          <Slider
                            value={(selectedEl as any).wordSpacing || 0}
                            onChange={(value) => updateElement(selectedEl.id, { wordSpacing: value as number })}
                            min={-10}
                            max={50}
                            step={1}
                          />
                        </div>
                      </div>
                    </Space>
                  </Collapse.Item>

                  <Collapse.Item header="Appearance & Box Model" name="3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Background</label>
                          <ColorPicker
                            value={(selectedEl as any).backgroundColor || 'transparent'}
                            onChange={(value) => {
                              const colorValue = typeof value === 'string' ? value :
                                (value && typeof value === 'object' && 'color' in value) ? (value as any).color :
                                  'transparent';
                              updateElement(selectedEl.id, { backgroundColor: colorValue });
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Opacity: {(selectedEl as any).opacity || 1}</label>
                          <Slider
                            value={(selectedEl as any).opacity || 1}
                            onChange={(value) => updateElement(selectedEl.id, { opacity: value as number })}
                            min={0}
                            max={1}
                            step={0.1}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Padding: {(selectedEl as any).padding || 4}px</label>
                          <Slider
                            value={(selectedEl as any).padding || 4}
                            onChange={(value) => updateElement(selectedEl.id, { padding: value as number })}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Radius: {(selectedEl as any).borderRadius || 0}px</label>
                          <Slider
                            value={(selectedEl as any).borderRadius || 0}
                            onChange={(value) => updateElement(selectedEl.id, { borderRadius: value as number })}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Border</label>
                          <Input
                            value={(selectedEl as any).border || ''}
                            onChange={(value) => updateElement(selectedEl.id, { border: value })}
                            placeholder="e.g. 1px solid #ccc"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Shadow</label>
                          <Input
                            value={(selectedEl as any).textShadow || ''}
                            onChange={(value) => updateElement(selectedEl.id, { textShadow: value })}
                            placeholder="2px 2px 4px #ccc"
                          />
                        </div>
                      </div>
                    </Space>
                  </Collapse.Item>

                  <Collapse.Item header="Advanced Layout" name="4" style={{ borderBottom: 'none' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Writing Mode</label>
                          <Select
                            value={(selectedEl as any).writingMode || 'horizontal-tb'}
                            onChange={(value) => updateElement(selectedEl.id, { writingMode: value })}
                          >
                            <Select.Option value="horizontal-tb">Horizontal</Select.Option>
                            <Select.Option value="vertical-rl">Vertical (R-L)</Select.Option>
                            <Select.Option value="vertical-lr">Vertical (L-R)</Select.Option>
                          </Select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Direction</label>
                          <Select
                            value={(selectedEl as any).direction || 'ltr'}
                            onChange={(value) => updateElement(selectedEl.id, { direction: value })}
                          >
                            <Select.Option value="ltr">LTR</Select.Option>
                            <Select.Option value="rtl">RTL</Select.Option>
                          </Select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>White Space</label>
                          <Select
                            value={(selectedEl as any).whiteSpace || 'pre-wrap'}
                            onChange={(value) => updateElement(selectedEl.id, { whiteSpace: value })}
                          >
                            <Select.Option value="normal">Normal</Select.Option>
                            <Select.Option value="nowrap">No Wrap</Select.Option>
                            <Select.Option value="pre">Pre</Select.Option>
                            <Select.Option value="pre-wrap">Pre Wrap</Select.Option>
                          </Select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Overflow</label>
                          <Select
                            value={(selectedEl as any).overflow || 'hidden'}
                            onChange={(value) => updateElement(selectedEl.id, { overflow: value })}
                          >
                            <Select.Option value="visible">Visible</Select.Option>
                            <Select.Option value="hidden">Hidden</Select.Option>
                            <Select.Option value="scroll">Scroll</Select.Option>
                            <Select.Option value="auto">Auto</Select.Option>
                          </Select>
                        </div>
                      </div>
                    </Space>
                  </Collapse.Item>
                </Collapse>
              </>
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
        )}
      </Card>
    );
  };

  return (
    <div className="flipbook-editor-container">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <Button onClick={addNewPage}>
            <IconPlus /> Add Page
          </Button>

          {/* Horizontal Page Navigation */}
          <div className="page-nav-scroll" style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: '#f8f9fa',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            overflowX: 'auto',
            maxWidth: '700px'
          }}>
            {pages.map((page, index) => (
              <Button
                key={page.id}
                type={currentPage === index ? 'primary' : 'outline'}
                size="small"
                onClick={() => setCurrentPage(index)}
                style={{
                  minWidth: '60px',
                  height: '32px',
                  fontSize: '12px',
                  fontWeight: currentPage === index ? '600' : '400',
                  flexShrink: 0
                }}
              >
                {getPageDisplayName(index)}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="outline"
          onClick={onPreviewFlipbook}
          style={{ flexShrink: 0 }}
        >
          View
        </Button>
      </div>

      {/* Main Editor Layout */}
      <div style={{ display: 'flex', gap: '20px', minHeight: 'calc(100vh - 120px)', paddingBottom: '10px' }}>
        {/* Left Sidebar - Element Selection */}
        {/* Left Sidebar - Element Selection */}
        <div style={{
          width: '280px',
          background: '#ffffff',
          padding: '24px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Elements</h4>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#9ca3af' }}>Click to add to page</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { type: 'text', label: 'Text', icon: <IconFile />, color: '#4f46e5', bg: '#eef2ff' },
              { type: 'image', label: 'Image', icon: <IconImage />, color: '#db2777', bg: '#fce7f3' },
              { type: 'video', label: 'Video', icon: <IconPlayCircle />, color: '#dc2626', bg: '#fef2f2' },
              { type: 'audio', label: 'Audio', icon: <IconSound />, color: '#d97706', bg: '#fffbeb' },
              { type: 'divider', label: 'Divider', icon: <IconMinus />, color: '#4b5563', bg: '#f3f4f6' },
              { type: 'spacer', label: 'Spacer', icon: <IconExpand />, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((item) => (
              <div
                key={item.type}
                onClick={() => addElement(item.type)}
                style={{
                  height: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '16px',
                  background: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 20px -5px ${item.bg.replace('rgb', 'rgba').replace(')', ', 0.5)')}`;
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.background = '#fafafa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#f3f4f6';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: item.bg,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: item.color,
                  fontSize: '22px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Editor Canvas */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <div
            className="flipbook-canvas"
            style={{
              backgroundColor: pages[currentPage]?.backgroundColor || '#ffffff',
              transition: 'background-color 0.3s ease'
            }}
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

        {/* Right Sidebar - Properties Panel */}
        <div style={{
          width: '320px',
          background: '#ffffff',
          borderRadius: '20px',
          height: 'fit-content'
        }}>
          {renderPropertiesPanel()}
        </div>
      </div>
    </div>
  );
};

export default FlipbookEditor;
