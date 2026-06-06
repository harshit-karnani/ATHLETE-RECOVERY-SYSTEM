const fs = require('fs');

let qe = fs.readFileSync('server/routes/queryEngine.ts', 'utf8');

const rpcCalls = `
    // Retrieve from Supabase across 3 domains
    const [protocolsRes, fingerprintsRes, historyRes] = await Promise.all([
      supabaseAdmin.rpc('match_protocols', {
        query_embedding,
        match_threshold: 0.1,
        match_count: 3
      }),
      supabaseAdmin.rpc('match_injury_fingerprints', {
        query_embedding,
        match_threshold: 0.1,
        match_count: 3
      }),
      supabaseAdmin.rpc('match_athlete_history', {
        query_embedding,
        p_athlete_id: athleteId,
        match_count: 3
      })
    ]);

    if (protocolsRes.error) console.error("match_protocols error:", protocolsRes.error);
    if (fingerprintsRes.error) console.error("match_injury_fingerprints error:", fingerprintsRes.error);
    if (historyRes.error) console.error("match_athlete_history error:", historyRes.error);

    const chunks = {
      clinical_protocols: protocolsRes.data || [],
      risk_memory_fingerprints: fingerprintsRes.data || [],
      athlete_historical_checkins: historyRes.data || []
    };
`;

const oldRpc = `    // Retrieve from Supabase
    const { data: chunks, error: rpcError } = await supabaseAdmin.rpc('match_protocols', {
      query_embedding,
      match_threshold: 0.1,
      match_count: 3
    });

    if (rpcError) {
      console.error("Supabase RPC Error:", rpcError);
      throw new Error("Failed to query vector database");
    }`;

qe = qe.replace(oldRpc, rpcCalls);
fs.writeFileSync('server/routes/queryEngine.ts', qe, 'utf8');

console.log('Updated queryEngine.ts to search 3 domains');
