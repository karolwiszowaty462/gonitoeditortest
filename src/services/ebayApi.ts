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

  // Get user's active listings - symulacja dla demonstracji
  async getMyActiveListings(limit: number = 100, offset: number = 0): Promise<{
    listings: EbayListing[];
    total: number;
    hasMore: boolean;
  }> {
    // Dla demonstracji zwracamy przykładowe dane
    // W rzeczywistej implementacji tutaj byłoby wywołanie do eBay API
    
    const mockListings: EbayListing[] = [
      {
        itemId: '123456789',
        title: 'iPhone 14 Pro Max 256GB Space Black - Nowy',
        price: { value: '4299.00', currency: 'PLN' },
        condition: 'New',
        categoryId: '9355',
        listingType: 'FixedPrice',
        quantity: 1,
        format: 'FixedPrice',
        marketplaceId: 'EBAY_PL',
        seller: {
          username: 'testuser',
          feedbackPercentage: 99.5,
          feedbackScore: 1250
        },
        itemLocation: {
          country: 'PL',
          postalCode: '00-001'
        },
        shippingOptions: [],
        images: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'],
        description: 'Nowy iPhone 14 Pro Max w kolorze Space Black',
        itemSpecifics: [],
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        viewItemURL: 'https://www.ebay.pl/itm/123456789',
        galleryURL: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
        paymentMethods: ['PayPal'],
        returnPolicy: {
          returnsAccepted: true,
          refund: 'MoneyBack',
          returnsWithin: 'Days_30'
        },
        sellingState: 'Active',
        timeLeft: 'P7D'
      },
      {
        itemId: '987654321',
        title: 'Samsung Galaxy S23 Ultra 512GB Phantom Black',
        price: { value: '3899.00', currency: 'PLN' },
        condition: 'New',
        categoryId: '9355',
        listingType: 'FixedPrice',
        quantity: 2,
        format: 'FixedPrice',
        marketplaceId: 'EBAY_PL',
        seller: {
          username: 'testuser',
          feedbackPercentage: 99.5,
          feedbackScore: 1250
        },
        itemLocation: {
          country: 'PL',
          postalCode: '00-001'
        },
        shippingOptions: [],
        images: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'],
        description: 'Nowy Samsung Galaxy S23 Ultra',
        itemSpecifics: [],
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        viewItemURL: 'https://www.ebay.pl/itm/987654321',
        galleryURL: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
        paymentMethods: ['PayPal'],
        returnPolicy: {
          returnsAccepted: true,
          refund: 'MoneyBack',
          returnsWithin: 'Days_30'
        },
        sellingState: 'Active',
        timeLeft: 'P5D'
      }
    ];

    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      listings: mockListings,
      total: mockListings.length,
      hasMore: false
    };
  }

  // Update single listing - symulacja
  async updateListing(updateRequest: EbayUpdateRequest): Promise<boolean> {
    console.log('Updating listing:', updateRequest.itemId);
    console.log('Updates:', updateRequest);
    
    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Symulacja 90% sukcesu
    if (Math.random() > 0.1) {
      return true;
    } else {
      throw new Error('Simulated API error');
    }
  }

  // Bulk update multiple listings
  async bulkUpdateListings(bulkRequest: EbayBulkUpdateRequest, onProgress?: (completed: number, total: number) => void): Promise<{
    successful: string[];
    failed: Array<{ itemId: string; error: string }>;
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as Array<{ itemId: string; error: string }>
    };

    for (let i = 0; i < bulkRequest.itemIds.length; i++) {
      const itemId = bulkRequest.itemIds[i];
      
      try {
        const updateRequest: EbayUpdateRequest = {
          itemId,
          description: bulkRequest.updates.description
        };

        await this.updateListing(updateRequest);
        results.successful.push(itemId);
      } catch (error) {
        results.failed.push({
          itemId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, bulkRequest.itemIds.length);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
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

    return this.bulkUpdateListings({
      itemIds,
      updates: {
        description: fullDescription,
        templateHtml: fullDescription
      }
    }, onProgress);
  }

  // Get listing details - symulacja
  async getListingDetails(itemId: string): Promise<EbayListing | null> {
    // Symulacja opóźnienia
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Zwróć null dla demonstracji
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.tokens !== null && Date.now() < this.tokens.expiresAt;
  }

  // Disconnect (clear tokens)
  disconnect(): void {
    this.tokens = null;
    localStorage.removeItem('ebay_tokens');
    localStorage.removeItem('ebay_oauth_state');
  }

  // Private helper methods
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private saveTokensToStorage(): void {
    if (this.tokens) {
      localStorage.setItem('ebay_tokens', JSON.stringify(this.tokens));
    }
  }

  private loadTokensFromStorage(): void {
    const stored = localStorage.getItem('ebay_tokens');
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading tokens from storage:', error);
        localStorage.removeItem('ebay_tokens');
      }
    }
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