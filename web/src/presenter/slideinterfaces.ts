export interface BetterBullet {
  text: string;
  indent?: number;
}

export interface TitleContent {
  subtitle?: string;
}

export interface BulletContent {
  bullets: BetterBullet[];
}

export interface ImageContent {
  url: string;
  caption?: string;
}

export interface TextContent {
  text: string;
  imageUrl?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
  imageCaption?: string;
  sources?: string[];
}

export interface CodeContent {
  code: string;
  language?: string;
  filename?: string;
}

export interface QuoteContent {
  quote: string;
  author?: string;
  source?: string;
}

export interface SplitContent {
  leftContent: string;
  rightContent: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
}

export interface ComparisonContent {
  leftTitle: string;
  rightTitle: string;
  leftItems: string[];
  rightItems: string[];
}

export interface Slide {
  type: 'title' | 'bullet' | 'text' | 'image' | 'code' | 'quote' | 'split' | 'comparison';
  title: string;
  content?: TitleContent | BulletContent | TextContent | ImageContent | CodeContent | QuoteContent | SplitContent | ComparisonContent;
} 