import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ebayApi, EbayListing, EbayTokens } from '../services/ebayApi';

interface EbayState {
  // Authentication
  isConnected: boolean;
  tokens: EbayTokens | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  // Listings
  listings: EbayListing[];
  selectedListings: string[];
  isLoadingListings: boolean;
  listingsError: string | null;
  
  // Template application
  isApplyingTemplate: boolean;
  templateApplicationProgress: {
    completed: number;
    total: number;
    currentItem?: string;
  };
  templateApplicationResults: {
    successful: string[];
    failed: Array<{ itemId: string; error: string }>;
  } | null;
  
  // Actions
  connect: () => Promise<void>;
  handleAuthCallback: (code: string, state: string) => Promise<boolean>;
  disconnect: () => void;
  loadListings: (refresh?: boolean) => Promise<void>;
  selectListing: (itemId: string) => void;
  selectAllListings: () => void;
  deselectAllListings: () => void;
  applyTemplateToSelected: (templateHtml: string, templateCss: string) => Promise<void>;
  applyTemplateToAll: (templateHtml: string, templateCss: string) => Promise<void>;
  updateListing: (itemId: string, updates: any) => Promise<void>;
  refreshListingDetails: (itemId: string) => Promise<void>;
}

export const useEbayStore = create<EbayState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      tokens: null,
      connectionStatus: 'disconnected',
      listings: [],
      selectedListings: [],
      isLoadingListings: false,
      listingsError: null,
      isApplyingTemplate: false,
      templateApplicationProgress: {
        completed: 0,
        total: 0
      },
      templateApplicationResults: null,

      // Connect to eBay
      connect: async () => {
        set({ connectionStatus: 'connecting' });
        
        try {
          // Check if already authenticated
          if (ebayApi.isAuthenticated()) {
            set({ 
              isConnected: true, 
              connectionStatus: 'connected',
              tokens: ebayApi['tokens'] // Access private tokens for state
            });
            return;
          }

          // Redirect to eBay authorization
          const authUrl = ebayApi.getAuthorizationUrl();
          window.location.href = authUrl;
        } catch (error) {
          console.error('Connection error:', error);
          set({ 
            connectionStatus: 'error',
            isConnected: false 
          });
          throw error;
        }
      },

      // Handle OAuth callback
      handleAuthCallback: async (code: string, state: string) => {
        set({ connectionStatus: 'connecting' });
        
        try {
          const tokens = await ebayApi.exchangeCodeForToken(code, state);
          
          set({
            isConnected: true,
            connectionStatus: 'connected',
            tokens
          });
          
          // Load initial listings
          await get().loadListings();
          
          return true;
        } catch (error) {
          console.error('Auth callback error:', error);
          set({ 
            connectionStatus: 'error',
            isConnected: false 
          });
          return false;
        }
      },

      // Disconnect from eBay
      disconnect: () => {
        ebayApi.disconnect();
        set({
          isConnected: false,
          connectionStatus: 'disconnected',
          tokens: null,
          listings: [],
          selectedListings: [],
          templateApplicationResults: null
        });
      },

      // Load user's listings
      loadListings: async (refresh = false) => {
        if (!get().isConnected && !refresh) return;
        
        set({ 
          isLoadingListings: true, 
          listingsError: null 
        });
        
        try {
          const result = await ebayApi.getMyActiveListings(100, 0);
          
          set({
            listings: result.listings,
            isLoadingListings: false
          });
        } catch (error) {
          console.error('Error loading listings:', error);
          set({
            listingsError: error instanceof Error ? error.message : 'Failed to load listings',
            isLoadingListings: false
          });
        }
      },

      // Select/deselect listings
      selectListing: (itemId: string) => {
        const { selectedListings } = get();
        const isSelected = selectedListings.includes(itemId);
        
        set({
          selectedListings: isSelected
            ? selectedListings.filter(id => id !== itemId)
            : [...selectedListings, itemId]
        });
      },

      selectAllListings: () => {
        const { listings } = get();
        set({
          selectedListings: listings.map(listing => listing.itemId)
        });
      },

      deselectAllListings: () => {
        set({ selectedListings: [] });
      },

      // Apply template to selected listings
      applyTemplateToSelected: async (templateHtml: string, templateCss: string) => {
        const { selectedListings } = get();
        
        if (selectedListings.length === 0) {
          throw new Error('No listings selected');
        }

        set({ 
          isApplyingTemplate: true,
          templateApplicationProgress: {
            completed: 0,
            total: selectedListings.length
          },
          templateApplicationResults: null
        });

        try {
          const results = await ebayApi.applyTemplateToMultipleListings(
            selectedListings,
            templateHtml,
            templateCss,
            (completed, total) => {
              set({
                templateApplicationProgress: {
                  completed,
                  total,
                  currentItem: selectedListings[completed - 1]
                }
              });
            }
          );

          set({
            templateApplicationResults: results,
            isApplyingTemplate: false
          });

          // Refresh listings to show updates
          await get().loadListings(true);
        } catch (error) {
          console.error('Error applying template:', error);
          set({ isApplyingTemplate: false });
          throw error;
        }
      },

      // Apply template to all listings
      applyTemplateToAll: async (templateHtml: string, templateCss: string) => {
        const { listings } = get();
        const allItemIds = listings.map(listing => listing.itemId);

        set({ 
          isApplyingTemplate: true,
          templateApplicationProgress: {
            completed: 0,
            total: allItemIds.length
          },
          templateApplicationResults: null
        });

        try {
          const results = await ebayApi.applyTemplateToMultipleListings(
            allItemIds,
            templateHtml,
            templateCss,
            (completed, total) => {
              set({
                templateApplicationProgress: {
                  completed,
                  total,
                  currentItem: allItemIds[completed - 1]
                }
              });
            }
          );

          set({
            templateApplicationResults: results,
            isApplyingTemplate: false
          });

          // Refresh listings
          await get().loadListings(true);
        } catch (error) {
          console.error('Error applying template to all:', error);
          set({ isApplyingTemplate: false });
          throw error;
        }
      },

      // Update single listing
      updateListing: async (itemId: string, updates: any) => {
        try {
          await ebayApi.updateListing({
            itemId,
            ...updates
          });

          // Refresh the specific listing
          await get().refreshListingDetails(itemId);
        } catch (error) {
          console.error('Error updating listing:', error);
          throw error;
        }
      },

      // Refresh single listing details
      refreshListingDetails: async (itemId: string) => {
        try {
          const updatedListing = await ebayApi.getListingDetails(itemId);
          
          if (updatedListing) {
            set(state => ({
              listings: state.listings.map(listing =>
                listing.itemId === itemId ? updatedListing : listing
              )
            }));
          }
        } catch (error) {
          console.error('Error refreshing listing details:', error);
          throw error;
        }
      }
    }),
    {
      name: 'ebay-store',
      version: 0,
      partialize: (state) => ({
        isConnected: state.isConnected,
        tokens: state.tokens,
        connectionStatus: state.connectionStatus
      })
    }
  )
);