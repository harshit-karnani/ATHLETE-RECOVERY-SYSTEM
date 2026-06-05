import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Step 3: Baseline Recalculation
 * Runs at midnight to recalculate rolling 30-day averages for every athlete.
 */
export const recalculateBaselines = functions.pubsub.schedule('every day 00:00')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const athletesSnap = await db.collection('athletes').get();
      
      for (const athleteDoc of athletesSnap.docs) {
        const athleteId = athleteDoc.id;
        
        // Fetch last 30 days of sessions
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const sessionsSnap = await db.collection('athletes')
          .doc(athleteId)
          .collection('sessions')
          .where('timestamp', '>=', thirtyDaysAgo.toISOString())
          .get();
          
        if (sessionsSnap.empty) continue;
        
        let totalSleep = 0;
        let totalRhr = 0;
        let totalHrvDelta = 0;
        let validDays = 0;
        
        sessionsSnap.docs.forEach(doc => {
          const data = doc.data();
          const log = data.log;
          
          if (!log) return;
          
          // Exclude outlier days if needed here, but for now take simple average
          totalSleep += log.sleepHours || 0;
          totalRhr += log.restingHeartRate || 0;
          totalHrvDelta += log.hrvDelta || 0;
          validDays++;
        });
        
        if (validDays > 0) {
          const newBaseline = {
            sleep: parseFloat((totalSleep / validDays).toFixed(1)),
            restingHeartRate: Math.round(totalRhr / validDays),
            // We baseline absolute HRV based on Delta shift if needed
          };
          
          await db.collection('athletes').doc(athleteId).set({ baseline: newBaseline }, { merge: true });
          functions.logger.info(`Updated baseline for ${athleteId}:`, newBaseline);
        }
      }
    } catch (err) {
      functions.logger.error("Error recalculating baselines", err);
    }
    return null;
  });
