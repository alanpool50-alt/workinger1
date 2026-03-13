import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('workinger_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!userLocation) {
      detectLocation();
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('workinger_location', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  async function detectLocation() {
    setIsDetecting(true);
    setLocationError(null);

    // Try GPS first
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 300000,
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Reverse geocode using a free API
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await res.json();
        
        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || 'Unknown',
          country: data.countryName || 'Unknown',
          country_code: data.countryCode || '',
          region: data.principalSubdivision || '',
          source: 'gps',
        });
        setIsDetecting(false);
        return;
      } catch {
        // GPS failed, try IP
      }
    }

    // Fallback: IP geolocation
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      
      setUserLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown',
        country_code: data.country_code || '',
        region: data.region || '',
        source: 'ip',
      });
    } catch {
      setLocationError('Could not detect location');
      // Set a default
      setUserLocation({
        latitude: 0,
        longitude: 0,
        city: 'Unknown',
        country: 'Unknown',
        country_code: '',
        region: '',
        source: 'default',
      });
    }
    
    setIsDetecting(false);
  }

  function setManualLocation(loc) {
    setUserLocation({ ...loc, source: 'manual' });
  }

  // Haversine distance in km
  function getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isDetecting,
        locationError,
        detectLocation,
        setManualLocation,
        getDistance,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
