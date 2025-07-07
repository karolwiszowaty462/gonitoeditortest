import React, { useEffect } from 'react';
import Header from '../components/Layout/Header';
import { 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  Users,
  Plus,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';
import { useTemplateStore } from '../store/templateStore';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { templates, initializeTemplates } = useTemplateStore();
  const { user } = useAuthStore();

  // Initialize templates on component mount
  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const stats = [
    {
      label: 'Szablony',
      value: templates.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Aukcje eBay',
      value: '12',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Konwersje',
      value: '8.2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Ocena',
      value: '4.9',
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const recentTemplates = templates.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Panel główny"
        subtitle={`Witaj z powrotem, ${user?.name}!`}
      />
      
      <div className="flex-1 p-6 bg-slate-900">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Templates */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Ostatnie szablony</h2>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Zobacz wszystkie
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTemplates.length > 0 ? (
                  recentTemplates.map((template) => (
                    <div key={template.id} className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{template.name}</h3>
                        <p className="text-slate-400 text-sm">{template.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                            {template.category}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {new Date(template.updatedAt).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Ładowanie szablonów...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Szybkie akcje</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center gap-3 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Nowy szablon</span>
                </button>
                
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg flex items-center gap-3 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Połącz z eBay</span>
                </button>
                
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg flex items-center gap-3 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span>Zobacz statystyki</span>
                </button>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ostatnia aktywność</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Szablon zaktualizowany</p>
                    <p className="text-slate-500 text-xs">5 minut temu</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Nowa aukcja utworzona</p>
                    <p className="text-slate-500 text-xs">2 godziny temu</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Szablon wyeksportowany</p>
                    <p className="text-slate-500 text-xs">1 dzień temu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;