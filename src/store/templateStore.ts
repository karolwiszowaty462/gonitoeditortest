import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'elektronika' | 'moda' | 'dom' | 'auto' | 'sport' | 'inne';
  thumbnail: string;
  htmlContent: string;
  cssContent: string;
  baselinkerTags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: Template[];
  currentTemplate: Template | null;
  activeTemplate: Template | null;
  initializeTemplates: () => void;
  resetTemplates: () => void;
  createTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  setCurrentTemplate: (template: Template | null) => void;
  setActiveTemplate: (template: Template | null) => void;
  getTemplateById: (id: string) => Template | undefined;
}

const defaultTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Klasyczny eBay',
    description: 'Prosty i elegancki szablon dla wszystkich kategorii produktów',
    category: 'inne',
    thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]', '[kategoria]'],
    htmlContent: `
      <!-- Główny kontener szablonu -->
      <div class="ebay-template classic-template">
        <!-- Nagłówek - pojedynczy blok -->
        <header class="ebay-header header-section" data-block="header">
          <h1 class="ebay-title">[nazwa]</h1>
          <div class="ebay-price">Cena: [cena] PLN</div>
        </header>
        
        <!-- Sekcja zdjęcia - pojedynczy blok -->
        <section class="ebay-gallery image-section" data-block="gallery">
          <img src="[obrazek]" alt="[nazwa]" class="main-image" />
        </section>
        
        <!-- Sekcja opisu - pojedynczy blok -->
        <section class="ebay-description description-section" data-block="description">
          <h2>Opis produktu</h2>
          <div class="description-content">[opis]</div>
        </section>
        
        <!-- Sekcja cech produktu - pojedynczy blok -->
        <section class="ebay-features features" data-block="features">
          <h3>Cechy produktu:</h3>
          <ul class="features-list">
            <li>Wysoka jakość</li>
            <li>Szybka wysyłka</li>
            <li>Gwarancja</li>
          </ul>
        </section>
        
        <!-- Stopka - pojedynczy blok -->
        <footer class="ebay-footer footer-section" data-block="footer">
          <div class="producer">Producent: [producent]</div>
          <div class="category">Kategoria: [kategoria]</div>
        </footer>
      </div>
    `,
    cssContent: `
      /* Główne style szablonu */
      .ebay-template {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: #fff;
        color: #333;
      }
      
      /* Style nagłówka */
      .ebay-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #e74c3c;
        padding-bottom: 20px;
      }
      
      .ebay-title {
        color: #2c3e50;
        font-size: 28px;
        margin-bottom: 10px;
      }
      
      .ebay-price {
        font-size: 24px;
        color: #e74c3c;
        font-weight: bold;
      }
      
      /* Style galerii */
      .ebay-gallery {
        margin-bottom: 30px;
        text-align: center;
      }
      
      .main-image {
        width: 100%;
        max-width: 500px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      /* Style opisu */
      .ebay-description {
        margin-bottom: 30px;
      }
      
      .ebay-description h2 {
        color: #2c3e50;
        border-bottom: 1px solid #bdc3c7;
        padding-bottom: 10px;
      }
      
      /* Style cech produktu */
      .ebay-features {
        margin-top: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 5px;
        margin-bottom: 30px;
      }
      
      .features-list {
        margin-left: 20px;
        line-height: 1.6;
      }
      
      /* Style stopki */
      .ebay-footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #bdc3c7;
        color: #7f8c8d;
      }
      
      /* Responsywność dla urządzeń mobilnych */
      @media (max-width: 768px) {
        .ebay-template {
          padding: 15px;
        }
        
        .ebay-title {
          font-size: 24px;
        }
        
        .ebay-price {
          font-size: 20px;
        }
      }
    `,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Nowoczesny Gradient',
    description: 'Stylowy szablon z gradientami i nowoczesnymi elementami',
    category: 'elektronika',
    thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]'],
    htmlContent: `
      <!-- Główny kontener szablonu -->
      <div class="ebay-template modern-template">
        <!-- Nagłówek - pojedynczy blok -->
        <header class="ebay-header gradient-header" data-block="header">
          <h1 class="ebay-title modern-title">[nazwa]</h1>
          <div class="ebay-price price-badge">[cena] PLN</div>
        </header>
        
        <!-- Sekcja zawartości - pojedynczy blok -->
        <div class="content-grid">
          <!-- Sekcja zdjęcia - pojedynczy blok -->
          <section class="ebay-gallery image-container" data-block="gallery">
            <img src="[obrazek]" alt="[nazwa]" class="product-image" />
            <div class="image-overlay">
              <span>Najwyższa jakość</span>
            </div>
          </section>
          
          <!-- Sekcja informacji - pojedynczy blok -->
          <section class="ebay-info info-panel" data-block="info">
            <!-- Sekcja producenta - pojedynczy blok -->
            <div class="producer-section" data-block="producer">
              <h3>Producent</h3>
              <p>[producent]</p>
            </div>
            
            <!-- Sekcja opisu - pojedynczy blok -->
            <div class="ebay-description description-panel" data-block="description">
              <h3>Opis</h3>
              <div>[opis]</div>
            </div>
            
            <!-- Sekcja cech - pojedynczy blok -->
            <div class="ebay-features features-grid" data-block="features">
              <h3>Specyfikacja</h3>
              <ul class="features-list">
                <li>Nowoczesny design</li>
                <li>Wysokiej jakości materiały</li>
                <li>Gwarancja producenta</li>
              </ul>
            </div>
          </section>
        </div>
        
        <!-- Sekcja CTA - pojedynczy blok -->
        <footer class="ebay-footer cta-section" data-block="footer">
          <h2>Zamów już dziś!</h2>
          <p>Szybka wysyłka • Gwarancja jakości • Bezpieczne płatności</p>
        </footer>
      </div>
    `,
    cssContent: `
      .modern-template {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }
      
      .gradient-header {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        padding: 40px;
        text-align: center;
        position: relative;
      }
      
      .modern-title {
        color: white;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      
      .price-badge {
        background: rgba(255,255,255,0.2);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 24px;
        font-weight: bold;
        display: inline-block;
        backdrop-filter: blur(10px);
      }
      
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        background: white;
      }
      
      .image-container {
        position: relative;
        overflow: hidden;
      }
      
      .product-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      .product-image:hover {
        transform: scale(1.05);
      }
      
      .image-overlay {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: bold;
      }
      
      .info-panel {
        padding: 40px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }
      
      .producer-section, .description-panel, .features-grid {
        margin-bottom: 30px;
      }
      
      .info-panel h3 {
        color: #2c3e50;
        font-size: 20px;
        margin-bottom: 15px;
        border-left: 4px solid #3498db;
        padding-left: 15px;
      }
      
      .cta-section {
        background: linear-gradient(45deg, #2c3e50, #34495e);
        color: white;
        padding: 40px;
        text-align: center;
      }
      
      .cta-section h2 {
        font-size: 28px;
        margin-bottom: 15px;
      }
    `,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'template-3',
    name: 'Minimalistyczny',
    description: 'Czysty i minimalistyczny design z naciskiem na treść',
    category: 'moda',
    thumbnail: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[kategoria]'],
    htmlContent: `
      <!-- Główny kontener szablonu -->
      <div class="ebay-template minimal-template">
        <!-- Nagłówek - pojedynczy blok -->
        <header class="ebay-header minimal-header" data-block="header">
          <h1 class="ebay-title clean-title">[nazwa]</h1>
          <div class="category-tag">[kategoria]</div>
        </header>
        
        <!-- Główna zawartość -->
        <main class="minimal-main">
          <!-- Sekcja zdjęcia - pojedynczy blok -->
          <section class="ebay-gallery image-section" data-block="gallery">
            <img src="[obrazek]" alt="[nazwa]" class="clean-image" />
          </section>
          
          <!-- Sekcja treści - pojedynczy blok -->
          <section class="content-section" data-block="content">
            <!-- Sekcja ceny - pojedynczy blok -->
            <div class="ebay-price price-section" data-block="price">
              <span class="price-label">Cena:</span>
              <span class="price-value">[cena] PLN</span>
            </div>
            
            <!-- Sekcja opisu - pojedynczy blok -->
            <div class="ebay-description description-section" data-block="description">
              <h2>O produkcie</h2>
              <div class="description-text">[opis]</div>
            </div>
            
            <!-- Sekcja specyfikacji - pojedynczy blok -->
            <div class="ebay-features specs-section" data-block="specs">
              <h2>Specyfikacja</h2>
              <ul class="specs-list">
                <li>Minimalistyczny design</li>
                <li>Łatwe w użyciu</li>
                <li>Wysokiej jakości wykonanie</li>
              </ul>
            </div>
          </section>
        </main>
        
        <!-- Stopka - pojedynczy blok -->
        <footer class="ebay-footer minimal-footer" data-block="footer">
          <p>Dziękujemy za zainteresowanie naszym produktem</p>
        </footer>
      </div>
    `,
    cssContent: `
      .minimal-template {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        background: #ffffff;
        line-height: 1.6;
      }
      
      .minimal-header {
        padding: 60px 40px 40px;
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .clean-title {
        font-size: 36px;
        font-weight: 300;
        color: #333;
        margin-bottom: 20px;
        letter-spacing: -1px;
      }
      
      .category-tag {
        background: #f8f8f8;
        color: #666;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        display: inline-block;
      }
      
      .minimal-main {
        padding: 40px;
      }
      
      .image-section {
        margin-bottom: 40px;
        text-align: center;
      }
      
      .clean-image {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      
      .content-section > div {
        margin-bottom: 40px;
      }
      
      .price-section {
        text-align: center;
        padding: 30px;
        background: #f9f9f9;
        border-radius: 8px;
      }
      
      .price-label {
        font-size: 18px;
        color: #666;
        margin-right: 10px;
      }
      
      .price-value {
        font-size: 32px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .description-section h2,
      .specs-section h2 {
        font-size: 24px;
        font-weight: 400;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .description-text,
      .specs-list {
        color: #555;
        font-size: 16px;
      }
      
      .minimal-footer {
        padding: 40px;
        text-align: center;
        border-top: 1px solid #e0e0e0;
        color: #999;
        font-size: 14px;
      }
    `,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'template-4',
    name: 'Professional Electronics Gallery',
    description: 'Profesjonalny szablon dla elektroniki z galerią zdjęć',
    category: 'elektronika',
    thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]', '[cechy_lista]', '[dodatkowe_obrazki]'],
    htmlContent: `
      <div class="ebay-template pro-electronics">
        <div class="pro-header" data-editable="true">
          <div class="brand-section" data-editable="true">
            <img src="[producent_logo]" alt="[producent]" class="brand-logo" data-editable="true" />
            <span class="brand-name" data-editable="true">[producent]</span>
          </div>
          <h1 class="pro-title" data-editable="true">[nazwa_aukcji]</h1>
          <div class="pro-price" data-editable="true">
            <span class="currency" data-editable="true">PLN</span>
            <span class="amount" data-editable="true">[cena]</span>
          </div>
        </div>
        
        <div class="pro-content">
          <div class="pro-gallery" data-editable="true">
            <div class="main-image-container" data-editable="true">
              <img src="[obrazek]" alt="[nazwa]" class="main-product-image" data-editable="true" />
              <div class="image-badge" data-editable="true">NOWY</div>
            </div>
            <div class="thumbnail-gallery" data-editable="true">
              <div class="thumbnails" data-editable="true">[dodatkowe_obrazki]</div>
            </div>
          </div>
          
          <div class="pro-info" data-editable="true">
            <div class="quick-specs" data-editable="true">
              <h3 data-editable="true">Kluczowe cechy</h3>
              <div class="specs-grid" data-editable="true">
                <div class="spec-item" data-editable="true">
                  <span class="spec-label" data-editable="true">Model:</span>
                  <span class="spec-value" data-editable="true">[cecha|model]</span>
                </div>
                <div class="spec-item" data-editable="true">
                  <span class="spec-label" data-editable="true">Kolor:</span>
                  <span class="spec-value" data-editable="true">[cecha|kolor]</span>
                </div>
                <div class="spec-item" data-editable="true">
                  <span class="spec-label" data-editable="true">Gwarancja:</span>
                  <span class="spec-value" data-editable="true">[cecha|gwarancja]</span>
                </div>
                <div class="spec-item" data-editable="true">
                  <span class="spec-label" data-editable="true">Stan:</span>
                  <span class="spec-value" data-editable="true">Nowy</span>
                </div>
              </div>
            </div>
            
            <div class="shipping-info" data-editable="true">
              <h3 data-editable="true">Wysyłka</h3>
              <div class="shipping-options" data-editable="true">
                <div class="shipping-option" data-editable="true">
                  <span class="shipping-method" data-editable="true">Kurier 24h:</span>
                  <span class="shipping-price" data-editable="true">[przesylka1] PLN</span>
                </div>
                <div class="shipping-option" data-editable="true">
                  <span class="shipping-method" data-editable="true">Paczkomat:</span>
                  <span class="shipping-price" data-editable="true">12.99 PLN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pro-description" data-editable="true">
          <h2 data-editable="true">Opis produktu</h2>
          <div class="description-content" data-editable="true">[opis]</div>
          <div class="additional-description" data-editable="true">[opis_dodatkowy1]</div>
        </div>
        
        <div class="pro-specifications" data-editable="true">
          <h2 data-editable="true">Pełna specyfikacja</h2>
          <div class="full-specs" data-editable="true">[cechy_lista]</div>
        </div>
        
        <div class="pro-footer" data-editable="true">
          <div class="trust-badges" data-editable="true">
            <div class="badge" data-editable="true">✓ Autoryzowany sprzedawca</div>
            <div class="badge" data-editable="true">✓ Szybka wysyłka</div>
            <div class="badge" data-editable="true">✓ Gwarancja producenta</div>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .pro-electronics {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e0e0e0;
      }
      
      .pro-header {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: white;
        padding: 30px;
        text-align: center;
      }
      
      .brand-section {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }
      
      .brand-logo {
        height: 40px;
        margin-right: 15px;
        background: white;
        padding: 5px;
        border-radius: 4px;
      }
      
      .brand-name {
        font-size: 18px;
        font-weight: 600;
      }
      
      .pro-title {
        font-size: 28px;
        font-weight: 700;
        margin: 20px 0;
        line-height: 1.2;
      }
      
      .pro-price {
        font-size: 36px;
        font-weight: 800;
        background: rgba(255,255,255,0.1);
        padding: 15px 30px;
        border-radius: 50px;
        display: inline-block;
      }
      
      .currency {
        font-size: 24px;
        margin-right: 10px;
      }
      
      .pro-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        padding: 40px;
      }
      
      .main-image-container {
        position: relative;
        margin-bottom: 20px;
      }
      
      .main-product-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }
      
      .image-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #e74c3c;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 12px;
      }
      
      .thumbnail-gallery {
        display: flex;
        gap: 10px;
        overflow-x: auto;
      }
      
      .thumbnails img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.3s;
      }
      
      .thumbnails img:hover {
        border-color: #2a5298;
      }
      
      .quick-specs, .shipping-info {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        margin-bottom: 25px;
      }
      
      .quick-specs h3, .shipping-info h3 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 18px;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
      }
      
      .specs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      
      .spec-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .spec-label {
        font-weight: 600;
        color: #555;
      }
      
      .spec-value {
        color: #2c3e50;
        font-weight: 500;
      }
      
      .shipping-option {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .shipping-method {
        color: #555;
      }
      
      .shipping-price {
        font-weight: bold;
        color: #27ae60;
      }
      
      .pro-description, .pro-specifications {
        padding: 40px;
        border-top: 1px solid #e0e0e0;
      }
      
      .pro-description h2, .pro-specifications h2 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 25px;
        border-left: 4px solid #3498db;
        padding-left: 20px;
      }
      
      .description-content, .additional-description {
        line-height: 1.8;
        color: #555;
        margin-bottom: 20px;
      }
      
      .full-specs {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        line-height: 1.8;
      }
      
      .pro-footer {
        background: #2c3e50;
        color: white;
        padding: 30px;
        text-align: center;
      }
      
      .trust-badges {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
      }
      
      .badge {
        background: rgba(255,255,255,0.1);
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 500;
      }
    `,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: 'template-5',
    name: 'Luxury Fashion Boutique',
    description: 'Elegancki szablon dla produktów modowych premium',
    category: 'moda',
    thumbnail: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]', '[cechy_lista]', '[cecha|rozmiar]', '[cecha|kolor]', '[cecha|materiał]'],
    htmlContent: `
      <div class="ebay-template luxury-fashion">
        <div class="luxury-header" data-editable="true">
          <div class="luxury-brand" data-editable="true">
            <img src="[producent_logo]" alt="[producent]" class="luxury-logo" data-editable="true" />
            <div class="brand-info" data-editable="true">
              <span class="brand-name" data-editable="true">[producent]</span>
              <span class="collection" data-editable="true">Kolekcja Premium</span>
            </div>
          </div>
          <h1 class="luxury-title" data-editable="true">[nazwa_aukcji]</h1>
          <div class="luxury-price" data-editable="true">
            <span class="price-amount" data-editable="true">[cena]</span>
            <span class="price-currency" data-editable="true">PLN</span>
          </div>
        </div>
        
        <div class="luxury-showcase" data-editable="true">
          <div class="luxury-gallery" data-editable="true">
            <div class="main-fashion-image" data-editable="true">
              <img src="[obrazek]" alt="[nazwa]" class="hero-image" data-editable="true" />
              <div class="luxury-badge" data-editable="true">PREMIUM</div>
            </div>
            <div class="fashion-thumbnails" data-editable="true">
              <div class="thumbnail-row" data-editable="true">[dodatkowe_obrazki]</div>
            </div>
          </div>
          
          <div class="luxury-details" data-editable="true">
            <div class="size-color-section" data-editable="true">
              <h3 data-editable="true">Dostępne opcje</h3>
              <div class="options-grid" data-editable="true">
                <div class="option-group" data-editable="true">
                  <label data-editable="true">Rozmiar:</label>
                  <div class="size-options" data-editable="true">
                    <span class="size-option" data-editable="true">[cecha|rozmiar]</span>
                  </div>
                </div>
                <div class="option-group" data-editable="true">
                  <label data-editable="true">Kolor:</label>
                  <div class="color-options" data-editable="true">
                    <span class="color-option" data-editable="true">[cecha|kolor]</span>
                  </div>
                </div>
                <div class="option-group" data-editable="true">
                  <label data-editable="true">Materiał:</label>
                  <div class="material-info" data-editable="true">[cecha|materiał]</div>
                </div>
              </div>
            </div>
            
            <div class="luxury-features" data-editable="true">
              <h3 data-editable="true">Cechy produktu</h3>
              <div class="features-list" data-editable="true">
                <div class="feature-item" data-editable="true">
                  <span class="feature-icon" data-editable="true">✨</span>
                  <span data-editable="true">Najwyższa jakość wykonania</span>
                </div>
                <div class="feature-item" data-editable="true">
                  <span class="feature-icon" data-editable="true">🏷️</span>
                  <span data-editable="true">Oryginalne metki i opakowanie</span>
                </div>
                <div class="feature-item" data-editable="true">
                  <span class="feature-icon" data-editable="true">🚚</span>
                  <span data-editable="true">Bezpłatna wysyłka kurierem</span>
                </div>
                <div class="feature-item" data-editable="true">
                  <span class="feature-icon" data-editable="true">↩️</span>
                  <span data-editable="true">30 dni na zwrot</span>
                </div>
              </div>
            </div>
            
            <div class="care-instructions" data-editable="true">
              <h3 data-editable="true">Instrukcje pielęgnacji</h3>
              <div class="care-icons" data-editable="true">
                <div class="care-item" data-editable="true">
                  <span class="care-symbol" data-editable="true">🧺</span>
                  <span data-editable="true">Pranie w 30°C</span>
                </div>
                <div class="care-item" data-editable="true">
                  <span class="care-symbol" data-editable="true">🚫</span>
                  <span data-editable="true">Nie wybielać</span>
                </div>
                <div class="care-item" data-editable="true">
                  <span class="care-symbol" data-editable="true">👔</span>
                  <span data-editable="true">Prasowanie w niskiej temp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="luxury-description" data-editable="true">
          <h2 data-editable="true">O produkcie</h2>
          <div class="description-text" data-editable="true">[opis]</div>
          <div class="additional-info" data-editable="true">[opis_dodatkowy1]</div>
        </div>
        
        <div class="luxury-specifications" data-editable="true">
          <h2 data-editable="true">Szczegółowa specyfikacja</h2>
          <div class="specs-table" data-editable="true">[cechy_lista]</div>
        </div>
        
        <div class="luxury-footer" data-editable="true">
          <div class="boutique-info" data-editable="true">
            <h3 data-editable="true">Luxury Fashion Boutique</h3>
            <p data-editable="true">Twój partner w świecie ekskluzywnej mody</p>
            <div class="boutique-badges" data-editable="true">
              <span class="boutique-badge" data-editable="true">Autoryzowany dealer</span>
              <span class="boutique-badge" data-editable="true">100% oryginalne produkty</span>
              <span class="boutique-badge" data-editable="true">Ekspresowa wysyłka</span>
            </div>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .luxury-fashion {
        font-family: 'Playfair Display', 'Georgia', serif;
        max-width: 1000px;
        margin: 0 auto;
        background: #ffffff;
        color: #2c2c2c;
      }
      
      .luxury-header {
        background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%);
        padding: 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .luxury-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
      }
      
      .luxury-brand {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 25px;
        position: relative;
        z-index: 1;
      }
      
      .luxury-logo {
        height: 50px;
        margin-right: 20px;
        filter: sepia(1) hue-rotate(25deg);
      }
      
      .brand-info {
        text-align: left;
      }
      
      .brand-name {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #2c2c2c;
        letter-spacing: 2px;
      }
      
      .collection {
        font-size: 14px;
        color: #666;
        font-style: italic;
      }
      
      .luxury-title {
        font-size: 32px;
        font-weight: 400;
        color: #2c2c2c;
        margin: 25px 0;
        letter-spacing: 1px;
        position: relative;
        z-index: 1;
      }
      
      .luxury-price {
        font-size: 42px;
        font-weight: 300;
        color: #2c2c2c;
        position: relative;
        z-index: 1;
      }
      
      .price-currency {
        font-size: 24px;
        margin-left: 10px;
        vertical-align: top;
      }
      
      .luxury-showcase {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 50px;
        padding: 50px;
        background: #fafafa;
      }
      
      .main-fashion-image {
        position: relative;
        margin-bottom: 25px;
      }
      
      .hero-image {
        width: 100%;
        height: 500px;
        object-fit: cover;
        border-radius: 0;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      }
      
      .luxury-badge {
        position: absolute;
        top: 20px;
        left: 20px;
        background: #d4af37;
        color: white;
        padding: 10px 20px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        border-radius: 0;
      }
      
      .fashion-thumbnails {
        display: flex;
        gap: 15px;
        overflow-x: auto;
      }
      
      .thumbnail-row img {
        width: 100px;
        height: 120px;
        object-fit: cover;
        cursor: pointer;
        border: 3px solid transparent;
        transition: border-color 0.3s;
      }
      
      .thumbnail-row img:hover {
        border-color: #d4af37;
      }
      
      .size-color-section, .luxury-features, .care-instructions {
        background: white;
        padding: 30px;
        margin-bottom: 25px;
        border-left: 4px solid #d4af37;
      }
      
      .size-color-section h3, .luxury-features h3, .care-instructions h3 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #2c2c2c;
        font-weight: 400;
      }
      
      .option-group {
        margin-bottom: 20px;
      }
      
      .option-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #555;
      }
      
      .size-option, .color-option {
        display: inline-block;
        padding: 8px 16px;
        background: #f8f8f8;
        border: 1px solid #ddd;
        margin-right: 10px;
        font-weight: 500;
      }
      
      .material-info {
        color: #666;
        font-style: italic;
      }
      
      .features-list, .care-icons {
        space-y: 15px;
      }
      
      .feature-item, .care-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .feature-icon, .care-symbol {
        margin-right: 15px;
        font-size: 18px;
      }
      
      .luxury-description, .luxury-specifications {
        padding: 50px;
        border-top: 1px solid #e0e0e0;
      }
      
      .luxury-description h2, .luxury-specifications h2 {
        font-size: 28px;
        font-weight: 400;
        color: #2c2c2c;
        margin-bottom: 30px;
        text-align: center;
        position: relative;
      }
      
      .luxury-description h2::after, .luxury-specifications h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 2px;
        background: #d4af37;
      }
      
      .description-text, .additional-info {
        line-height: 1.8;
        color: #555;
        margin-bottom: 25px;
        text-align: justify;
      }
      
      .specs-table {
        background: #f8f8f8;
        padding: 30px;
        border-radius: 0;
        line-height: 1.8;
      }
      
      .luxury-footer {
        background: #2c2c2c;
        color: white;
        padding: 40px;
        text-align: center;
      }
      
      .boutique-info h3 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #d4af37;
      }
      
      .boutique-info p {
        margin-bottom: 25px;
        font-style: italic;
      }
      
      .boutique-badges {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }
      
      .boutique-badge {
        background: rgba(212, 175, 55, 0.2);
        color: #d4af37;
        padding: 10px 20px;
        border: 1px solid #d4af37;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1px;
      }
    `,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'template-6',
    name: 'Premium Home & Lifestyle',
    description: 'Ekskluzywny szablon dla produktów domowych i lifestyle',
    category: 'dom',
    thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]', '[cechy_lista]', '[cecha|wymiary]', '[cecha|materiał]', '[cecha|kolor]'],
    htmlContent: `
      <div class="ebay-template premium-home">
        <div class="premium-header" data-editable="true">
          <div class="home-brand-section" data-editable="true">
            <img src="[producent_logo]" alt="[producent]" class="home-brand-logo" data-editable="true" />
            <div class="brand-details" data-editable="true">
              <span class="brand-title" data-editable="true">[producent]</span>
              <span class="brand-tagline" data-editable="true">Premium Home Collection</span>
            </div>
          </div>
          <h1 class="premium-title" data-editable="true">[nazwa_aukcji]</h1>
          <div class="premium-price" data-editable="true">
            <div class="price-container" data-editable="true">
              <span class="price-value" data-editable="true">[cena]</span>
              <span class="price-unit" data-editable="true">PLN</span>
            </div>
            <div class="price-note" data-editable="true">Cena zawiera VAT</div>
          </div>
        </div>
        
        <div class="premium-showcase" data-editable="true">
          <div class="premium-gallery" data-editable="true">
            <div class="main-home-image" data-editable="true">
              <img src="[obrazek]" alt="[nazwa]" class="lifestyle-image" data-editable="true" />
              <div class="premium-overlay" data-editable="true">
                <div class="quality-badge" data-editable="true">PREMIUM QUALITY</div>
              </div>
            </div>
            <div class="lifestyle-thumbnails" data-editable="true">
              <div class="thumbnail-grid" data-editable="true">[dodatkowe_obrazki]</div>
            </div>
          </div>
          
          <div class="premium-info" data-editable="true">
            <div class="product-highlights" data-editable="true">
              <h3 data-editable="true">Najważniejsze cechy</h3>
              <div class="highlights-grid" data-editable="true">
                <div class="highlight-item" data-editable="true">
                  <div class="highlight-icon" data-editable="true">📐</div>
                  <div class="highlight-content" data-editable="true">
                    <span class="highlight-label" data-editable="true">Wymiary:</span>
                    <span class="highlight-value" data-editable="true">[cecha|wymiary]</span>
                  </div>
                </div>
                <div class="highlight-item" data-editable="true">
                  <div class="highlight-icon" data-editable="true">🎨</div>
                  <div class="highlight-content" data-editable="true">
                    <span class="highlight-label" data-editable="true">Kolor:</span>
                    <span class="highlight-value" data-editable="true">[cecha|kolor]</span>
                  </div>
                </div>
                <div class="highlight-item" data-editable="true">
                  <div class="highlight-icon" data-editable="true">🏗️</div>
                  <div class="highlight-content" data-editable="true">
                    <span class="highlight-label" data-editable="true">Materiał:</span>
                    <span class="highlight-value" data-editable="true">[cecha|materiał]</span>
                  </div>
                </div>
                <div class="highlight-item" data-editable="true">
                  <div class="highlight-icon" data-editable="true">⚖️</div>
                  <div class="highlight-content" data-editable="true">
                    <span class="highlight-label" data-editable="true">Waga:</span>
                    <span class="highlight-value" data-editable="true">[waga] kg</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lifestyle-benefits" data-editable="true">
              <h3 data-editable="true">Dlaczego warto wybrać ten produkt?</h3>
              <div class="benefits-list" data-editable="true">
                <div class="benefit-item" data-editable="true">
                  <span class="benefit-check" data-editable="true">✓</span>
                  <span data-editable="true">Najwyższa jakość materiałów</span>
                </div>
                <div class="benefit-item" data-editable="true">
                  <span class="benefit-check" data-editable="true">✓</span>
                  <span data-editable="true">Nowoczesny design</span>
                </div>
                <div class="benefit-item" data-editable="true">
                  <span class="benefit-check" data-editable="true">✓</span>
                  <span data-editable="true">Łatwy montaż i konserwacja</span>
                </div>
                <div class="benefit-item" data-editable="true">
                  <span class="benefit-check" data-editable="true">✓</span>
                  <span data-editable="true">Gwarancja producenta</span>
                </div>
                <div class="benefit-item" data-editable="true">
                  <span class="benefit-check" data-editable="true">✓</span>
                  <span data-editable="true">Ekologiczne materiały</span>
                </div>
              </div>
            </div>
            
            <div class="delivery-info" data-editable="true">
              <h3 data-editable="true">Dostawa i montaż</h3>
              <div class="delivery-options" data-editable="true">
                <div class="delivery-option" data-editable="true">
                  <div class="delivery-icon" data-editable="true">🚚</div>
                  <div class="delivery-details" data-editable="true">
                    <span class="delivery-name" data-editable="true">Dostawa kurierem</span>
                    <span class="delivery-price" data-editable="true">[przesylka1] PLN</span>
                  </div>
                </div>
                <div class="delivery-option" data-editable="true">
                  <div class="delivery-icon" data-editable="true">🔧</div>
                  <div class="delivery-details" data-editable="true">
                    <span class="delivery-name" data-editable="true">Montaż na miejscu</span>
                    <span class="delivery-price" data-editable="true">99 PLN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="premium-description" data-editable="true">
          <h2 data-editable="true">Szczegółowy opis produktu</h2>
          <div class="description-content" data-editable="true">[opis]</div>
          <div class="additional-description" data-editable="true">[opis_dodatkowy1]</div>
          <div class="extra-description" data-editable="true">[opis_dodatkowy2]</div>
        </div>
        
        <div class="premium-specifications" data-editable="true">
          <h2 data-editable="true">Kompletna specyfikacja techniczna</h2>
          <div class="specs-content" data-editable="true">[cechy_lista]</div>
        </div>
        
        <div class="premium-footer" data-editable="true">
          <div class="home-store-info" data-editable="true">
            <h3 data-editable="true">Premium Home & Lifestyle Store</h3>
            <p data-editable="true">Tworzymy wyjątkowe przestrzenie życiowe</p>
            <div class="store-guarantees" data-editable="true">
              <div class="guarantee-item" data-editable="true">
                <span class="guarantee-icon" data-editable="true">🏆</span>
                <span data-editable="true">Najwyższa jakość</span>
              </div>
              <div class="guarantee-item" data-editable="true">
                <span class="guarantee-icon" data-editable="true">🚀</span>
                <span data-editable="true">Szybka dostawa</span>
              </div>
              <div class="guarantee-item" data-editable="true">
                <span class="guarantee-icon" data-editable="true">💎</span>
                <span data-editable="true">Ekskluzywne produkty</span>
              </div>
              <div class="guarantee-item" data-editable="true">
                <span class="guarantee-icon" data-editable="true">🛡️</span>
                <span data-editable="true">Pełna gwarancja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .premium-home {
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        background: #ffffff;
        color: #333;
        line-height: 1.6;
      }
      
      .premium-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 50px 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .premium-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 30px 30px;
        animation: float 20s infinite linear;
      }
      
      @keyframes float {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      .home-brand-section {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        position: relative;
        z-index: 1;
      }
      
      .home-brand-logo {
        height: 60px;
        margin-right: 25px;
        background: rgba(255,255,255,0.9);
        padding: 10px;
        border-radius: 8px;
      }
      
      .brand-details {
        text-align: left;
      }
      
      .brand-title {
        display: block;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      
      .brand-tagline {
        font-size: 14px;
        opacity: 0.9;
        font-style: italic;
      }
      
      .premium-title {
        font-size: 36px;
        font-weight: 300;
        margin: 30px 0;
        letter-spacing: 0.5px;
        position: relative;
        z-index: 1;
      }
      
      .premium-price {
        position: relative;
        z-index: 1;
      }
      
      .price-container {
        font-size: 48px;
        font-weight: 200;
        margin-bottom: 10px;
      }
      
      .price-unit {
        font-size: 28px;
        margin-left: 15px;
        vertical-align: top;
        opacity: 0.9;
      }
      
      .price-note {
        font-size: 14px;
        opacity: 0.8;
      }
      
      .premium-showcase {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 60px;
        padding: 60px 40px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }
      
      .main-home-image {
        position: relative;
        margin-bottom: 30px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }
      
      .lifestyle-image {
        width: 100%;
        height: 450px;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .lifestyle-image:hover {
        transform: scale(1.05);
      }
      
      .premium-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .main-home-image:hover .premium-overlay {
        opacity: 1;
      }
      
      .quality-badge {
        background: rgba(255,255,255,0.9);
        color: #333;
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 14px;
      }
      
      .lifestyle-thumbnails {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
      }
      
      .thumbnail-grid img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all 0.3s ease;
      }
      
      .thumbnail-grid img:hover {
        border-color: #667eea;
        transform: translateY(-5px);
      }
      
      .product-highlights, .lifestyle-benefits, .delivery-info {
        background: white;
        padding: 35px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      }
      
      .product-highlights h3, .lifestyle-benefits h3, .delivery-info h3 {
        font-size: 22px;
        margin-bottom: 25px;
        color: #333;
        font-weight: 600;
        border-bottom: 2px solid #667eea;
        padding-bottom: 15px;
      }
      
      .highlights-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .highlight-item {
        display: flex;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .highlight-icon {
        font-size: 24px;
        margin-right: 15px;
      }
      
      .highlight-content {
        display: flex;
        flex-direction: column;
      }
      
      .highlight-label {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .highlight-value {
        font-weight: 600;
        color: #333;
      }
      
      .benefits-list {
        space-y: 15px;
      }
      
      .benefit-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 12px 0;
      }
      
      .benefit-check {
        color: #27ae60;
        font-weight: bold;
        margin-right: 15px;
        font-size: 18px;
      }
      
      .delivery-options {
        space-y: 20px;
      }
      
      .delivery-option {
        display: flex;
        align-items: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 15px;
      }
      
      .delivery-icon {
        font-size: 28px;
        margin-right: 20px;
      }
      
      .delivery-details {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      
      .delivery-name {
        font-weight: 600;
        color: #333;
      }
      
      .delivery-price {
        color: #667eea;
        font-weight: 700;
        font-size: 18px;
      }
      
      .premium-description, .premium-specifications {
        padding: 60px 40px;
        border-top: 1px solid #e0e0e0;
      }
      
      .premium-description h2, .premium-specifications h2 {
        font-size: 32px;
        font-weight: 300;
        color: #333;
        margin-bottom: 35px;
        text-align: center;
        position: relative;
      }
      
      .premium-description h2::after, .premium-specifications h2::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 2px;
      }
      
      .description-content, .additional-description, .extra-description {
        line-height: 1.8;
        color: #555;
        margin-bottom: 30px;
        text-align: justify;
        font-size: 16px;
      }
      
      .specs-content {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        padding: 40px;
        border-radius: 12px;
        line-height: 1.8;
        border-left: 5px solid #667eea;
      }
      
      .premium-footer {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 50px 40px;
        text-align: center;
      }
      
      .home-store-info h3 {
        font-size: 28px;
        margin-bottom: 15px;
        color: #ecf0f1;
        font-weight: 300;
      }
      
      .home-store-info p {
        margin-bottom: 35px;
        font-size: 16px;
        opacity: 0.9;
        font-style: italic;
      }
      
      .store-guarantees {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 25px;
      }
      
      .guarantee-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        transition: transform 0.3s ease;
      }
      
      .guarantee-item:hover {
        transform: translateY(-5px);
      }
      
      .guarantee-icon {
        font-size: 32px;
        margin-bottom: 15px;
      }
      
      .guarantee-item span:last-child {
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    `,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: 'template-7',
    name: 'Podstawowy Starter',
    description: 'Prosty szablon do szybkiej edycji - idealny punkt startowy',
    category: 'inne',
    thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]'],
    htmlContent: `
      <!-- Główny kontener szablonu -->
      <div class="ebay-template starter-template">
        <!-- Nagłówek - pojedynczy blok -->
        <header class="ebay-header starter-header" data-block="header">
          <h1 class="ebay-title">[nazwa]</h1>
          <div class="ebay-price">[cena] PLN</div>
        </header>
        
        <!-- Główna zawartość -->
        <main class="starter-content">
          <!-- Sekcja zdjęcia - pojedynczy blok -->
          <section class="ebay-gallery image-wrapper" data-block="gallery">
            <img src="[obrazek]" alt="[nazwa]" />
          </section>
          
          <!-- Sekcja opisu - pojedynczy blok -->
          <section class="ebay-description description" data-block="description">
            <h2>Opis</h2>
            <p>[opis]</p>
          </section>
        </main>
        
        <!-- Stopka - pojedynczy blok -->
        <footer class="ebay-footer starter-footer" data-block="footer">
          <p>Skontaktuj się z nami w razie pytań!</p>
        </footer>
      </div>
    `,
    cssContent: `
      .starter-template {
        font-family: Arial, sans-serif;
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
      }
      
      .starter-header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #007bff;
      }
      
      .starter-header h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .price {
        font-size: 20px;
        color: #007bff;
        font-weight: bold;
      }
      
      .starter-content {
        margin-bottom: 20px;
      }
      
      .image-wrapper {
        text-align: center;
        margin-bottom: 20px;
      }
      
      .image-wrapper img {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
      }
      
      .description h2 {
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
      }
      
      .description p {
        line-height: 1.6;
        color: #666;
      }
      
      .starter-footer {
        text-align: center;
        padding-top: 15px;
        border-top: 1px solid #e0e0e0;
        color: #888;
      }
    `,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: 'template-8',
    name: 'Uniwersalny Baselinker',
    description: 'Gotowy szablon z wszystkimi popularnymi tagami Baselinker',
    category: 'inne',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    baselinkerTags: ['[nazwa]', '[cena]', '[opis]', '[obrazek]', '[producent]', '[kategoria]', '[stan]', '[gwarancja]'],
    htmlContent: `
      <!-- Główny kontener szablonu -->
      <div class="ebay-template universal-template">
        <!-- Nagłówek - pojedynczy blok -->
        <header class="ebay-header universal-header" data-block="header">
          <h1 class="ebay-title">[nazwa]</h1>
          <div class="meta-info">
            <span class="category">Kategoria: [kategoria]</span>
            <span class="producer">Producent: [producent]</span>
          </div>
        </header>
        
        <!-- Główna zawartość -->
        <main class="universal-main">
          <!-- Sekcja zdjęcia - pojedynczy blok -->
          <section class="ebay-gallery product-image" data-block="gallery">
            <img src="[obrazek]" alt="[nazwa]" />
          </section>
          
          <!-- Sekcja szczegółów produktu -->
          <div class="product-details">
            <!-- Sekcja ceny - pojedynczy blok -->
            <section class="ebay-price price-section" data-block="price">
              <div class="price">[cena] PLN</div>
              <div class="condition">Stan: [stan]</div>
            </section>
            
            <!-- Sekcja opisu - pojedynczy blok -->
            <section class="ebay-description description-section" data-block="description">
              <h2>Opis produktu</h2>
              <div>[opis]</div>
            </section>
            
            <!-- Sekcja gwarancji - pojedynczy blok -->
            <section class="ebay-warranty warranty-section" data-block="warranty">
              <h3>Gwarancja</h3>
              <p>[gwarancja]</p>
            </section>
          </div>
        </main>
        
        <!-- Stopka - pojedynczy blok -->
        <footer class="ebay-footer universal-footer" data-block="footer">
          <div class="contact-info">
            <h3>Informacje o sprzedawcy</h3>
            <p>Profesjonalna obsługa • Szybka wysyłka • Gwarancja satysfakcji</p>
          </div>
        </footer>
      </div>
    `,
    cssContent: `
      .universal-template {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        background: #f8f9fa;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      
      .universal-header {
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 30px;
        text-align: center;
      }
      
      .universal-header h1 {
        font-size: 28px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .meta-info {
        display: flex;
        justify-content: center;
        gap: 20px;
        font-size: 14px;
      }
      
      .meta-info span {
        background: rgba(255,255,255,0.2);
        padding: 5px 15px;
        border-radius: 20px;
      }
      
      .universal-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        background: white;
      }
      
      .product-image {
        padding: 20px;
      }
      
      .product-image img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .product-details {
        padding: 20px;
      }
      
      .price-section {
        margin-bottom: 20px;
        padding: 15px;
        background: #e3f2fd;
        border-radius: 8px;
      }
      
      .price {
        font-size: 24px;
        color: #1976d2;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .condition {
        color: #666;
        font-size: 14px;
      }
      
      .description-section {
        margin-bottom: 20px;
      }
      
      .description-section h2 {
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
        border-bottom: 2px solid #28a745;
        padding-bottom: 5px;
      }
      
      .warranty-section {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #ffc107;
      }
      
      .warranty-section h3 {
        color: #856404;
        margin-bottom: 10px;
      }
      
      .universal-footer {
        background: #343a40;
        color: white;
        padding: 20px;
        text-align: center;
      }
      
      .contact-info h3 {
        margin-bottom: 10px;
        color: #28a745;
      }
      
      @media (max-width: 768px) {
        .universal-main {
          grid-template-columns: 1fr;
        }
        
        .meta-info {
          flex-direction: column;
          gap: 10px;
        }
      }
    `,
    createdAt: '2024-08-02T16:00:00Z',
    updatedAt: '2024-08-02T16:00:00Z'
  }
];

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      currentTemplate: null,
      activeTemplate: null,
      
      initializeTemplates: () => {
        const { templates } = get();
        
        // Sprawdź czy są nowe defaultTemplates, które nie istnieją w store
        const existingIds = templates.map(t => t.id);
        const newTemplates = defaultTemplates.filter(dt => !existingIds.includes(dt.id));
        
        if (templates.length === 0) {
          // Jeśli store jest pusty, załaduj wszystkie defaultTemplates
          set({ templates: defaultTemplates });
        } else if (newTemplates.length > 0) {
          // Jeśli są nowe szablony, dodaj je do istniejących
          set({ templates: [...templates, ...newTemplates] });
        }
        
        // Opcjonalnie: aktualizuj istniejące szablony jeśli się zmieniły
        const updatedTemplates = templates.map(existingTemplate => {
          const defaultTemplate = defaultTemplates.find(dt => dt.id === existingTemplate.id);
          if (defaultTemplate && defaultTemplate.updatedAt > existingTemplate.updatedAt) {
            return defaultTemplate;
          }
          return existingTemplate;
        });
        
        // Dodaj nowe szablony do zaktualizowanych
        const finalTemplates = [...updatedTemplates, ...newTemplates];
        
        if (finalTemplates.length !== templates.length || newTemplates.length > 0) {
          set({ templates: finalTemplates });
        }
      },
      
      resetTemplates: () => {
        // Wymuś pełne przeładowanie wszystkich defaultTemplates
        set({ templates: defaultTemplates });
      },
      
      createTemplate: (templateData) => {
        const newTemplate: Template = {
          ...templateData,
          id: `template-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          templates: [...state.templates, newTemplate]
        }));
      },
      
      updateTemplate: (id, updates) => {
        set(state => ({
          templates: state.templates.map(template =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          ),
          currentTemplate: state.currentTemplate?.id === id
            ? { ...state.currentTemplate, ...updates, updatedAt: new Date().toISOString() }
            : state.currentTemplate,
          activeTemplate: state.activeTemplate?.id === id
            ? { ...state.activeTemplate, ...updates, updatedAt: new Date().toISOString() }
            : state.activeTemplate
        }));
      },
      
      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
          currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
          activeTemplate: state.activeTemplate?.id === id ? null : state.activeTemplate
        }));
      },
      
      duplicateTemplate: (id) => {
        const { templates } = get();
        const templateToDuplicate = templates.find(t => t.id === id);
        
        if (templateToDuplicate) {
          const duplicatedTemplate: Template = {
            ...templateToDuplicate,
            id: `template-${Date.now()}`,
            name: `${templateToDuplicate.name} (kopia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            templates: [...state.templates, duplicatedTemplate]
          }));
        }
      },
      
      setCurrentTemplate: (template) => {
        set({ currentTemplate: template });
      },
      
      setActiveTemplate: (template) => {
        set({ activeTemplate: template });
      },
      
      getTemplateById: (id) => {
        const { templates } = get();
        return templates.find(template => template.id === id);
      },
    }),
    {
      name: 'template-storage',
    }
  )
);