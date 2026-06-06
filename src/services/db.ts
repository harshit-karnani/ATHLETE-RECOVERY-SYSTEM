// The backend server URL (adjust if port differs)
const BACKEND_URL = 'http://localhost:3001/api/db';

export async function saveSessionData(athleteId: string, dateStr: string, sessionData: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId, dateStr, sessionData })
    });
    if (!response.ok) {
      console.error('Failed to save session data:', await response.text());
    }
  } catch (err) {
    console.error('Network error saving session data:', err);
  }
}

export async function saveCoachOverride(athleteId: string, dateStr: string, overrideText: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId, dateStr, overrideText })
    });
    if (!response.ok) {
      console.error('Failed to save coach override:', await response.text());
    }
  } catch (err) {
    console.error('Network error saving coach override:', err);
  }
}

export async function saveInjuryRecord(athleteId: string, injuryData: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/injury`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId, injuryData })
    });
    if (!response.ok) {
      console.error('Failed to save injury record:', await response.text());
    }
  } catch (err) {
    console.error('Network error saving injury record:', err);
  }
}
