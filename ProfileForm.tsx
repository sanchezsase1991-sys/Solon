
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<UserProfile>({
    country: 'México',
    location: '',
    experience: '',
    skills: '', 
    age: 18,
    sex: 'Otro',
    language: 'Español'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setProfile(prev => ({
          ...prev,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
  };

  const handleLanguageChange = (lang: 'Español' | 'Inglés') => {
    setProfile(prev => ({ ...prev, language: lang }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 glass-card rounded-[2.5rem] shadow-2xl border-gold/40 animate-in fade-in zoom-in duration-700">
      <div className="text-center mb-10">
        <h1 className="cinzel text-4xl gold-text font-bold mb-2 uppercase tracking-tighter">SÓLON</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Arquitecto de Patrones Existenciales</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo 1: País de Búsqueda */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">País de Búsqueda</label>
          <select
            name="country"
            required
            className="w-full bg-black/40 border border-gold/20 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all text-xs text-gray-200"
            value={profile.country}
            onChange={handleChange}
          >
            <option value="México">México</option>
            <option value="Estados Unidos">Estados Unidos (USA)</option>
          </select>
        </div>

        {/* Campo 2: Ubicación Estratégica */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">Ubicación Estratégica</label>
          <input
            type="text"
            name="location"
            required
            placeholder="Ej. Ciudad de México"
            className="w-full bg-black/40 border border-gold/20 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all text-xs text-gray-200 placeholder:text-gray-600"
            value={profile.location}
            onChange={handleChange}
          />
        </div>

        {/* Campo 3: Edad */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">Edad</label>
          <input
            type="number"
            name="age"
            min="16"
            max="99"
            required
            className="w-full bg-black/40 border border-gold/20 rounded-xl px-4 py-3 focus:border-gold outline-none text-xs text-gray-200"
            value={profile.age}
            onChange={handleChange}
          />
        </div>

        {/* Campo 4: Sexo */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-1">Sexo</label>
          <select
            name="sex"
            className="w-full bg-black/40 border border-gold/20 rounded-xl px-4 py-3 focus:border-gold outline-none text-xs text-gray-200"
            value={profile.sex}
            onChange={handleChange}
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Campo 5: Idioma (Reemplazando Habilidades Clave) */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] text-center">Idioma</label>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handleLanguageChange('Español')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${profile.language === 'Español' ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20 scale-[1.02]' : 'border-gold/20 gold-text hover:bg-gold/5'}`}
            >
              &lt;Español&gt;
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('Inglés')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${profile.language === 'Inglés' ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20 scale-[1.02]' : 'border-gold/20 gold-text hover:bg-gold/5'}`}
            >
              &lt;Inglés&gt;
            </button>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full gold-gradient-bg text-black font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all cinzel tracking-[0.3em] text-[11px] shadow-xl shadow-gold/20"
          >
            INICIAR SINCRONIZACIÓN
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
