import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCities } from '../i18n/citiesData';
import { useLanguage } from '../i18n/LanguageContext';

export default function LocationAutocomplete({ value, onChange, placeholder, className }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 1) {
      setResults(searchCities(val, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }

  function selectCity(city) {
    setQuery(city.name);
    setIsOpen(false);
    onChange({
      name: city.name,
      country_code: city.country_code,
      region: city.region,
      latitude: city.lat,
      longitude: city.lng,
    });
  }

  function clear() {
    setQuery('');
    setResults([]);
    onChange(null);
  }

  return (
    <div ref={wrapperRef} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          value={query}
          onChange={handleInput}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          placeholder={placeholder || t('search_location')}
          className="pl-9 pr-8"
        />
        {query && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-64 overflow-y-auto">
          {results.map((city, i) => (
            <button
              key={`${city.name}-${city.country_code}-${i}`}
              onClick={() => selectCity(city)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-medium text-slate-800">{city.name}</span>
                <span className="text-slate-400 text-sm ml-2">
                  {city.region}, {city.country_code}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
