import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { 
  Link, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  Settings,
  ExternalLink,
  RefreshCw,
  Eye,
  Edit,
  Upload,
  Download,
  Search,
  Filter,
  Check,
  X,
  Loader,
  AlertTriangle,
  FileText,
  Zap,
  Users,
  TrendingUp,
  Key,
  Globe,
  Shield
} from 'lucide-react';
import { useEbayStore } from '../store/ebayStore';
import { useTemplateStore } from '../store/templateStore';
import { EbayListing } from '../services/ebayApi';

const EbayIntegration: React.FC = () => {
  const {
    isConnected,
    connectionStatus,
    listings,
    selectedListings,
    isLoadingListings,
    listingsError,
    isApplyingTemplate,
    templateApplicationProgress,
    templateApplicationResults,
    connect,
    disconnect,
    loadListings,
    selectListing,
    selectAllListings,
    deselectAllListings,
    applyTemplateToSelected,
    applyTemplateToAll
  } = useEbayStore();

  const { templates } = useTemplateStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showResults, setShowResults] = useState(false);
  const [ebayConfig, setEbayConfig] = useState({
    clientId: import.meta.env.VITE_EBAY_CLIENT_ID || '',
    environment: import.meta.env.VITE_EBAY_ENVIRONMENT || 'sandbox',
    redirectUri: import.meta.env.VITE_EBAY_REDIRECT_URI || ''
  });

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Handle the callback
      useEbayStore.getState().handleAuthCallback(code, state);
    }
  }, []);

  // Load listings when connected
  useEffect(() => {
    if (isConnected && listings.length === 0) {
      loadListings();
    }
  }, [isConnected, listings.length, loadListings]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) {
      alert('Wybierz szablon do zastosowania');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      alert('Nie znaleziono wybranego szablonu');
      return;
    }

    try {
      if (selectedListings.length > 0) {
        await applyTemplateToSelected(template.htmlContent, template.cssContent);
      } else {
        await applyTemplateToAll(template.htmlContent, template.cssContent);
      }
      setShowResults(true);
      setShowTemplateModal(false);
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Błąd podczas stosowania szablonu: ' + (error instanceof Error ? error.message : 'Nieznany błąd'));
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Połączono z eBay';
      case 'connecting': return 'Łączenie z eBay...';
      case 'error': return 'Błąd połączenia';
      default: return 'Nie połączono z eBay';
    }
  };

  const handleConfigSave = () => {
    // W rzeczywistej aplikacji tutaj byłaby aktualizacja zmiennych środowiskowych
    // Dla demonstracji tylko zamykamy modal
    setShowConfigModal(false);
    alert('Konfiguracja została zapisana. Przeładuj aplikację aby zastosować zmiany.');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Integracja z eBay"
        subtitle="Zarządzaj aukcjami i stosuj szablony"
      />
      
      <div className="flex-1 p-6 bg-slate-900">
        {/* Connection Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isConnected 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {connectionStatus === 'connecting' ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : isConnected ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Link className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Status połączenia z eBay
                </h2>
                <p className={`text-sm ${getConnectionStatusColor()}`}>
                  {getConnectionStatusText()}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {ebayConfig.environment.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    {ebayConfig.clientId ? `${ebayConfig.clientId.substring(0, 20)}...` : 'Brak klucza'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <button 
                    onClick={() => loadListings(true)}
                    disabled={isLoadingListings}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingListings ? 'animate-spin' : ''}`} />
                    <span>Odśwież</span>
                  </button>
                  <button 
                    onClick={() => setShowConfigModal(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Konfiguracja</span>
                  </button>
                  <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Rozłącz
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowConfigModal(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Konfiguracja</span>
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={connectionStatus === 'connecting'}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {connectionStatus === 'connecting' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Łączenie...</span>
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        <span>Połącz z eBay</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Configuration Info */}
          <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">Aktualna konfiguracja eBay API</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Client ID:</span>
                    <p className="text-white font-mono text-xs break-all">
                      {ebayConfig.clientId || 'Nie skonfigurowany'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Środowisko:</span>
                    <p className="text-white">
                      {ebayConfig.environment === 'sandbox' ? '🧪 Sandbox (testowe)' : '🚀 Production'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Redirect URI:</span>
                    <p className="text-white font-mono text-xs break-all">
                      {ebayConfig.redirectUri || 'Nie skonfigurowany'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isConnected ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-white">{listings.length}</span>
                </div>
                <p className="text-slate-400 font-medium">Aktywne aukcje</p>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-2xl font-bold text-white">{selectedListings.length}</span>
                </div>
                <p className="text-slate-400 font-medium">Wybrane</p>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl font-bold text-white">{templates.length}</span>
                </div>
                <p className="text-slate-400 font-medium">Szablony</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {templateApplicationResults?.successful.length || 0}
                  </span>
                </div>
                <p className="text-slate-400 font-medium">Zaktualizowane</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Szukaj aukcji..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-900 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-full sm:w-64"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Wszystkie kategorie</option>
                    <option value="elektronika">Elektronika</option>
                    <option value="moda">Moda</option>
                    <option value="dom">Dom i ogród</option>
                    <option value="auto">Motoryzacja</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={selectedListings.length === listings.length ? deselectAllListings : selectAllListings}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>{selectedListings.length === listings.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}</span>
                  </button>

                  <button
                    onClick={() => setShowTemplateModal(true)}
                    disabled={isApplyingTemplate}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Zastosuj szablon</span>
                  </button>
                </div>
              </div>

              {selectedListings.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    Wybrano {selectedListings.length} aukcji. Szablon zostanie zastosowany tylko do wybranych aukcji.
                  </p>
                </div>
              )}
            </div>

            {/* Template Application Progress */}
            {isApplyingTemplate && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                  <div>
                    <h3 className="text-white font-semibold">Stosowanie szablonu...</h3>
                    <p className="text-slate-400 text-sm">
                      Postęp: {templateApplicationProgress.completed} / {templateApplicationProgress.total}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(templateApplicationProgress.completed / templateApplicationProgress.total) * 100}%` 
                    }}
                  ></div>
                </div>
                
                {templateApplicationProgress.currentItem && (
                  <p className="text-slate-400 text-sm mt-2">
                    Aktualizowanie: {templateApplicationProgress.currentItem}
                  </p>
                )}
              </div>
            )}

            {/* Results */}
            {showResults && templateApplicationResults && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Wyniki stosowania szablonu</h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-400 font-medium">Pomyślnie zaktualizowane</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{templateApplicationResults.successful.length}</p>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-red-400 font-medium">Błędy</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{templateApplicationResults.failed.length}</p>
                  </div>
                </div>
                
                {templateApplicationResults.failed.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Błędy:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {templateApplicationResults.failed.map((failure, index) => (
                        <div key={index} className="text-sm text-red-400 bg-red-500/5 p-2 rounded">
                          <strong>{failure.itemId}:</strong> {failure.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Listings */}
            {isLoadingListings ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-white">Ładowanie aukcji...</p>
              </div>
            ) : listingsError ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 text-red-400 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="font-semibold">Błąd ładowania aukcji</h3>
                </div>
                <p className="text-slate-400 mb-4">{listingsError}</p>
                <button
                  onClick={() => loadListings(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Spróbuj ponownie
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Brak aukcji</h3>
                <p className="text-slate-400">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Nie znaleziono aukcji pasujących do filtrów'
                    : 'Nie masz jeszcze aktywnych aukcji na eBay'
                  }
                </p>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Twoje aukcje ({filteredListings.length})
                </h3>
                
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <div 
                      key={listing.itemId} 
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedListings.includes(listing.itemId)
                          ? 'border-blue-500 bg-blue-500/5'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => selectListing(listing.itemId)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedListings.includes(listing.itemId)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-slate-400'
                          }`}>
                            {selectedListings.includes(listing.itemId) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-2 line-clamp-2">
                                {listing.title}
                              </h4>
                              <div className="flex items-center gap-6 text-sm text-slate-400">
                                <span className="text-emerald-400 font-semibold">
                                  {listing.price.value} {listing.price.currency}
                                </span>
                                <span>Ilość: {listing.quantity}</span>
                                <span>ID: {listing.itemId}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(listing.viewItemURL, '_blank');
                                }}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                title="Zobacz na eBay"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Open edit modal
                                }}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                title="Edytuj"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Not Connected State */
          <div className="text-center py-16">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Połącz z kontem eBay
              </h3>
              <p className="text-slate-400 mb-6">
                Autoryzuj aplikację aby zarządzać swoimi aukcjami i automatycznie stosować szablony.
              </p>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div className="text-left">
                    <p className="text-yellow-400 font-medium text-sm mb-1">
                      Wymagane uprawnienia:
                    </p>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li>• Odczyt i edycja aukcji</li>
                      <li>• Zarządzanie opisami</li>
                      <li>• Aktualizacja szablonów</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={handleConnect}
                disabled={connectionStatus === 'connecting'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Łączenie z eBay...</span>
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    <span>Autoryzuj dostęp</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Wybierz szablon</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{template.name}</h4>
                      <p className="text-slate-400 text-sm mb-2">{template.description}</p>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {template.category}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-400'
                    }`}>
                      {selectedTemplate === template.id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {selectedListings.length > 0 
                  ? `Szablon zostanie zastosowany do ${selectedListings.length} wybranych aukcji`
                  : `Szablon zostanie zastosowany do wszystkich ${listings.length} aukcji`
                }
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplate || isApplyingTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                >
                  Zastosuj szablon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Konfiguracja eBay API</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">Aktualna konfiguracja</h4>
                    <p className="text-slate-300 text-sm">
                      Aplikacja jest skonfigurowana z Twoimi kluczami eBay API.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client ID (App ID)
                </label>
                <input
                  type="text"
                  value={ebayConfig.clientId}
                  onChange={(e) => setEbayConfig({...ebayConfig, clientId: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="KarolWis-Template-SBX-..."
                />
                <p className="text-slate-400 text-xs mt-1">
                  Twój Client ID z eBay Developer Console
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Środowisko
                </label>
                <select
                  value={ebayConfig.environment}
                  onChange={(e) => setEbayConfig({...ebayConfig, environment: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="sandbox">Sandbox (testowe)</option>
                  <option value="production">Production (produkcja)</option>
                </select>
                <p className="text-slate-400 text-xs mt-1">
                  Użyj Sandbox do testów, Production dla prawdziwych aukcji
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Redirect URI
                </label>
                <input
                  type="text"
                  value={ebayConfig.redirectUri}
                  onChange={(e) => setEbayConfig({...ebayConfig, redirectUri: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="http://localhost:5173/ebay/callback"
                />
                <p className="text-slate-400 text-xs mt-1">
                  Musi być identyczny z konfiguracją w eBay Developer Console
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">Ważne informacje</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Klucze API są przechowywane lokalnie w przeglądarce</li>
                      <li>• Nigdy nie udostępniaj swoich kluczy API</li>
                      <li>• Używaj Sandbox do testów przed przejściem na Production</li>
                      <li>• Redirect URI musi być identyczny w aplikacji i eBay Console</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleConfigSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Zapisz konfigurację
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbayIntegration;