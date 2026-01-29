import React from 'react';
import { Button, Card } from '@arco-design/web-react';
import { 
  IconFile, 
  IconImage, 
  IconPlayCircle, 
  IconSound, 
  IconMinus, 
  IconPlus
} from '@arco-design/web-react/icon';

interface ElementPaletteProps {
  onAddElement: (type: string) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onAddElement }) => {
  const elements = [
    { type: 'text', icon: <IconFile />, label: 'Text', description: 'Add text content' },
    { type: 'image', icon: <IconImage />, label: 'Image', description: 'Add images' },
    { type: 'video', icon: <IconPlayCircle />, label: 'Video', description: 'Add videos' },
    { type: 'audio', icon: <IconSound />, label: 'Audio', description: 'Add audio' },
    { type: 'button', icon: <IconPlus />, label: 'Button', description: 'Add buttons' },
    { type: 'divider', icon: <IconMinus />, label: 'Divider', description: 'Add dividers' },
    { type: 'shape', icon: <IconPlus />, label: 'Shape', description: 'Add shapes' },
    { type: 'spacer', icon: <IconFile />, label: 'Spacer', description: 'Add spacing' },
    { type: 'product', icon: <IconPlus />, label: 'Product', description: 'Add products' }
  ];

  return (
    <Card 
      title="🎨 Content Elements" 
      style={{ 
        width: '280px', 
        height: 'fit-content',
        position: 'fixed',
        left: '20px',
        top: '100px',
        zIndex: 1000,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {elements.map((element) => (
          <Button
            key={element.type}
            onClick={() => onAddElement(element.type)}
            style={{
              height: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px',
              fontSize: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '20px', color: '#1890ff' }}>
              {element.icon}
            </div>
            <div style={{ fontWeight: '600', color: '#1f2937' }}>
              {element.label}
            </div>
          </Button>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '6px',
        fontSize: '11px',
        color: '#64748b',
        textAlign: 'center'
      }}>
        💡 Click any element to add it to your page
      </div>
    </Card>
  );
};
