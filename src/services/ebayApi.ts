// eBay API Service - poprawiona konfiguracja OAuth 2.0
export interface EbayConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

export interface EbayTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
}

export interface EbayListing {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  condition: string;
  categoryId: string;
  listingType: string;
  quantity: number;
  format: string;
  marketplaceId: string;
  seller: {
    username: string;
    feedbackPercentage: number;
    feedbackScore: number;
  };
  itemLocation: {
    country: string;
    postalCode: string;
  };
  shippingOptions: Array<{
    shippingServiceCode: string;
    shippingCost: {
      value: string;
      currency: string;
    };
  }>;
  images: string[];
  description: string;
  itemSpecifics: Array<{
    name: string;
    value: string[];
  }>;
  startTime: string;
  endTime: string;
  viewItemURL: string;
  galleryURL: string;
  paymentMethods: string[];
  returnPolicy: {
    returnsAccepted: boolean;
    refund: string;
    returnsWithin: string;
  };
  conditionDescription?: string;
  watchCount?: number;
  hitCount?: number;
  currentBidCount?: number;
  bidCount?: number;
  sellingState: string;
  timeLeft: string;
}

export interface EbaySearchParams {
  keywords?: string;
  categoryId?: string;
  sortOrder?: 'BestMatch' | 'CurrentPriceHighest' | 'PricePlusShippingHighest' | 'PricePlusShippingLowest';
  limit?: number;
  offset?: number;
  condition?: 'New' | 'Used' | 'Refurbished';
  listingType?: 'All' | 'Auction' | 'AuctionWithBIN' | 'Classified' | 'FixedPrice' | 'StoreInventory';
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}

export interface EbayUpdateRequest {
  itemId: string;
  description?: string;
  title?: string;
  price?: {
    value: string;
    currency: string;
  };
  quantity?: number;
  images?: string[];
  itemSpecifics?: Array<{
    name: string;
    value: string[];
  }>;
}

export interface EbayBulkUpdateRequest {
  itemIds: string[];
  updates: {
    description?: string;
    templateHtml?: string;
    priceAdjustment?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
  };
}

class EbayApiService {
  private config: EbayConfig;
  private tokens: EbayTokens | null = null;
  
  // eBay API endpoints - poprawione URLe
  private readonly endpoints = {
    sandbox: {
      oauth: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
      authUrl: 'https://auth.sandbox.ebay.com/oauth2/authorize',
      trading: 'https://api.sandbox.ebay.com/ws/api/eBayAPI.dll',
      browse: 'https://api.sandbox.ebay.com/buy/browse/v1',
      inventory: 'https://api.sandbox.ebay.com/sell/inventory/v1',
      account: 'https://api.sandbox.ebay.com/sell/account/v1',
      fulfillment: 'https://api.sandbox.ebay.com/sell/fulfillment/v1'
    },
    production: {
      oauth: 'https://api.ebay.com/identity/v1/oauth2/token',
      authUrl: 'https://auth.ebay.com/oauth2/authorize',
      trading: 'https://api.ebay.com/ws/api/eBayAPI.dll',
      browse: 'https://api.ebay.com/buy/browse/v1',
      inventory: 'https://api.ebay.com/sell/inventory/v1',
      account: 'https://api.ebay.com/sell/account/v1',
      fulfillment: 'https://api.ebay.com/sell/fulfillment/v1'
    }
  };

  constructor(config: EbayConfig) {
    this.config = config;
    this.loadTokensFromStorage();
  }

  // OAuth 2.0 Authorization Flow - poprawiona implementacja
  getAuthorizationUrl(scopes: string[] = [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.marketing',
    'https://api.ebay.com/oauth/api_scope/sell.account.readonly'
  ]): string {
    const state = this.generateState();
    
    // Zapisz state do localStorage dla weryfikacji
    localStorage.setItem('ebay_oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      state: state
    });

    const authUrl = `${this.endpoints[this.config.environment].authUrl}?${params.toString()}`;
    console.log('eBay Authorization URL:', authUrl);
    console.log('Client ID:', this.config.clientId);
    console.log('Redirect URI:', this.config.redirectUri);
    
