import type { Athlete, TodayLog } from './types';

export const mockAthletes: Athlete[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    age: 24,
    sport: 'Sprinter (100m/200m)',
    position: 'Standard Block',
    trackedDays: 280,
    baseline: {
      sleep: 8.2,
      restingHeartRate: 52,
      hrvDelta: 0
    },
    injuryHistory: [
      {
        id: 'inj-marcus-1',
        date: '2025-11-12',
        anatomicalSite: 'Right Hamstring',
        severity: 'Grade II Strain',
        leadUpConditions: {
          sleepBelowBaseline: 1.5,
          hrvDeltaBelow: -15,
          rpeAbove: 8,
          mentalStressAbove: 7
        },
        resolved: '2025-12-24',
        description: 'Occurred during wet track session, preceded by multiple nights of sleep deprivation (<6.5h) and a high HRV suppression.'
      }
    ],
    history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL'],
    weightKg: 82,
    heightCm: 185,
    gender: 'male'
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    age: 29,
    sport: 'Marathon Runner',
    position: 'Elite Distance',
    trackedDays: 512,
    baseline: {
      sleep: 7.8,
      restingHeartRate: 44,
      hrvDelta: 0
    },
    injuryHistory: [
      {
        id: 'inj-elena-1',
        date: '2026-02-15',
        anatomicalSite: 'Left Achilles Tendon',
        severity: 'Tendinopathy',
        leadUpConditions: {
          hrvDeltaBelow: -12,
          rpeAbove: 8,
          mentalStressAbove: 6
        },
        resolved: '2026-03-20',
        description: 'Pain developed at distal insertion following double high-intensity hill climb blocks with highly suppressed autonomic reserve.'
      }
    ],
    history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL'],
    weightKg: 54,
    heightCm: 168,
    gender: 'female'
  },
  {
    id: 'kofi-mensah',
    name: 'Kofi Mensah',
    age: 22,
    sport: 'Basketball Guard',
    position: 'Point Guard',
    trackedDays: 145,
    baseline: {
      sleep: 8.5,
      restingHeartRate: 58,
      hrvDelta: 0
    },
    injuryHistory: [
      {
        id: 'inj-kofi-1',
        date: '2025-08-04',
        anatomicalSite: 'Left Knee',
        severity: 'Grade I Patellar Tendonitis',
        leadUpConditions: {
          sleepBelowBaseline: 2.0,
          rpeAbove: 9
        },
        resolved: '2025-08-28',
        description: 'Acute soreness in the left patellar tendon following back-to-back games and significant sleep debt.'
      }
    ],
    history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL'],
    weightKg: 91,
    heightCm: 191,
    gender: 'male'
  },
  {
    id: 'maya-lin',
    name: 'Maya Lin',
    age: 26,
    sport: 'Olympic Weightlifter',
    position: '71kg Class',
    trackedDays: 45,
    baseline: {
      sleep: 8.0,
      restingHeartRate: 62,
      hrvDelta: 0
    },
    injuryHistory: [], // Test case for NO injury history
    history7Days: ['STABLE', 'STABLE', 'MODERATE', 'STABLE', 'STABLE', 'HIGH_RISK', 'CRITICAL'],
    weightKg: 71,
    heightCm: 165,
    gender: 'female'
  }
];

export interface PresetsMap {
  [athleteId: string]: {
    name: string;
    description: string;
    log: TodayLog;
  }[];
}

