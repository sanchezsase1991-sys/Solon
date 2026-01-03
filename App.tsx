
import React, { useState, useEffect } from 'react';
import { UserProfile, JobOpportunity, InvestmentStrategy } from './types';
import ProfileForm from './components/ProfileForm';
import JobCard from './components/JobCard';
import JobMap from './components/JobMap';
import InvestmentView from './components/InvestmentView';
import { getSolonResponse } from './geminiService';

// Defining AIStudio directly in the global Window augmentation to avoid naming collisions
// and ensure type consistency with the environment.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    profileJobs: JobOpportunity[];
    nearbyJobs: JobOpportunity[];
    investment: InvestmentStrategy | null;
    text: string;
    sources: string[];
  } | null>(null);

  const [view, setView] = useState<'selection' | 'jobs' | 'investment'>('selection');
  const [jobSubTab, setJobSubTab] = useState<'profile' | 'map'>('profile');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(false);
        }
      } else {
        setHasKey(true);
      }
    };
    checkKey();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleActivate = async () => {
    if (window.aistudio) {
      // Direct call to open selection dialog
      await window.aistudio.openSelectKey();
      // Assume success following triggering the selection
      setHasKey(true);
    }
  };

  const handleProfileSubmit = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    setError(null);
    try {
      const response = await getSolonResponse(userProfile, new Date());
      setResults({
        profileJobs: response.profileJobs || [],
        nearbyJobs: response.nearbyJobs || [],
        investment: response.investment || null,
        text: response.text,
        sources: response.sources || []
      });
      setView('selection');
    } catch (err: any) {
      // Handling 404/Not Found for API key billing status
      if (err?.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key Error: Facturación requerida.");
      } else {
        setError("Error en sincronización de patrones.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFavorableTime = () => {
    const hours = currentTime.getHours();
    return hours >= 9 && hours <= 18;
  };

  const t = (es: string, en: string) => (profile?.language === 'Inglés' ? en : es);

  if (hasKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-[2.5rem] p-10 text-center border-gold/40">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <i className="fa-solid fa-key gold-text text-3xl"></i>
          </div>
          <h2 className="cinzel text-3xl font-bold gold-text mb-4 uppercase">Portal de Sólon</h2>
          <p className="text-gray-400 text-sm message-relaxed mb-6 leading-relaxed">
            Activa una conexión segura con Google AI Studio para analizar patrones. 
            Se requiere una clave de API vinculada a un proyecto con <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="gold-text underline">facturación habilitada</a>.
          </p>
          <button 
            onClick={handleActivate}
            className="w-full gold-gradient-bg text-black font-bold py-4 rounded-2xl cinzel tracking-widest"
          >
            ACTIVAR CONEXIÓN
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ProfileForm onSubmit={handleProfileSubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h1 className="cinzel text-4xl gold-text font-bold tracking-tighter">SÓLON</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">{t('Arquitecto de Patrones Existenciales', 'Architect of Existential Patterns')}</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="glass-card px-4 py-2 rounded-lg text-[10px] font-mono border-gold/30">
            <span className="text-gray-500 uppercase mr-2">{t('Sincronía', 'Synchrony')}:</span> 
            <span className="gold-text font-bold">{currentTime.toLocaleTimeString()}</span>
          </div>
          <button onClick={() => window.location.reload()} className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
            <i className="fa-solid fa-rotate"></i>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-t-2 border-gold rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-compass gold-text text-3xl animate-pulse"></i>
            </div>
          </div>
          <p className="cinzel gold-text text-2xl tracking-widest animate-pulse">{t('Analizando Patrones...', 'Analyzing Patterns...')}</p>
        </div>
      ) : results ? (
        <div className="space-y-10">
          {view === 'selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 max-w-4xl mx-auto">
              <button onClick={() => setView('jobs')} className="glass-card p-12 rounded-[2.5rem] group hover:border-gold/60 transition-all text-center flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center group-hover:bg-gold/10">
                  <i className="fa-solid fa-briefcase text-4xl gold-text"></i>
                </div>
                <div>
                  <h2 className="cinzel text-3xl font-bold gold-text uppercase">{t('Oportunidades', 'Opportunities')}</h2>
                  <p className="text-gray-400 text-sm mt-3 font-light">{t('Protocolo de 7 días y geolocalización.', '7-day protocol and geolocation.')}</p>
                </div>
              </button>
              <button onClick={() => setView('investment')} className="glass-card p-12 rounded-[2.5rem] group hover:border-gold/60 transition-all text-center flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center group-hover:bg-gold/10">
                  <i className="fa-solid fa-chart-line text-4xl gold-text"></i>
                </div>
                <div>
                  <h2 className="cinzel text-3xl font-bold gold-text uppercase">{t('Micro-Inversión', 'Micro-Investment')}</h2>
                  <p className="text-gray-400 text-sm mt-3 font-light">{t('Estrategias de capital mínimo.', 'Minimum capital strategies.')}</p>
                </div>
              </button>
            </div>
          )}

          {view === 'jobs' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button onClick={() => setView('selection')} className="text-[10px] gold-text uppercase font-bold tracking-widest">
                  <i className="fa-solid fa-arrow-left mr-2"></i> {t('Volver', 'Back')}
                </button>
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                  <button onClick={() => setJobSubTab('profile')} className={`text-[9px] uppercase tracking-widest px-6 py-2.5 rounded-full font-bold transition-all ${jobSubTab === 'profile' ? 'bg-gold text-black' : 'text-gray-500'}`}>
                    {t('Para Tu Perfil', 'For Your Profile')}
                  </button>
                  <button onClick={() => setJobSubTab('map')} className={`text-[9px] uppercase tracking-widest px-6 py-2.5 rounded-full font-bold transition-all ${jobSubTab === 'map' ? 'bg-gold text-black' : 'text-gray-500'}`}>
                    {t('Mapa Global', 'Global Map')}
                  </button>
                </div>
              </div>
              {jobSubTab === 'profile' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.profileJobs.map((job, idx) => (
                    <JobCard key={idx} job={job} isFavorableTime={isFavorableTime()} />
                  ))}
                </div>
              ) : (
                <JobMap jobs={results.nearbyJobs} center={profile.coordinates ? { lat: profile.coordinates.latitude, lng: profile.coordinates.longitude } : { lat: 23.6345, lng: -102.5528 }} />
              )}
            </div>
          )}

          {view === 'investment' && results.investment && (
            <div className="space-y-8">
              <button onClick={() => setView('selection')} className="text-[10px] gold-text uppercase font-bold tracking-widest">
                <i className="fa-solid fa-arrow-left mr-2"></i> {t('Volver', 'Back')}
              </button>
              <InvestmentView strategy={results.investment} />
            </div>
          )}

          {results.sources.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <h4 className="cinzel text-[10px] gold-text font-bold uppercase tracking-widest mb-4">{t('Fuentes de Verificación', 'Verification Sources')}</h4>
              <div className="flex flex-wrap gap-3">
                {results.sources.map((source, idx) => (
                  <a key={idx} href={source} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-gold flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                    <i className="fa-solid fa-link"></i> {t('Enlace de Verificación', 'Verification Link')}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : error ? (
        <div className="text-center py-40">
          <p className="text-red-400 font-bold uppercase tracking-widest">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 gold-text border border-gold/30 px-8 py-3 rounded-full">{t('Re-sincronizar', 'Re-synchronize')}</button>
        </div>
      ) : null}
    </div>
  );
};

export default App;