    return authUrl;
  }

  // Exchange authorization code for access token - poprawiona implementacja
  async exchangeCodeForToken(code: string, state: string): Promise<EbayTokens> {
    try {
      // Weryfikuj state
      const savedState = localStorage.getItem('ebay_oauth_state');
      if (savedState !== state) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }
      
      // Usuń state z localStorage
      localStorage.removeItem('ebay_oauth_state');

      console.log('Exchanging code for token...');
      console.log('Code:', code);
      console.log('State:', state);
      console.log('Client ID:', this.config.clientId);
      console.log('Redirect URI:', this.config.redirectUri);

      const response = await fetch(this.endpoints[this.config.environment].oauth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.redirectUri
        })
      });

      console.log('Token exchange response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: 'unknown_error', error_description: errorText };
        }
        
        throw new Error(`eBay OAuth error: ${errorData.error_description || errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Token exchange successful');
      
      this.tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        tokenType: data.token_type
      };

      this.saveTokensToStorage();
      return this.tokens;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<EbayTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(this.endpoints[this.config.environment].oauth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.tokens.refreshToken
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`eBay token refresh error: ${error.error_description || error.error}`);
      }

      const data = await response.json();
      
      this.tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || this.tokens.refreshToken,
        expiresAt: Date.now() + (data.expires_in * 1000),
        tokenType: data.token_type
      };

      this.saveTokensToStorage();
      return this.tokens;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Get valid access token (refresh if needed)
  private async getValidAccessToken(): Promise<string> {
    if (!this.tokens) {
      throw new Error('No tokens available. Please authorize first.');
    }

    // Check if token is expired (with 5 minute buffer)
    if (Date.now() >= (this.tokens.expiresAt - 300000)) {
      await this.refreshAccessToken();
    }

    return this.tokens.accessToken;
  }

  // Get user's active listings - rzeczywista implementacja
  async getMyActiveListings(limit: number = 100, offset: number = 0): Promise<{
    listings: EbayListing[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const accessToken = await this.getValidAccessToken();
      
      // Używamy eBay Inventory API do pobrania aktywnych aukcji
      const url = `${this.endpoints[this.config.environment].inventory}/offer?limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`eBay API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Pobieramy szczegóły każdej aukcji
      const listings: EbayListing[] = [];
      
      for (const offer of data.offers || []) {
        // Pobieramy szczegóły aukcji z eBay Browse API
        const listingDetails = await this.getListingDetails(offer.listingId);
        listings.push(listingDetails);
      }

      return {
        listings,
        total: data.total || listings.length,
        hasMore: (offset + listings.length) < (data.total || 0)
      };
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  }
  
  // Pobierz szczegóły aukcji
  async getListingDetails(itemId: string): Promise<EbayListing> {
    try {
      const accessToken = await this.getValidAccessToken();
      
      const url = `${this.endpoints[this.config.environment].browse}/item/${itemId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`eBay API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
      }

      const item = await response.json();
      
      // Mapowanie odpowiedzi API do naszego modelu EbayListing
      return {
        itemId: item.itemId,
        title: item.title,
        price: {
          value: item.price?.value?.toString() || '0',
          currency: item.price?.currency || 'USD'
        },
        condition: item.condition,
        categoryId: item.categoryId,
        listingType: item.listingType || 'FixedPrice',
        quantity: item.quantity || 1,
        format: item.format || 'FixedPrice',
        marketplaceId: item.marketplaceId,
        seller: {
          username: item.seller?.username || '',
          feedbackPercentage: item.seller?.feedbackPercentage || 0,
          feedbackScore: item.seller?.feedbackScore || 0
        },
        itemLocation: {
          country: item.itemLocation?.country || '',
          postalCode: item.itemLocation?.postalCode || ''
        },
        shippingOptions: (item.shippingOptions || []).map((option: any) => ({
          shippingServiceCode: option.shippingServiceCode,
          shippingCost: {
            value: option.shippingCost?.value?.toString() || '0',
            currency: option.shippingCost?.currency || 'USD'
          }
        })),
        images: item.images?.map((img: any) => img.imageUrl) || [],
        description: item.description || '',
        itemSpecifics: (item.itemSpecifics || []).map((spec: any) => ({
          name: spec.name,
          value: Array.isArray(spec.value) ? spec.value : [spec.value]
        })),
        startTime: item.startTime || new Date().toISOString(),
        endTime: item.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        viewItemURL: item.itemWebUrl || '',
        galleryURL: item.images?.[0]?.imageUrl || '',
        paymentMethods: item.paymentMethods || [],
        returnPolicy: {
          returnsAccepted: item.returnTerms?.returnsAccepted || false,
          refund: item.returnTerms?.refundMethod || '',
          returnsWithin: item.returnTerms?.returnPeriod || ''
        },
        sellingState: item.sellingState || 'Active',
        timeLeft: item.timeLeft || ''
      };
    } catch (error) {
      console.error(`Error fetching listing details for ${itemId}:`, error);
      throw error;
    }
  }

  // Update single listing - rzeczywista implementacja
  async updateListing(updateRequest: EbayUpdateRequest): Promise<boolean> {
    try {
      console.log('Updating listing:', updateRequest.itemId);
      
      const accessToken = await this.getValidAccessToken();
      
      // Przygotowujemy dane do aktualizacji
      const updateData: any = {};
      
      // Aktualizacja opisu
      if (updateRequest.description !== undefined) {
        updateData.product = {
          ...updateData.product,
          description: updateRequest.description
        };
      }
      
      // Aktualizacja tytułu
      if (updateRequest.title !== undefined) {
        updateData.product = {
          ...updateData.product,
          title: updateRequest.title
        };
      }
      
      // Aktualizacja ceny
      if (updateRequest.price !== undefined) {
        updateData.pricingSummary = {
          price: {
            value: updateRequest.price.value,
            currency: updateRequest.price.currency
          }
        };
      }
      
      // Aktualizacja ilości
      if (updateRequest.quantity !== undefined) {
        updateData.availableQuantity = updateRequest.quantity;
      }
      
      // Aktualizacja zdjęć
      if (updateRequest.images !== undefined && updateRequest.images.length > 0) {
        updateData.product = {
          ...updateData.product,
          imageUrls: updateRequest.images
        };
      }
      
      // Aktualizacja specyfikacji przedmiotu
      if (updateRequest.itemSpecifics !== undefined) {
        updateData.product = {
          ...updateData.product,
          aspects: updateRequest.itemSpecifics.reduce((acc: any, spec) => {
            acc[spec.name] = spec.value;
            return acc;
          }, {})
        };
      }
      
      // Wysyłamy żądanie aktualizacji do eBay API
      const url = `${this.endpoints[this.config.environment].inventory}/offer/${updateRequest.itemId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`eBay API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating listing ${updateRequest.itemId}:`, error);
      throw error;
    }
  }

  // Bulk update multiple listings - rzeczywista implementacja
  async bulkUpdateListings(bulkUpdateRequest: EbayBulkUpdateRequest): Promise<{
    successful: string[];
    failed: Array<{ itemId: string; error: string }>;
  }> {
    console.log('Bulk updating listings:', bulkUpdateRequest.itemIds.length, 'items');
    
    const results = {
      successful: [] as string[],
      failed: [] as Array<{ itemId: string; error: string }>
    };
    
    // Przetwarzamy każdą aukcję pojedynczo
    for (const itemId of bulkUpdateRequest.itemIds) {
      try {
        // Przygotowujemy dane do aktualizacji dla pojedynczej aukcji
        const updateRequest: EbayUpdateRequest = {
          itemId: itemId
        };
        
        // Dodajemy opis jeśli jest dostępny
        if (bulkUpdateRequest.updates.description !== undefined) {
          updateRequest.description = bulkUpdateRequest.updates.description;
        }
        
        // Dodajemy szablon HTML jeśli jest dostępny
        if (bulkUpdateRequest.updates.templateHtml !== undefined) {
          updateRequest.description = bulkUpdateRequest.updates.templateHtml;
        }
        
        // Aktualizujemy cenę jeśli jest dostępna
        if (bulkUpdateRequest.updates.priceAdjustment !== undefined) {
          // Najpierw pobieramy aktualną cenę
          const currentItem = await this.getListingDetails(itemId);
          const currentPrice = parseFloat(currentItem.price.value);
          
          // Obliczamy nową cenę
          let newPrice = currentPrice;
          if (bulkUpdateRequest.updates.priceAdjustment.type === 'percentage') {
            newPrice = currentPrice * (1 + bulkUpdateRequest.updates.priceAdjustment.value / 100);
          } else {
            newPrice = currentPrice + bulkUpdateRequest.updates.priceAdjustment.value;
          }
          
          // Zaokrąglamy do dwóch miejsc po przecinku
          newPrice = Math.round(newPrice * 100) / 100;
          
          updateRequest.price = {
            value: newPrice.toString(),
            currency: currentItem.price.currency
          };
        }
        
        // Aktualizujemy aukcję
        await this.updateListing(updateRequest);
        results.successful.push(itemId);
      } catch (error) {
        results.failed.push({ 
          itemId, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  // Apply template to listing
  async applyTemplateToListing(itemId: string, templateHtml: string, templateCss: string): Promise<boolean> {
    // Combine HTML and CSS into a complete description
    const fullDescription = `
      <style>
        ${templateCss}
      </style>
      ${templateHtml}
    `;

    return this.updateListing({
      itemId,
      description: fullDescription
    });
  }

  // Apply template to multiple listings
  async applyTemplateToMultipleListings(
    itemIds: string[], 
    templateHtml: string, 
    templateCss: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    successful: string[];
    failed: Array<{ itemId: string; error: string }>;
  }> {
    const fullDescription = `
      <style>
        ${templateCss}
      </style>
      ${templateHtml}
    `;

    const results = await this.bulkUpdateListings({
      itemIds,
      updates: {
        templateHtml: fullDescription
      }
    });

    // Report progress if callback provided
    if (onProgress) {
      onProgress(results.successful.length + results.failed.length, itemIds.length);
    }

    return results;
  }

  // Disconnect (clear tokens)
  disconnect(): void {
    this.tokens = null;
    localStorage.removeItem('ebay_tokens');
    localStorage.removeItem('ebay_oauth_state');
  }

  private loadTokensFromStorage() {
    const tokensJson = localStorage.getItem('ebay_tokens');
    if (tokensJson) {
      try {
        this.tokens = JSON.parse(tokensJson);
        
        // Sprawdź czy tokeny nie wygasły
        if (this.tokens && this.tokens.expiresAt <= Date.now()) {
          console.log('Stored tokens expired, will need to refresh');
        }
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
        localStorage.removeItem('ebay_tokens');
      }
    }
  }
  
  private saveTokensToStorage() {
    if (this.tokens) {
      localStorage.setItem('ebay_tokens', JSON.stringify(this.tokens));
    }
  }
  
  // Sprawdź czy użytkownik jest zalogowany
  isAuthenticated(): boolean {
    return !!this.tokens && this.tokens.expiresAt > Date.now();
  }

  private generateState(): string {
    // Generuj bezpieczny losowy string jako state dla ochrony przed CSRF
    const array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    return Array.from(array, x => x.toString(16).padStart(8, '0')).join('');
  }
}

// Export singleton instance z poprawną konfiguracją
export const ebayApi = new EbayApiService({
  clientId: import.meta.env.VITE_EBAY_CLIENT_ID || 'your-client-id',
  clientSecret: import.meta.env.VITE_EBAY_CLIENT_SECRET || 'your-client-secret',
  redirectUri: import.meta.env.VITE_EBAY_REDIRECT_URI || `${window.location.origin}/ebay/callback`,
  environment: (import.meta.env.VITE_EBAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});

export default EbayApiService;