export const logPresets: PresetsMap = {
  'marcus-vance': [
    {
      name: 'Optimal Baseline',
      description: 'Metrics are tracking close to baseline with zero symptoms.',
      log: {
        sleepHours: 8.0,
        restingHeartRate: 53,
        hrvDelta: 2,
        rpePrevious: 6,
        restDayBetween: true,
        mentalStress: 3,
        mood: 8,
        hydration: 3.5,
        protein: 170,
        symptomTranscript: 'Felt great during today\'s sprint drills. Rested and ready to push the block.',
        painLevel: 0,
        symptomLocation: 'None'
      }
    },
    {
      name: 'Systemic Fatigue',
      description: 'Sleep deprivation and suppressed HRV, but no pain reported yet.',
      log: {
        sleepHours: 6.8, // 1.4 hours deficit
        restingHeartRate: 59,
        hrvDelta: -12, // -12ms suppression
        rpePrevious: 8,
        restDayBetween: false,
        mentalStress: 6,
        mood: 5,
        hydration: 2.6,
        protein: 110,
        symptomTranscript: 'Felt general fatigue towards the end of yesterday\'s conditioning. Sleep was choppy.',
        painLevel: 2,
        symptomLocation: 'None'
      }
    },
    {
      name: 'Critical Hamstring Pattern Match',
      description: 'Triggers the exact conditions of Marcus\'s previous Grade II Hamstring Strain.',
      log: {
        sleepHours: 6.0, // 2.2 hours deficit
        restingHeartRate: 64,
        hrvDelta: -22, // -22ms suppression
        rpePrevious: 9,
        restDayBetween: false,
        mentalStress: 8,
        mood: 3,
        hydration: 2.1,
        protein: 95,
        symptomTranscript: 'My right hamstring is feeling tight and there is a pinching pain when accelerating from blocks. Slept terribly due to heat.',
        painLevel: 6,
        symptomLocation: 'Right Hamstring'
      }
    }
  ],
  'elena-rostova': [
    {
      name: 'Optimal Recovery',
      description: 'Elena is fully recovered and hydrated.',
      log: {
        sleepHours: 7.9,
        restingHeartRate: 43,
        hrvDelta: 1,
        rpePrevious: 5,
        restDayBetween: true,
        mentalStress: 2,
        mood: 9,
        hydration: 3.8,
        protein: 145,
        symptomTranscript: 'Completed a 15k aerobic run. Leg muscles feel light and responsive. No tightness.',
        painLevel: 0,
        symptomLocation: 'None'
      }
    },
    {
      name: 'Achilles Pattern Match Warning',
      description: 'Autonomic nervous suppression combined with pain in the Achilles tendon.',
      log: {
        sleepHours: 7.2,
        restingHeartRate: 48,
        hrvDelta: -16, // HRV Delta suppressed by > 15ms
        rpePrevious: 8,
        restDayBetween: false,
        mentalStress: 7,
        mood: 4,
        hydration: 2.5,
        protein: 100,
        symptomTranscript: 'Feeling some nagging tightness in my left Achilles tendon, especially during the morning walk. RPE was high yesterday.',
        painLevel: 5,
        symptomLocation: 'Left Achilles Tendon'
      }
    }
  ],
  'kofi-mensah': [
    {
      name: 'Baseline Flow',
      description: 'Kofi is ready for standard guard practice.',
      log: {
        sleepHours: 8.4,
        restingHeartRate: 57,
        hrvDelta: 3,
        rpePrevious: 7,
        restDayBetween: true,
        mentalStress: 4,
        mood: 7,
        hydration: 3.5,
        protein: 155,
        symptomTranscript: 'Standard recovery day. Knees feel solid, standard joint stiffness is gone.',
        painLevel: 0,
        symptomLocation: 'None'
      }
    },
    {
      name: 'Patellar Tendonitis Pattern Match',
      description: 'Sleep debt and yesterday RPE matching lead-ups to Left Knee tendonitis.',
      log: {
        sleepHours: 6.2, // 2.3 hours deficit
        restingHeartRate: 63,
        hrvDelta: -8,
        rpePrevious: 9,
        restDayBetween: false,
        mentalStress: 5,
        mood: 5,
        hydration: 2.8,
        protein: 110,
        symptomTranscript: 'My left knee cap feels sore when I explode off my left foot or land from jumps. Sleep was poor due to travel.',
        painLevel: 6,
        symptomLocation: 'Left Knee'
      }
    }
  ],
  'maya-lin': [
    {
      name: 'Baseline Lifting',
      description: 'Maya in high-volume phase. No history of injury.',
      log: {
        sleepHours: 8.2,
        restingHeartRate: 61,
        hrvDelta: 0,
        rpePrevious: 7,
        restDayBetween: true,
        mentalStress: 3,
        mood: 8,
        hydration: 3.2,
        protein: 170,
        symptomTranscript: 'Shoulders and back feel stable. Ready for snatch volume.',
        painLevel: 0,
        symptomLocation: 'None'
      }
    },
    {
      name: 'Acute Strain Flag (No History Match)',
      description: 'High biometric stress and localized back tightness with no history.',
      log: {
        sleepHours: 5.8,
        restingHeartRate: 68,
        hrvDelta: -18,
        rpePrevious: 9,
        restDayBetween: false,
        mentalStress: 8,
        mood: 4,
        hydration: 2.2,
        protein: 120,
        symptomTranscript: 'Woke up with heavy tightness in my lower back after heavy cleans. Sluggish nervous system.',
        painLevel: 6,
        symptomLocation: 'Lower Back'
      }
    }
  ]
};

