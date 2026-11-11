import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, sanitizePayload } from '../firebase';
import { DEFAULT_LANDING_SETTINGS, LandingSettings, mergeLandingSettings } from '../data/landingSettings';

const CACHE_KEY = 'ingreguide_landing_settings';
const landingDoc = () => doc(db, 'siteSettings', 'landing');

function readCache(): LandingSettings {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) return mergeLandingSettings(JSON.parse(saved));
  } catch {
    // ignore
  }
  return DEFAULT_LANDING_SETTINGS;
}

function writeCache(settings: LandingSettings | null) {
  try {
    if (settings) localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore (quota / private mode)
  }
}

/** Live front page settings: Firestore `siteSettings/landing`, cached locally, defaults as fallback. */
export function useLandingSettings(): LandingSettings {
  const [settings, setSettings] = useState<LandingSettings>(readCache);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      landingDoc(),
      (snap) => {
        if (snap.exists()) {
          const merged = mergeLandingSettings(snap.data());
          setSettings(merged);
          writeCache(merged);
        }
      },
      (error) => {
        console.warn('Front page settings listener:', error);
      }
    );
    return unsubscribe;
  }, []);

  return settings;
}

/**
 * Saves the settings. Returns 'cloud' when Firestore accepted the write (visible to everyone),
 * or 'local' when only this browser's cache could be updated.
 */
export async function saveLandingSettings(settings: LandingSettings): Promise<'cloud' | 'local'> {
  writeCache(settings);
  try {
    await setDoc(landingDoc(), { ...sanitizePayload(settings), updatedAt: new Date().toISOString() });
    return 'cloud';
  } catch (error) {
    console.warn('Front page settings save failed, kept locally:', error);
    return 'local';
  }
}
