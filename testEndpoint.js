fetch('http://localhost:3001/api/athlete/daily-checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    athlete_id: 'test-123',
    transcript: 'My left hamstring has been feeling really tight since yesterday sprint session. No sharp pain, just a dull tightness.',
    pain_level: 4
  })
})
.then(r => r.json())
.then(d => console.log("====== AI RESPONSE ======\n" + JSON.stringify(d, null, 2)))
.catch(console.error);
