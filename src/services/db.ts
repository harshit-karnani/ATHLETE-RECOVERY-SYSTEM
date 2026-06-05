import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function saveSessionData(athleteId: string, dateStr: string, sessionData: any) {
  try {
    const sessionRef = doc(db, 'athletes', athleteId, 'sessions', dateStr);
    await setDoc(sessionRef, sessionData, { merge: true });
    console.log(`Saved session to Firebase: /athletes/${athleteId}/sessions/${dateStr}`);
  } catch (err) {
    console.warn("Failed to save to Firebase (likely missing credentials). Local state will be used as fallback.", err);
  }
}

export async function saveCoachOverride(athleteId: string, dateStr: string, overrideText: string) {
  try {
    const overrideObj = {
      text: overrideText,
      issued_by: 'Coach Harrington',
      timestamp: new Date().toISOString(),
      approved_ai: false
    };
    
    const sessionRef = doc(db, 'athletes', athleteId, 'sessions', dateStr);
    await setDoc(sessionRef, { coach_override: overrideObj }, { merge: true });
    console.log(`Saved override to Firebase: /athletes/${athleteId}/sessions/${dateStr}`);
  } catch (err) {
    console.warn("Failed to save override to Firebase.", err);
  }
}

export async function saveInjuryRecord(athleteId: string, injuryData: any) {
  try {
    const injuryRef = doc(db, 'athletes', athleteId, 'injuries', `inj-${Date.now()}`);
    await setDoc(injuryRef, injuryData, { merge: true });
    console.log(`Saved injury to Firebase: /athletes/${athleteId}/injuries/`);
  } catch (err) {
    console.warn("Failed to save injury to Firebase.", err);
  }
}
