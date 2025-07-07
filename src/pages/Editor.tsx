import React, { useState, useEffect, useRef, DragEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Code, 
  Smartphone, 
  Tablet, 
  Monitor,
  Undo,
  Redo,
  Copy,
  Download,
  Upload,
  MoreHorizontal,
  Grid3X3,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Type,
  Image as ImageIcon,
  Link,
  Square,
  List,
  Table,
  Star,
  ShoppingCart,
  CreditCard,
  Truck,
  Award,
  User,
  Tag,
  Package,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Settings,
  Move,
  RotateCw,
  Minus,
  Plus,
  Info,
  DollarSign,
  Factory,
  Layers,
  Weight,
  Hash,
  Zap
} from 'lucide-react';
import { useTemplateStore } from '../store/templateStore';

interface ElementProperties {
  tagName: string;
  innerHTML: string;
  className: string;
  id: string;
  style: Record<string, string>;
  textContent: string;
  src?: string;
  alt?: string;
  href?: string;
}

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, activeTemplate, setActiveTemplate, updateTemplate, addTemplate, duplicateTemplate } = useTemplateStore();
  
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [activePanel, setActivePanel] = useState<'blocks' | 'order' | 'code' | null>('blocks');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementProperties | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [templateBlocks, setTemplateBlocks] = useState<Array<{id: string, type: string, content: string, position: number}>>([]);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedOverBlockId, setDraggedOverBlockId] = useState<string | null>(null);

  // Element properties state
  const [elementText, setElementText] = useState('');
  const [elementClasses, setElementClasses] = useState('');
  const [elementId, setElementId] = useState('');
  const [elementSrc, setElementSrc] = useState('');
  const [elementAlt, setElementAlt] = useState('');
  const [elementHref, setElementHref] = useState('');
  const [elementWidth, setElementWidth] = useState('');
  const [elementHeight, setElementHeight] = useState('');
  const [elementPadding, setElementPadding] = useState('');
  const [elementMargin, setElementMargin] = useState('');
  const [elementBackgroundColor, setElementBackgroundColor] = useState('');
  const [elementTextColor, setElementTextColor] = useState('');
  const [elementFontSize, setElementFontSize] = useState('');
  const [elementFontWeight, setElementFontWeight] = useState('');
  const [elementTextAlign, setElementTextAlign] = useState('');
  const [elementBorderRadius, setElementBorderRadius] = useState('');
  const [elementBorder, setElementBorder] = useState('');
  
  // Image specific properties
  const [elementObjectFit, setElementObjectFit] = useState('');
  const [elementObjectPosition, setElementObjectPosition] = useState('');
  const [elementFloat, setElementFloat] = useState('');
  const [elementDisplay, setElementDisplay] = useState('');
  const [elementPosition, setElementPosition] = useState('');
  const [elementTop, setElementTop] = useState('');
  const [elementLeft, setElementLeft] = useState('');
  const [elementRight, setElementRight] = useState('');
  const [elementBottom, setElementBottom] = useState('');
  const [elementZIndex, setElementZIndex] = useState('');
  const [elementTransform, setElementTransform] = useState('');

  const previewRef = useRef<HTMLIFrameElement>(null);

  // POPRAWIONA FUNKCJA PARSOWANIA HTML DO BLOKÓW - ROZSZERZONA O AUTOMATYCZNE DODAWANIE data-editable
  const parseHtmlIntoBlocks = (html: string): Array<{id: string, type: string, content: string, position: number}> => {
    if (!html || html.trim() === '') return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const container = doc.querySelector('div');
    
    if (!container) return [];
    
    const blocks: Array<{id: string, type: string, content: string, position: number}> = [];
    let position = 0;
    
    // Funkcja do automatycznego dodawania data-editable do elementów
    const addEditableAttributes = (element: Element) => {
      const tagName = element.tagName.toLowerCase();
      const className = element.className || '';
      
      // Dodaj data-editable do głównych elementów
      if (!element.hasAttribute('data-editable')) {
        // Sprawdź czy element powinien być edytowalny
        const shouldBeEditable = 
          tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6' ||
          tagName === 'p' || tagName === 'span' || tagName === 'div' || tagName === 'section' ||
          tagName === 'img' || tagName === 'a' || tagName === 'button' ||
          className.includes('title') || className.includes('price') || className.includes('description') ||
          className.includes('gallery') || className.includes('image') || className.includes('content') ||
          className.includes('header') || className.includes('footer') || className.includes('section') ||
          className.includes('brand') || className.includes('product') || className.includes('feature') ||
          className.includes('spec') || className.includes('highlight') || className.includes('benefit') ||
          className.includes('delivery') || className.includes('shipping') || className.includes('care') ||
          className.includes('option') || className.includes('badge') || className.includes('label') ||
          className.includes('value') || className.includes('info') || className.includes('details');
        
        if (shouldBeEditable) {
          element.setAttribute('data-editable', 'true');
        }
      }
      
      // Rekurencyjnie przetwórz dzieci
      Array.from(element.children).forEach(child => {
        addEditableAttributes(child);
      });
    };
    
    // Funkcja rekurencyjna do parsowania elementów
    const parseElement = (element: Element, depth: number = 0) => {
      // Najpierw dodaj atrybuty edytowalne
      addEditableAttributes(element);
      
      // Sprawdź czy element ma atrybut data-editable lub jest głównym kontenerem
      if (element.hasAttribute('data-editable') || depth === 0) {
        const className = element.className || '';
        const tagName = element.tagName.toLowerCase();
        
        // Określ typ bloku na podstawie klasy CSS lub tagu
        let blockType = 'container';
        
        // Mapowanie klas CSS na typy bloków - ROZSZERZONE
        if (className.includes('ebay-title') || className.includes('pro-title') || className.includes('luxury-title') || className.includes('premium-title') || className.includes('clean-title') || className.includes('modern-title')) {
          blockType = 'ebay-title';
        } else if (className.includes('ebay-price') || className.includes('pro-price') || className.includes('luxury-price') || className.includes('premium-price') || className.includes('price-badge') || className.includes('price-container') || className.includes('price-section')) {
          blockType = 'ebay-price';
        } else if (className.includes('ebay-gallery') || className.includes('pro-gallery') || className.includes('luxury-gallery') || className.includes('premium-gallery') || className.includes('image-section') || className.includes('main-image') || className.includes('gallery')) {
          blockType = 'ebay-gallery';
        } else if (className.includes('ebay-description') || className.includes('pro-description') || className.includes('luxury-description') || className.includes('premium-description') || className.includes('description')) {
          blockType = 'ebay-description';
        } else if (className.includes('bl-product-name') || className.includes('bl-auction-title')) {
          blockType = 'bl-product-name';
        } else if (className.includes('bl-price')) {
          blockType = 'bl-price';
        } else if (className.includes('bl-images') || className.includes('bl-main-image') || className.includes('bl-additional-images')) {
          blockType = 'bl-images';
        } else if (className.includes('separator')) {
          if (className.includes('2col')) blockType = 'separator-2col';
          else if (className.includes('3col')) blockType = 'separator-3col';
          else if (className.includes('4col')) blockType = 'separator-4col';
          else blockType = 'separator-line';
        } else if (className.includes('brand') || className.includes('producer') || className.includes('logo')) {
          blockType = 'brand-section';
        } else if (className.includes('features') || className.includes('benefits') || className.includes('highlights')) {
          blockType = 'product-features';
        } else if (className.includes('specs') || className.includes('specifications') || className.includes('spec-table')) {
          blockType = 'spec-table';
        } else if (className.includes('shipping') || className.includes('delivery')) {
          blockType = 'shipping-info';
        } else if (className.includes('care') || className.includes('instructions')) {
          blockType = 'care-instructions';
        } else if (tagName === 'img') {
          blockType = 'image';
        } else if (tagName === 'table') {
          blockType = 'spec-table';
        } else if (tagName === 'ul' || tagName === 'ol') {
          blockType = 'list';
        } else if (className.includes('header') || tagName === 'header') {
          blockType = 'header-section';
        } else if (className.includes('footer') || tagName === 'footer') {
          blockType = 'footer-section';
        } else if (className.includes('showcase') || className.includes('section') || tagName === 'section') {
          blockType = 'section';
        }
        
        // Dodaj blok tylko jeśli ma data-editable lub jest głównym elementem
        if (element.hasAttribute('data-editable') || depth === 0) {
          blocks.push({
            id: `${blockType}-${Date.now()}-${position}`,
            type: blockType,
            content: element.outerHTML,
            position: position++
          });
        }
      } else {
        // Jeśli element nie ma data-editable, sprawdź jego dzieci
        Array.from(element.children).forEach(child => {
          parseElement(child, depth + 1);
        });
      }
    };
    
    // Parsuj wszystkie dzieci kontenera
    Array.from(container.children).forEach(child => {
      parseElement(child, 0);
    });
    
    // Jeśli nie znaleziono żadnych bloków, spróbuj parsować główne sekcje jako bloki
    if (blocks.length === 0) {
      Array.from(container.children).forEach(child => {
        const className = child.className || '';
        const tagName = child.tagName.toLowerCase();
        
        // Automatycznie dodaj data-editable
        addEditableAttributes(child);
        
        let blockType = 'container';
        if (className.includes('header')) blockType = 'header-section';
        else if (className.includes('gallery') || className.includes('image')) blockType = 'ebay-gallery';
        else if (className.includes('price')) blockType = 'ebay-price';
        else if (className.includes('description')) blockType = 'ebay-description';
        else if (className.includes('showcase') || className.includes('content')) blockType = 'section';
        else if (tagName === 'div' && child.children.length > 0) blockType = 'section';
        
        blocks.push({
          id: `${blockType}-${Date.now()}-${position}`,
          type: blockType,
          content: child.outerHTML,
          position: position++
        });
      });
    }
    
    return blocks;
  };

  // Template blocks definitions - ROZSZERZONE O NOWE BLOKI BASELINKER
  const blockCategories = {
    'Baselinker - Podstawowe': [
      { id: 'bl-nazwa', name: 'Nazwa produktu', icon: Type, content: '<h1 class="bl-product-name" data-editable="true">[nazwa]</h1>' },
      { id: 'bl-nazwa-aukcji', name: 'Tytuł aukcji', icon: Type, content: '<h1 class="bl-auction-title" data-editable="true">[nazwa_aukcji]</h1>' },
      { id: 'bl-cena', name: 'Cena produktu', icon: DollarSign, content: '<div class="bl-price-section" data-editable="true"><span class="bl-price">[cena] zł</span></div>' },
      { id: 'bl-obrazek', name: 'Zdjęcie główne', icon: ImageIcon, content: '<div class="bl-images" data-editable="true"><img src="[obrazek]" alt="[nazwa]" class="bl-main-image" data-editable="true" /></div>' },
      { id: 'bl-opis', name: 'Opis produktu', icon: Type, content: '<div class="bl-description" data-editable="true"><h3>Opis produktu</h3><div class="bl-desc-content">[opis]</div></div>' },
      { id: 'bl-producent', name: 'Producent', icon: Factory, content: '<div class="bl-producer" data-editable="true"><span class="bl-producer-label">Producent:</span> <span class="bl-producer-name">[producent]</span></div>' },
      { id: 'bl-kategoria', name: 'Kategoria', icon: Layers, content: '<div class="bl-category" data-editable="true"><span class="bl-category-label">Kategoria:</span> <span class="bl-category-name">[kategoria]</span></div>' }
    ],
    'Baselinker - Szczegóły': [
      { id: 'bl-opis-dodatkowy1', name: 'Opis dodatkowy 1', icon: Info, content: '<div class="bl-additional-desc1" data-editable="true"><h4>Dodatkowe informacje</h4><div class="bl-desc-content">[opis_dodatkowy1]</div></div>' },
      { id: 'bl-opis-dodatkowy2', name: 'Opis dodatkowy 2', icon: Info, content: '<div class="bl-additional-desc2" data-editable="true"><h4>Specyfikacja</h4><div class="bl-desc-content">[opis_dodatkowy2]</div></div>' },
      { id: 'bl-cechy-lista', name: 'Lista cech', icon: List, content: '<div class="bl-features-list" data-editable="true"><h4>Cechy produktu</h4><div class="bl-features-content">[cechy_lista]</div></div>' },
      { id: 'bl-waga', name: 'Waga produktu', icon: Weight, content: '<div class="bl-weight" data-editable="true"><span class="bl-weight-label">Waga:</span> <span class="bl-weight-value">[waga]</span></div>' },
      { id: 'bl-id-produktu', name: 'ID produktu', icon: Hash, content: '<div class="bl-product-id" data-editable="true"><span class="bl-id-label">ID produktu:</span> <span class="bl-id-value">[id_produktu]</span></div>' },
      { id: 'bl-producent-logo', name: 'Logo producenta', icon: ImageIcon, content: '<div class="bl-producer-logo" data-editable="true"><img src="[producent_logo]" alt="Logo [producent]" class="bl-logo-image" data-editable="true" /></div>' },
      { id: 'bl-dodatkowe-obrazki', name: 'Dodatkowe zdjęcia', icon: ImageIcon, content: '<div class="bl-additional-images" data-editable="true"><h4>Dodatkowe zdjęcia</h4><div class="bl-images-gallery">[dodatkowe_obrazki]</div></div>' }
    ],
    'Baselinker - Cechy produktu': [
      { id: 'bl-cecha-kolor', name: 'Cecha: Kolor', icon: Palette, content: '<div class="bl-feature-color" data-editable="true"><span class="bl-feature-label">Kolor:</span> <span class="bl-feature-value">[cecha|kolor]</span></div>' },
      { id: 'bl-cecha-rozmiar', name: 'Cecha: Rozmiar', icon: Zap, content: '<div class="bl-feature-size" data-editable="true"><span class="bl-feature-label">Rozmiar:</span> <span class="bl-feature-value">[cecha|rozmiar]</span></div>' },
      { id: 'bl-cecha-material', name: 'Cecha: Materiał', icon: Package, content: '<div class="bl-feature-material" data-editable="true"><span class="bl-feature-label">Materiał:</span> <span class="bl-feature-value">[cecha|materiał]</span></div>' },
      { id: 'bl-cecha-i-nazwa-kolor', name: 'Cecha z nazwą: Kolor', icon: Palette, content: '<div class="bl-feature-with-name-color" data-editable="true">[cecha_i_nazwa|kolor]</div>' },
      { id: 'bl-cecha-i-nazwa-rozmiar', name: 'Cecha z nazwą: Rozmiar', icon: Zap, content: '<div class="bl-feature-with-name-size" data-editable="true">[cecha_i_nazwa|rozmiar]</div>' },
      { id: 'bl-przesylka', name: 'Koszt przesyłki', icon: Truck, content: '<div class="bl-shipping-cost" data-editable="true"><h4>Koszt dostawy</h4><div class="bl-shipping-price">[przesylka1] zł</div></div>' }
    ],
    'eBay - Podstawowe': [
      { id: 'ebay-title', name: 'Tytuł aukcji', icon: Type, content: '<h1 class="ebay-title" data-editable="true">{{PRODUCT_TITLE}}</h1>' },
      { id: 'ebay-price', name: 'Cena eBay', icon: Tag, content: '<div class="ebay-price-container" data-editable="true"><span class="ebay-price">{{CURRENT_PRICE}}</span><span class="ebay-currency">{{CURRENCY}}</span></div>' },
      { id: 'ebay-gallery', name: 'Galeria eBay', icon: ImageIcon, content: '<div class="ebay-gallery" data-editable="true"><img src="{{MAIN_IMAGE}}" alt="{{PRODUCT_TITLE}}" class="ebay-main-image" data-editable="true" /></div>' },
      { id: 'ebay-description', name: 'Opis eBay', icon: Type, content: '<div class="ebay-description" data-editable="true"><h3>Opis przedmiotu</h3><div class="description-content">{{ITEM_DESCRIPTION}}</div></div>' }
    ],
    'eBay - Sprzedaż': [
      { id: 'ebay-buy-button', name: 'Przycisk Kup Teraz', icon: ShoppingCart, content: '<div class="ebay-buy-section" data-editable="true"><button class="ebay-buy-button">Kup teraz za {{CURRENT_PRICE}} {{CURRENCY}}</button></div>' },
      { id: 'ebay-seller-rating', name: 'Oceny sprzedawcy', icon: Star, content: '<div class="ebay-seller-rating" data-editable="true"><h4>Ocena sprzedawcy</h4><div class="rating-stars">{{SELLER_RATING}}</div></div>' },
      { id: 'ebay-shipping', name: 'Dostawa', icon: Truck, content: '<div class="ebay-shipping" data-editable="true"><h4>Dostawa</h4><p>{{SHIPPING_INFO}}</p></div>' },
      { id: 'ebay-payment', name: 'Płatności', icon: CreditCard, content: '<div class="ebay-payment" data-editable="true"><h4>Płatności</h4><p>{{PAYMENT_METHODS}}</p></div>' }
    ],
    'Układ - Podstawowe': [
      { id: 'container', name: 'Kontener', icon: Square, content: '<div class="container" data-editable="true">Treść kontenera</div>' },
      { id: 'section', name: 'Sekcja', icon: Square, content: '<section class="section" data-editable="true"><h2>Tytuł sekcji</h2><p>Treść sekcji</p></section>' },
      { id: 'grid', name: 'Siatka', icon: Grid3X3, content: '<div class="grid" data-editable="true"><div class="grid-item">Element 1</div><div class="grid-item">Element 2</div></div>' },
      { id: 'list', name: 'Lista', icon: List, content: '<ul class="list" data-editable="true"><li>Element 1</li><li>Element 2</li><li>Element 3</li></ul>' },
      { id: 'image', name: 'Obrazek', icon: ImageIcon, content: '<img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Obrazek" class="image" data-editable="true" />' }
    ],
    'Układ - Zaawansowane': [
      { id: 'spec-table', name: 'Tabela specyfikacji', icon: Table, content: '<table class="spec-table" data-editable="true"><tr><th>Właściwość</th><th>Wartość</th></tr><tr><td>Rozmiar</td><td>{{SIZE}}</td></tr></table>' },
      { id: 'product-features', name: 'Zalety produktu', icon: Star, content: '<div class="product-features" data-editable="true"><h3>Zalety</h3><ul><li>Wysoka jakość</li><li>Szybka dostawa</li></ul></div>' }
    ],
    'Separatory z obrazkami': [
      { 
        id: 'separator-line', 
        name: 'Linia pozioma', 
        icon: Minus, 
        content: '<hr class="separator-line" data-editable="true" style="border: 1px solid #ddd; margin: 20px 0;" />' 
      },
      { 
        id: 'separator-space', 
        name: 'Odstęp', 
        icon: Square, 
        content: '<div class="separator-space" data-editable="true" style="height: 40px; background: transparent;"></div>' 
      },
      { 
        id: 'separator-image-text', 
        name: 'Obrazek z tekstem', 
        icon: ImageIcon, 
        content: `<div class="separator-image-text" data-editable="true" style="display: flex; align-items: center; gap: 20px; margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Obrazek" data-editable="true" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;" />
          <div class="text-content" data-editable="true" style="flex: 1;">
            <h3 data-editable="true" style="margin-bottom: 10px; color: #333;">Tytuł sekcji</h3>
            <p data-editable="true" style="color: #666; line-height: 1.6;">Opis lub dodatkowe informacje o produkcie. Możesz tutaj umieścić dowolny tekst opisujący cechy, zalety lub specyfikację.</p>
          </div>
        </div>` 
      },
      { 
        id: 'separator-2col', 
        name: 'Separator 2 kolumny', 
        icon: Grid3X3, 
        content: `<div class="separator-2col" data-editable="true" style="display: flex; gap: 20px; margin: 20px 0;">
          <div class="col" data-editable="true" style="flex: 1; padding: 20px; border: 1px solid #ddd;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Kolumna 1" data-editable="true" style="width: 100%; height: auto; margin-bottom: 10px;" />
            <h3 data-editable="true">Kolumna 1</h3>
            <p data-editable="true">Treść pierwszej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 20px; border: 1px solid #ddd;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Kolumna 2" data-editable="true" style="width: 100%; height: auto; margin-bottom: 10px;" />
            <h3 data-editable="true">Kolumna 2</h3>
            <p data-editable="true">Treść drugiej kolumny</p>
          </div>
        </div>` 
      },
      { 
        id: 'separator-3col', 
        name: 'Separator 3 kolumny', 
        icon: Grid3X3, 
        content: `<div class="separator-3col" data-editable="true" style="display: flex; gap: 15px; margin: 20px 0;">
          <div class="col" data-editable="true" style="flex: 1; padding: 15px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Kolumna 1" data-editable="true" style="width: 100%; height: auto; margin-bottom: 10px;" />
            <h4 data-editable="true">Kolumna 1</h4>
            <p data-editable="true">Treść pierwszej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 15px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Kolumna 2" data-editable="true" style="width: 100%; height: auto; margin-bottom: 10px;" />
            <h4 data-editable="true">Kolumna 2</h4>
            <p data-editable="true">Treść drugiej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 15px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Kolumna 3" data-editable="true" style="width: 100%; height: auto; margin-bottom: 10px;" />
            <h4 data-editable="true">Kolumna 3</h4>
            <p data-editable="true">Treść trzeciej kolumny</p>
          </div>
        </div>` 
      },
      { 
        id: 'separator-4col', 
        name: 'Separator 4 kolumny', 
        icon: Grid3X3, 
        content: `<div class="separator-4col" data-editable="true" style="display: flex; gap: 10px; margin: 20px 0;">
          <div class="col" data-editable="true" style="flex: 1; padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Kolumna 1" data-editable="true" style="width: 100%; height: auto; margin-bottom: 8px;" />
            <h5 data-editable="true">Kolumna 1</h5>
            <p data-editable="true" style="font-size: 12px;">Treść pierwszej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Kolumna 2" data-editable="true" style="width: 100%; height: auto; margin-bottom: 8px;" />
            <h5 data-editable="true">Kolumna 2</h5>
            <p data-editable="true" style="font-size: 12px;">Treść drugiej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Kolumna 3" data-editable="true" style="width: 100%; height: auto; margin-bottom: 8px;" />
            <h5 data-editable="true">Kolumna 3</h5>
            <p data-editable="true" style="font-size: 12px;">Treść trzeciej kolumny</p>
          </div>
          <div class="col" data-editable="true" style="flex: 1; padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Kolumna 4" data-editable="true" style="width: 100%; height: auto; margin-bottom: 8px;" />
            <h5 data-editable="true">Kolumna 4</h5>
            <p data-editable="true" style="font-size: 12px;">Treść czwartej kolumny</p>
          </div>
        </div>` 
      }
    ]
  };

  // Initialize template - START WITH EMPTY TEMPLATE
  useEffect(() => {
    if (id && templates.length > 0) {
      const template = templates.find(t => t.id === id);
      if (template) {
        setActiveTemplate(template);
        setTemplateName(template.name);
        setTemplateDescription(template.description);
        setHtmlContent(template.htmlContent);
        setCssContent(template.cssContent);
        
        // POPRAWIONE PARSOWANIE BLOKÓW
        const parsedBlocks = parseHtmlIntoBlocks(template.htmlContent);
        setTemplateBlocks(parsedBlocks);
      }
    } else if (!id) {
      // New template - START EMPTY
      setTemplateName('Nowy szablon');
      setTemplateDescription('Opis nowego szablonu');
      setHtmlContent('<div class="template-container" data-editable="true" style="padding: 20px; font-family: Arial, sans-serif; min-height: 400px; border: 2px dashed #ccc; text-align: center; display: flex; align-items: center; justify-content: center; color: #666;"><p>Kliknij "Bloki" aby dodać pierwszy element do szablonu</p></div>');
      setCssContent(`
.template-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

/* Baselinker Styles */
.bl-product-name, .bl-auction-title {
  font-size: 36px;
  font-weight: 700;
  color: #2d3748;
  margin: 20px 0;
  text-align: center;
}

.bl-price-section {
  text-align: center;
  margin: 40px 0;
  padding: 30px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 16px;
  color: white;
}

.bl-price {
  font-size: 42px;
  color: white;
  font-weight: 800;
}

.bl-images {
  text-align: center;
  margin: 40px 0;
}

.bl-main-image {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.bl-description, .bl-additional-desc1, .bl-additional-desc2 {
  margin: 25px 0;
  padding: 20px;
  background: #fafafa;
  border-left: 4px solid #3498db;
  border-radius: 8px;
}

.bl-producer, .bl-category, .bl-weight, .bl-product-id {
  background: #e3f2fd;
  padding: 15px 20px;
  border-left: 5px solid #2196f3;
  margin: 25px 0;
  border-radius: 8px;
}

.bl-producer-label, .bl-category-label, .bl-weight-label, .bl-id-label {
  font-weight: bold;
  color: #1976d2;
}

.bl-producer-name, .bl-category-name, .bl-weight-value, .bl-id-value {
  color: #333;
  margin-left: 8px;
}

.bl-features-list {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.bl-features-list h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.bl-feature-color, .bl-feature-size, .bl-feature-material,
.bl-feature-with-name-color, .bl-feature-with-name-size {
  display: inline-block;
  background: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 20px;
  padding: 8px 16px;
  margin: 5px;
  font-size: 14px;
}

.bl-feature-label {
  font-weight: bold;
  color: #e65100;
}

.bl-feature-value {
  color: #333;
  margin-left: 5px;
}

.bl-producer-logo {
  text-align: center;
  margin: 20px 0;
}

.bl-logo-image {
  max-height: 80px;
  width: auto;
}

.bl-additional-images {
  margin: 30px 0;
  text-align: center;
}

.bl-shipping-cost {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
}

/* eBay Styles */
.ebay-title {
  font-size: 28px;
  font-weight: bold;
  color: #0654ba;
  margin: 15px 0;
}

.ebay-price-container {
  margin: 20px 0;
  background: #f7f7f7;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.ebay-price {
  font-size: 32px;
  color: #b12704;
  font-weight: bold;
}

.ebay-currency {
  font-size: 18px;
  color: #565959;
  margin-left: 5px;
}

.ebay-gallery {
  text-align: center;
  margin: 20px 0;
}

.ebay-main-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ebay-description {
  margin: 25px 0;
  padding: 20px;
  background: #fafafa;
  border-left: 4px solid #0654ba;
}

.ebay-buy-section {
  text-align: center;
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, #0654ba, #0073e6);
  border-radius: 12px;
}

.ebay-buy-button {
  background: #ffd814;
  color: #0f1111;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* Separator Styles */
.separator-line {
  border: 1px solid #ddd;
  margin: 20px 0;
}

.separator-space {
  height: 40px;
  background: transparent;
}

.separator-image-text {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.separator-2col,
.separator-3col,
.separator-4col {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.separator-2col .col,
.separator-3col .col,
.separator-4col .col {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.separator-3col .col,
.separator-4col .col {
  text-align: center;
}

.separator-4col .col {
  padding: 10px;
}

.separator-4col .col p {
  font-size: 12px;
}

/* General Styles */
.container {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.section {
  margin: 30px 0;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.grid-item {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
  text-align: center;
}

.list {
  margin: 20px 0;
  padding-left: 20px;
}

.image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 10px 0;
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.spec-table th,
.spec-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.spec-table th {
  background: #f5f5f5;
  font-weight: bold;
}

.product-features {
  margin: 20px 0;
  padding: 20px;
  background: #f0f8ff;
  border-radius: 8px;
}

.product-features ul {
  list-style-type: none;
  padding: 0;
}

.product-features li {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.product-features li:before {
  content: "✓ ";
  color: #4caf50;
  font-weight: bold;
}
      `);
      setTemplateBlocks([]);
    }
  }, [id, templates, setActiveTemplate]);

  // Update element properties when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setElementText(selectedElement.textContent || selectedElement.innerHTML);
      setElementClasses(selectedElement.className);
      setElementId(selectedElement.id);
      setElementSrc(selectedElement.src || '');
      setElementAlt(selectedElement.alt || '');
      setElementHref(selectedElement.href || '');
      
      // Parse inline styles
      const styles = selectedElement.style || {};
      setElementWidth(styles.width || '');
      setElementHeight(styles.height || '');
      setElementPadding(styles.padding || '');
      setElementMargin(styles.margin || '');
      setElementBackgroundColor(styles.backgroundColor || '');
      setElementTextColor(styles.color || '');
      setElementFontSize(styles.fontSize || '');
      setElementFontWeight(styles.fontWeight || '');
      setElementTextAlign(styles.textAlign || '');
      setElementBorderRadius(styles.borderRadius || '');
      setElementBorder(styles.border || '');
      
      // Image specific properties
      setElementObjectFit(styles.objectFit || '');
      setElementObjectPosition(styles.objectPosition || '');
      setElementFloat(styles.float || '');
      setElementDisplay(styles.display || '');
      setElementPosition(styles.position || '');
      setElementTop(styles.top || '');
      setElementLeft(styles.left || '');
      setElementRight(styles.right || '');
      setElementBottom(styles.bottom || '');
      setElementZIndex(styles.zIndex || '');
      setElementTransform(styles.transform || '');
    }
  }, [selectedElement]);

  // Update preview
  useEffect(() => {
    if (previewRef.current) {
      const iframe = previewRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const fullHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              ${cssContent}
              [data-editable="true"] { 
                position: relative; 
                cursor: pointer;
                transition: all 0.2s ease;
              }
              [data-editable="true"]:hover { 
                outline: 2px dashed #3b82f6; 
                outline-offset: 2px;
              }
              [data-editable="true"].editing { 
                outline: 2px solid #3b82f6; 
                outline-offset: 2px;
                background: rgba(59, 130, 246, 0.1);
              }
              /* Style dla drag & drop */
              .dragging {
                opacity: 0.6;
                transform: scale(0.98);
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
              }
              .drag-over {
                border: 2px dashed #3b82f6;
                background-color: rgba(59, 130, 246, 0.1);
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              document.addEventListener('click', function(e) {
                if (e.target.hasAttribute('data-editable')) {
                  e.preventDefault();
                  
                  // Remove previous editing class
                  document.querySelectorAll('.editing').forEach(el => el.classList.remove('editing'));
                  
                  // Add editing class to current element
                  e.target.classList.add('editing');
                  
                  // Get computed styles
                  const computedStyle = window.getComputedStyle(e.target);
                  const inlineStyle = e.target.style;
                  
                  window.parent.postMessage({
                    type: 'elementSelected',
                    element: {
                      tagName: e.target.tagName,
                      innerHTML: e.target.innerHTML,
                      textContent: e.target.textContent,
                      className: e.target.className,
                      id: e.target.id,
                      src: e.target.src,
                      alt: e.target.alt,
                      href: e.target.href,
                      style: {
                        width: inlineStyle.width || computedStyle.width,
                        height: inlineStyle.height || computedStyle.height,
                        padding: inlineStyle.padding || computedStyle.padding,
                        margin: inlineStyle.margin || computedStyle.margin,
                        backgroundColor: inlineStyle.backgroundColor || computedStyle.backgroundColor,
                        color: inlineStyle.color || computedStyle.color,
                        fontSize: inlineStyle.fontSize || computedStyle.fontSize,
                        fontWeight: inlineStyle.fontWeight || computedStyle.fontWeight,
                        textAlign: inlineStyle.textAlign || computedStyle.textAlign,
                        borderRadius: inlineStyle.borderRadius || computedStyle.borderRadius,
                        border: inlineStyle.border || computedStyle.border,
                        objectFit: inlineStyle.objectFit || computedStyle.objectFit,
                        objectPosition: inlineStyle.objectPosition || computedStyle.objectPosition,
                        float: inlineStyle.float || computedStyle.float,
                        display: inlineStyle.display || computedStyle.display,
                        position: inlineStyle.position || computedStyle.position,
                        top: inlineStyle.top || computedStyle.top,
                        left: inlineStyle.left || computedStyle.left,
                        right: inlineStyle.right || computedStyle.right,
                        bottom: inlineStyle.bottom || computedStyle.bottom,
                        zIndex: inlineStyle.zIndex || computedStyle.zIndex,
                        transform: inlineStyle.transform || computedStyle.transform
                      }
                    }
                  }, '*');
                }
              });
            </script>
          </body>
          </html>
        `;
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [htmlContent, cssContent]);

  // Handle element selection
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'elementSelected') {
        setSelectedElement(event.data.element);
        setIsEditing(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // AKTUALIZACJA BLOKÓW PRZY ZMIANIE HTML
  useEffect(() => {
    if (htmlContent && htmlContent !== '<div class="template-container" data-editable="true" style="padding: 20px; font-family: Arial, sans-serif; min-height: 400px; border: 2px dashed #ccc; text-align: center; display: flex; align-items: center; justify-content: center; color: #666;"><p>Kliknij "Bloki" aby dodać pierwszy element do szablonu</p></div>') {
      const parsedBlocks = parseHtmlIntoBlocks(htmlContent);
      if (parsedBlocks.length > 0 && parsedBlocks.length !== templateBlocks.length) {
        setTemplateBlocks(parsedBlocks);
      }
    }
  }, [htmlContent]);

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      htmlContent,
      cssContent,
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'inne' as const,
      isPublic: false,
      baselinkerTags: []
    };

    if (id && activeTemplate) {
      updateTemplate(id, templateData);
    } else {
      addTemplate(templateData);
      navigate('/templates');
    }
  };

  // NOWE FUNKCJE DLA PRZYCISKÓW
  const handlePasteHTML = () => {
    const htmlInput = prompt('Wklej kod HTML:');
    if (htmlInput) {
      setHtmlContent(htmlInput);
      setShowMoreMenu(false);
    }
  };

  const handleExport = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      htmlContent,
      cssContent,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(templateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowMoreMenu(false);
  };

  const handleDuplicate = () => {
    if (id && activeTemplate) {
      duplicateTemplate(id);
      navigate('/templates');
    } else {
      // Duplikuj aktualny szablon jako nowy
      const templateData = {
        name: `${templateName} - Kopia`,
        description: templateDescription,
        htmlContent,
        cssContent,
        thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'inne' as const,
        isPublic: false,
        baselinkerTags: []
      };
      addTemplate(templateData);
      navigate('/templates');
    }
    setShowMoreMenu(false);
  };

  // Funkcje obsługujące zdarzenia drag & drop
  const handleDragStart = (e: DragEvent<HTMLDivElement>, blockId: string, blockContent: string, isFromLibrary: boolean = false) => {
    e.dataTransfer.setData('blockId', blockId);
    e.dataTransfer.setData('blockContent', blockContent);
    e.dataTransfer.setData('isFromLibrary', isFromLibrary.toString());
    setDraggedBlockId(blockId);
    
    // Dodaj efekt wizualny dla przeciąganego elementu
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('dragging');
    }
    
    // Ustaw efekt wizualny dla kursora
    e.dataTransfer.effectAllowed = 'move';
    
    // Opcjonalnie możemy ustawić obraz podczas przeciągania
    // const dragImage = document.createElement('div');
    // dragImage.textContent = 'Blok: ' + blockId;
    // dragImage.style.cssText = 'padding: 10px; background: #3b82f6; color: white; border-radius: 4px; position: absolute; top: -1000px;';
    // document.body.appendChild(dragImage);
    // e.dataTransfer.setDragImage(dragImage, 0, 0);
    // setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, blockId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (blockId) {
      setDraggedOverBlockId(blockId);
      
      // Dodaj klasę dla elementu nad którym przeciągamy
      const element = e.currentTarget as HTMLElement;
      if (element && !element.classList.contains('drag-over')) {
        element.classList.add('drag-over');
      }
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverBlockId(null);
    
    // Usuń klasę dla elementu z którego wychodzimy
    const element = e.currentTarget as HTMLElement;
    if (element && element.classList.contains('drag-over')) {
      element.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex?: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');
    const blockContent = e.dataTransfer.getData('blockContent');
    const isFromLibrary = e.dataTransfer.getData('isFromLibrary') === 'true';
    
    // Usuń efekt wizualny
    setDraggedBlockId(null);
    setDraggedOverBlockId(null);
    
    // Usuń klasę dla elementu na który upuszczamy
    const element = e.currentTarget as HTMLElement;
    if (element && element.classList.contains('drag-over')) {
      element.classList.remove('drag-over');
    }
    
    if (isFromLibrary) {
      // Dodaj nowy blok z biblioteki
      addBlock(blockId, blockContent);
    } else if (targetIndex !== undefined) {
      // Przenieś istniejący blok
      const sourceIndex = templateBlocks.findIndex(block => block.id === blockId);
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        const newBlocks = [...templateBlocks];
        const [movedBlock] = newBlocks.splice(sourceIndex, 1);
        newBlocks.splice(targetIndex, 0, movedBlock);
        
        // Aktualizuj pozycje
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index
        }));
        
        setTemplateBlocks(updatedBlocks);
        
        // Aktualizuj HTML
        const reorderedHtml = updatedBlocks.map(block => block.content).join('\n');
        setHtmlContent(reorderedHtml);
      }
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    // Usuń efekt wizualny
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('dragging');
    }
    
    // Usuń wszystkie pozostałe efekty wizualne
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    setDraggedBlockId(null);
    setDraggedOverBlockId(null);
  };

  const addBlock = (blockId: string, blockContent: string) => {
    const newBlock = {
      id: `${blockId}-${Date.now()}`,
      type: blockId,
      content: blockContent,
      position: templateBlocks.length
    };
    
    setTemplateBlocks([...templateBlocks, newBlock]);
    
    // If this is the first block and we have the empty template, replace it
    if (templateBlocks.length === 0 && htmlContent.includes('Kliknij "Bloki" aby dodać pierwszy element')) {
      setHtmlContent(blockContent);
    } else {
      setHtmlContent(prev => prev + '\n' + blockContent);
    }
  };

  // Funkcja do przenoszenia bloków (stara metoda - przyciski)
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...templateBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setTemplateBlocks(newBlocks);
      
      // Update HTML content order
      const reorderedHtml = newBlocks.map(block => block.content).join('\n');
      setHtmlContent(reorderedHtml);
    }
  };

  const removeBlock = (index: number) => {
    const newBlocks = templateBlocks.filter((_, i) => i !== index);
    setTemplateBlocks(newBlocks);
    
    // Update HTML content
    if (newBlocks.length === 0) {
      // Return to empty template
      setHtmlContent('<div class="template-container" data-editable="true" style="padding: 20px; font-family: Arial, sans-serif; min-height: 400px; border: 2px dashed #ccc; text-align: center; display: flex; align-items: center; justify-content: center; color: #666;"><p>Kliknij "Bloki" aby dodać pierwszy element do szablonu</p></div>');
    } else {
      const updatedHtml = newBlocks.map(block => block.content).join('\n');
      setHtmlContent(updatedHtml);
    }
  };

  const applyElementChanges = () => {
    if (!selectedElement || !previewRef.current) return;

    const iframe = previewRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Find the element in the iframe
    const editingElement = doc.querySelector('.editing');
    if (!editingElement) return;

    // Clear existing styles to avoid conflicts
    const element = editingElement as HTMLElement;
    element.style.cssText = '';

    // Update element properties
    if (selectedElement.tagName === 'IMG') {
      if (elementSrc) (editingElement as HTMLImageElement).src = elementSrc;
      if (elementAlt) (editingElement as HTMLImageElement).alt = elementAlt;
    } else if (selectedElement.tagName === 'A') {
      if (elementHref) (editingElement as HTMLAnchorElement).href = elementHref;
      editingElement.textContent = elementText;
    } else {
      editingElement.innerHTML = elementText;
    }

    // Update attributes
    editingElement.className = elementClasses;
    if (elementId) editingElement.id = elementId;

    // Update inline styles
    if (elementWidth) element.style.width = elementWidth;
    if (elementHeight) element.style.height = elementHeight;
    if (elementPadding) element.style.padding = elementPadding;
    if (elementMargin) element.style.margin = elementMargin;
    if (elementBackgroundColor) element.style.backgroundColor = elementBackgroundColor;
    if (elementTextColor) element.style.color = elementTextColor;
    if (elementFontSize) element.style.fontSize = elementFontSize;
    if (elementFontWeight) element.style.fontWeight = elementFontWeight;
    if (elementTextAlign) element.style.textAlign = elementTextAlign;
    if (elementBorderRadius) element.style.borderRadius = elementBorderRadius;
    if (elementBorder) element.style.border = elementBorder;
    
    // Image specific styles
    if (elementObjectFit) element.style.objectFit = elementObjectFit;
    if (elementObjectPosition) element.style.objectPosition = elementObjectPosition;
    if (elementFloat) element.style.float = elementFloat;
    if (elementDisplay) element.style.display = elementDisplay;
    if (elementPosition) element.style.position = elementPosition;
    if (elementTop) element.style.top = elementTop;
    if (elementLeft) element.style.left = elementLeft;
    if (elementRight) element.style.right = elementRight;
    if (elementBottom) element.style.bottom = elementBottom;
    if (elementZIndex) element.style.zIndex = elementZIndex;
    if (elementTransform) element.style.transform = elementTransform;

    // Update HTML content with a delay to ensure DOM is updated
    setTimeout(() => {
      const bodyContent = doc.body.innerHTML;
      // Remove script tags from the content
      const cleanContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      setHtmlContent(cleanContent);
      
      // Clear selection state
      setSelectedElement(null);
      setIsEditing(false);
    }, 100);
  };

  const applyTextFormatting = (format: string) => {
    if (!selectedElement || selectedElement.tagName === 'IMG') return;

    switch (format) {
      case 'bold':
        setElementFontWeight(elementFontWeight === 'bold' ? 'normal' : 'bold');
        break;
      case 'italic':
        // Toggle italic style
        break;
      case 'underline':
        // Toggle underline style
        break;
    }
  };

  const applyAlignment = (alignment: string) => {
    setElementTextAlign(alignment);
  };

  const getDeviceWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const renderBlocksPanel = () => (
    <div className="w-72 bg-slate-800 border-r border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold">Bloki szablonu</h3>
        <p className="text-slate-400 text-sm">Przeciągnij lub kliknij aby dodać blok</p>
      </div>
      
      <div 
        className="p-4 space-y-6"
        onDragOver={(e: DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e)}
      >
        {Object.entries(blockCategories).map(([category, blocks]) => (
          <div key={category}>
            <h4 className="text-blue-400 font-medium mb-3 text-sm">{category}</h4>
            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e: DragEvent<HTMLDivElement>) => handleDragStart(e, block.id, block.content, true)}
                  onDragEnd={(e: DragEvent<HTMLDivElement>) => handleDragEnd(e)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors text-left cursor-grab active:cursor-grabbing"
                  onClick={() => addBlock(block.id, block.content)}
                >
                  <block.icon className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{block.name}</p>
                    <p className="text-slate-400 text-xs">{category.split(' - ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrderPanel = () => (
    <div className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold">Kolejność bloków</h3>
        <p className="text-slate-400 text-sm">Przeciągnij aby zmienić kolejność</p>
      </div>
      
      <div className="p-4">
        {templateBlocks.length === 0 ? (
          <p className="text-slate-400 text-sm">Brak bloków do zarządzania</p>
        ) : (
          <div className="space-y-2">
            {templateBlocks.map((block, index) => (
              <div 
                key={block.id} 
                className={`flex items-center gap-2 p-2 bg-slate-900 rounded-lg cursor-grab active:cursor-grabbing ${draggedBlockId === block.id ? 'opacity-50 border border-blue-500' : ''} ${draggedOverBlockId === block.id ? 'border border-dashed border-blue-400 bg-slate-800' : ''}`}
                draggable
                onDragStart={(e: DragEvent<HTMLDivElement>) => handleDragStart(e, block.id, block.content)}
                onDragOver={(e: DragEvent<HTMLDivElement>) => handleDragOver(e, block.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <span className="text-slate-400 text-sm w-6">{index + 1}.</span>
                <span className="text-white text-sm flex-1 truncate">{block.type}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-50"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === templateBlocks.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-50"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeBlock(index)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCodePanel = () => (
    <div className="w-1/2 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">HTML</button>
          <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm">CSS</button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="w-full h-full bg-slate-900 text-white font-mono text-sm border border-slate-600 rounded p-3 resize-none focus:outline-none focus:border-blue-500"
          placeholder="Wprowadź kod HTML..."
        />
      </div>
    </div>
  );

  const renderPropertiesPanel = () => (
    <div className="w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold">Właściwości elementu</h3>
        <p className="text-slate-400 text-sm">
          {selectedElement ? `${selectedElement.tagName.toLowerCase()}` : 'Kliknij element aby edytować'}
        </p>
      </div>
      
      <div className="p-4 space-y-6">
        {!selectedElement ? (
          <p className="text-slate-400 text-sm">Wybierz element do edycji klikając na niego w podglądzie</p>
        ) : (
          <>
            {/* Text Formatting */}
            {selectedElement.tagName !== 'IMG' && (
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Formatowanie tekstu</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => applyTextFormatting('bold')}
                    className={`p-2 rounded ${elementFontWeight === 'bold' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('italic')}
                    className="p-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyTextFormatting('underline')}
                    className="p-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => applyAlignment('left')}
                    className={`p-2 rounded ${elementTextAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyAlignment('center')}
                    className={`p-2 rounded ${elementTextAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyAlignment('right')}
                    className={`p-2 rounded ${elementTextAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyAlignment('justify')}
                    className={`p-2 rounded ${elementTextAlign === 'justify' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={elementText}
                  onChange={(e) => setElementText(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  rows={3}
                  placeholder="Treść elementu..."
                />
              </div>
            )}

            {/* Image Properties - ROZSZERZONE */}
            {selectedElement.tagName === 'IMG' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Źródło obrazka
                  </label>
                  <input
                    type="text"
                    value={elementSrc}
                    onChange={(e) => setElementSrc(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Tekst alternatywny</label>
                  <input
                    type="text"
                    value={elementAlt}
                    onChange={(e) => setElementAlt(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="Opis obrazka"
                  />
                </div>

                {/* Dopasowanie obrazka */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <Settings className="w-4 h-4 inline mr-1" />
                    Dopasowanie obrazka
                  </label>
                  <select
                    value={elementObjectFit}
                    onChange={(e) => setElementObjectFit(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  >
                    <option value="">Domyślne</option>
                    <option value="contain">Contain - cały obrazek widoczny</option>
                    <option value="cover">Cover - wypełnia obszar</option>
                    <option value="fill">Fill - rozciąga do wymiarów</option>
                    <option value="scale-down">Scale-down - pomniejsza jeśli potrzeba</option>
                    <option value="none">None - oryginalny rozmiar</option>
                  </select>
                </div>

                {/* Pozycja obrazka */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <Move className="w-4 h-4 inline mr-1" />
                    Pozycja obrazka
                  </label>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {['top left', 'top center', 'top right', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setElementObjectPosition(pos)}
                        className={`p-2 text-xs rounded ${elementObjectPosition === pos ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {pos.split(' ').map(p => p.charAt(0).toUpperCase()).join('')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={elementObjectPosition}
                    onChange={(e) => setElementObjectPosition(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="np. 50% 50% lub center top"
                  />
                </div>

                {/* Pozycjonowanie */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <RotateCw className="w-4 h-4 inline mr-1" />
                    Pozycjonowanie
                  </label>
                  <div className="space-y-2">
                    <select
                      value={elementPosition}
                      onChange={(e) => setElementPosition(e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    >
                      <option value="">Position</option>
                      <option value="static">Static</option>
                      <option value="relative">Relative</option>
                      <option value="absolute">Absolute</option>
                      <option value="fixed">Fixed</option>
                      <option value="sticky">Sticky</option>
                    </select>
                    
                    {elementPosition && elementPosition !== 'static' && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={elementTop}
                          onChange={(e) => setElementTop(e.target.value)}
                          className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                          placeholder="Top (px, %)"
                        />
                        <input
                          type="text"
                          value={elementRight}
                          onChange={(e) => setElementRight(e.target.value)}
                          className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                          placeholder="Right (px, %)"
                        />
                        <input
                          type="text"
                          value={elementBottom}
                          onChange={(e) => setElementBottom(e.target.value)}
                          className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                          placeholder="Bottom (px, %)"
                        />
                        <input
                          type="text"
                          value={elementLeft}
                          onChange={(e) => setElementLeft(e.target.value)}
                          className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                          placeholder="Left (px, %)"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Float i Display */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Układ</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={elementFloat}
                      onChange={(e) => setElementFloat(e.target.value)}
                      className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    >
                      <option value="">Float</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="none">None</option>
                    </select>
                    
                    <select
                      value={elementDisplay}
                      onChange={(e) => setElementDisplay(e.target.value)}
                      className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    >
                      <option value="">Display</option>
                      <option value="block">Block</option>
                      <option value="inline">Inline</option>
                      <option value="inline-block">Inline-block</option>
                      <option value="flex">Flex</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                {/* Z-Index i Transform */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Efekty</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={elementZIndex}
                      onChange={(e) => setElementZIndex(e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                      placeholder="Z-Index (liczba)"
                    />
                    <input
                      type="text"
                      value={elementTransform}
                      onChange={(e) => setElementTransform(e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                      placeholder="Transform (rotate(45deg), scale(1.2))"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Link Properties */}
            {selectedElement.tagName === 'A' && (
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Adres URL</label>
                <input
                  type="text"
                  value={elementHref}
                  onChange={(e) => setElementHref(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* Dimensions */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Wymiary</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={elementWidth}
                  onChange={(e) => setElementWidth(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Szerokość (px, %, auto)"
                />
                <input
                  type="text"
                  value={elementHeight}
                  onChange={(e) => setElementHeight(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Wysokość (px, %, auto)"
                />
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Odstępy</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={elementPadding}
                  onChange={(e) => setElementPadding(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Padding (px)"
                />
                <input
                  type="text"
                  value={elementMargin}
                  onChange={(e) => setElementMargin(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Margin (px)"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Kolory</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={elementBackgroundColor}
                    onChange={(e) => setElementBackgroundColor(e.target.value)}
                    className="w-12 h-8 rounded border border-slate-600"
                  />
                  <input
                    type="text"
                    value={elementBackgroundColor}
                    onChange={(e) => setElementBackgroundColor(e.target.value)}
                    className="flex-1 bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="Kolor tła"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={elementTextColor}
                    onChange={(e) => setElementTextColor(e.target.value)}
                    className="w-12 h-8 rounded border border-slate-600"
                  />
                  <input
                    type="text"
                    value={elementTextColor}
                    onChange={(e) => setElementTextColor(e.target.value)}
                    className="flex-1 bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="Kolor tekstu"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            {selectedElement.tagName !== 'IMG' && (
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Typografia</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={elementFontSize}
                    onChange={(e) => setElementFontSize(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                    placeholder="Rozmiar czcionki (px, em, rem)"
                  />
                  <select
                    value={elementFontWeight}
                    onChange={(e) => setElementFontWeight(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  >
                    <option value="">Grubość czcionki</option>
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Lighter</option>
                    <option value="bolder">Bolder</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                  </select>
                </div>
              </div>
            )}

            {/* Border & Effects */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Obramowanie i efekty</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={elementBorder}
                  onChange={(e) => setElementBorder(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Obramowanie (1px solid #000)"
                />
                <input
                  type="text"
                  value={elementBorderRadius}
                  onChange={(e) => setElementBorderRadius(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Zaokrąglenie (px)"
                />
              </div>
            </div>

            {/* Attributes */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Atrybuty</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={elementClasses}
                  onChange={(e) => setElementClasses(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="Klasy CSS"
                />
                <input
                  type="text"
                  value={elementId}
                  onChange={(e) => setElementId(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm"
                  placeholder="ID elementu"
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyElementChanges}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Zastosuj zmiany
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-slate-900 text-white border border-slate-600 rounded px-3 py-1 text-sm w-48"
            />
            <input
              type="text"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="bg-slate-900 text-white border border-slate-600 rounded px-3 py-1 text-sm w-64"
              placeholder="Opis szablonu"
            />
            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">
              Auto-zapis włączony
            </span>
          </div>

          {/* Compact Toolbar */}
          <div className="flex items-center gap-1">
            {/* View Tabs */}
            <div className="flex bg-slate-700 rounded p-0.5 mr-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-1 rounded text-xs ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              >
                <Eye className="w-3 h-3 inline mr-1" />
                <span className="hidden sm:inline">Podgląd</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-2 py-1 rounded text-xs ${activeTab === 'code' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              >
                <Code className="w-3 h-3 inline mr-1" />
                <span className="hidden sm:inline">Kod</span>
              </button>
            </div>

            {/* Device Views */}
            <div className="flex bg-slate-700 rounded p-0.5 mr-2">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1 rounded ${deviceView === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              >
                <Monitor className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`p-1 rounded ${deviceView === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              >
                <Tablet className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1 rounded ${deviceView === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              >
                <Smartphone className="w-3 h-3" />
              </button>
            </div>

            {/* Panel Toggles */}
            <button
              onClick={() => setActivePanel(activePanel === 'blocks' ? null : 'blocks')}
              className={`px-2 py-1 rounded text-xs ${activePanel === 'blocks' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              <Grid3X3 className="w-3 h-3 inline mr-1" />
              <span className="hidden lg:inline">Bloki</span>
            </button>

            <button
              onClick={() => setActivePanel(activePanel === 'order' ? null : 'order')}
              className={`px-2 py-1 rounded text-xs ${activePanel === 'order' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              <ArrowUp className="w-3 h-3 inline mr-1" />
              <span className="hidden lg:inline">Kolejność</span>
            </button>

            <button
              onClick={() => setActivePanel(activePanel === 'code' ? null : 'code')}
              className={`px-2 py-1 rounded text-xs ${activePanel === 'code' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              <Code className="w-3 h-3 inline mr-1" />
              <span className="hidden lg:inline">Kod</span>
            </button>

            {/* Action Buttons */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-2 py-1 rounded text-xs ${isEditing ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              <Edit3 className="w-3 h-3 inline mr-1" />
              <span className="hidden lg:inline">Tryb edycji</span>
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>
              
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <button 
                    onClick={handlePasteHTML}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 text-sm"
                  >
                    <Upload className="w-3 h-3" />
                    Wklej HTML
                  </button>
                  <button 
                    onClick={handleExport}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 text-sm"
                  >
                    <Download className="w-3 h-3" />
                    Eksportuj
                  </button>
                  <button 
                    onClick={handleDuplicate}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 text-sm"
                  >
                    <Copy className="w-3 h-3" />
                    Duplikuj
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs ml-2"
            >
              <Save className="w-3 h-3 inline mr-1" />
              <span className="hidden sm:inline">Zapisz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {activePanel === 'blocks' && renderBlocksPanel()}
        {activePanel === 'order' && renderOrderPanel()}
        {activePanel === 'code' && renderCodePanel()}

        {/* Preview Area - FULL SIZE */}
        <div className="flex-1 bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Podgląd na żywo</h2>
          </div>
          
          {/* FULL HEIGHT PREVIEW */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="h-full flex justify-center">
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
                style={{ 
                  width: getDeviceWidth(),
                  maxWidth: '100%',
                  minHeight: '100%'
                }}
              >
                <iframe
                  ref={previewRef}
                  className="w-full h-full border-0"
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        {isEditing && renderPropertiesPanel()}
      </div>
    </div>
  );
};

export default Editor;