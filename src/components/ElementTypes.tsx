export interface TextElement {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  fontStyle: 'normal' | 'italic' | 'oblique';
  textDecoration: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing: number;
  wordSpacing: number;
  textIndent: number;
  opacity: number;
  textShadow: string;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  border: string;
  writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
  direction: 'ltr' | 'rtl';
  whiteSpace: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
  overflow: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
}

export interface VideoElement {
  id: string;
  type: 'video';
  src: string;
  poster?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  autoplay: boolean;
  controls: boolean;
  muted: boolean;
}

export interface AudioElement {
  id: string;
  type: 'audio';
  src: string;
  title: string;
  artist: string;
  x: number;
  y: number;
  width: number;
  height: number;
  controls: boolean;
  autoplay: boolean;
}

export interface ButtonElement {
  id: string;
  type: 'button';
  text: string;
  href?: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: string;
  borderRadius: number;
  padding: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DividerElement {
  id: string;
  type: 'divider';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface SpacerElement {
  id: string;
  type: 'spacer';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProductElement {
  id: string;
  type: 'product';
  title: string;
  description: string;
  price: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Element =
  | TextElement
  | ImageElement
  | VideoElement
  | AudioElement
  | ButtonElement
  | DividerElement
  | ShapeElement
  | SpacerElement
  | ProductElement;

export interface Page {
  id: string;
  elements: Element[];
  backgroundColor?: string;
}