// Generate additional mock athletes to make the roster realistic (35 total)
const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"];
const sportsList = [
  { sport: "Basketball", positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"] },
  { sport: "Sprinter", positions: ["100m Dash", "200m Dash", "400m Dash", "Hurdles"] },
  { sport: "Distance Runner", positions: ["800m", "1500m", "5000m", "Marathon"] },
  { sport: "Weightlifter", positions: ["61kg Class", "73kg Class", "89kg Class", "102kg Class", "102kg+ Class"] },
  { sport: "Swimmer", positions: ["50m Freestyle", "100m Butterfly", "200m Backstroke", "400m Medley"] },
  { sport: "Rowing", positions: ["Heavyweight Single", "Coxless Four", "Eight Stroke", "Bow"] }
];

for (let i = 0; i < 31; i++) {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 7) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const age = Math.floor(Math.random() * 12) + 19; // 19-30
  const sportObj = sportsList[i % sportsList.length];
  const position = sportObj.positions[i % sportObj.positions.length];
  const sport = sportObj.sport;
  const weightKg = gender === 'male' ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 25) + 50;
  const heightCm = gender === 'male' ? Math.floor(Math.random() * 25) + 175 : Math.floor(Math.random() * 20) + 160;
  
  const baseline = {
    sleep: +(Math.random() * 1.5 + 7.2).toFixed(1),
    restingHeartRate: Math.floor(Math.random() * 15) + 48,
    hrvDelta: 0
  };

  const possibleBadges: ('CRITICAL' | 'HIGH_RISK' | 'MODERATE' | 'STABLE')[] = ['STABLE', 'STABLE', 'MODERATE', 'STABLE'];
  const history7Days = Array.from({ length: 7 }, () => possibleBadges[Math.floor(Math.random() * possibleBadges.length)]);
  mockAthletes.push({
    id,
    name,
    age,
    sport: `${sport} (${position})`,
    position,
    trackedDays: Math.floor(Math.random() * 400) + 50,
    baseline,
    injuryHistory: [],
    history7Days,
    weightKg,
    heightCm,
    gender
  });

  // Generate logs presets for them
  logPresets[id] = [
    {
      name: 'Standard Log',
      description: 'Standard baseline metrics',
      log: {
        sleepHours: baseline.sleep,
        restingHeartRate: baseline.restingHeartRate,
        hrvDelta: Math.floor(Math.random() * 10) - 4, // -4 to +5
        rpePrevious: Math.floor(Math.random() * 4) + 4, // 4-7
        restDayBetween: Math.random() > 0.4,
        mentalStress: Math.floor(Math.random() * 4) + 2, // 2-5
        mood: Math.floor(Math.random() * 3) + 6, // 6-8
        hydration: +(Math.random() * 1.5 + 2.5).toFixed(1),
        protein: Math.floor(Math.random() * 60) + 120,
        symptomTranscript: 'Feeling good, standard training load absorption.',
        painLevel: 0,
        symptomLocation: 'None'
      }
    }
  ];
}

