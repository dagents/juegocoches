import { readFileSync } from 'fs';
import pg from 'pg';
const { Client } = pg;

const env = readFileSync('.env', 'utf8');
for (const line of env.split('\n')) {
  const match = line.match(/^([^#=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    process.env[key] = val;
  }
}

const client = new Client({ connectionString: process.env.DIRECT_URL });
await client.connect();

// Create game_saves table
await client.query(`
  CREATE TABLE IF NOT EXISTS game_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    game_state JSONB NOT NULL,
    current_age INTEGER NOT NULL,
    current_month INTEGER NOT NULL,
    is_alive BOOLEAN NOT NULL DEFAULT true,
    score INTEGER NOT NULL DEFAULT 0,
    country_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);
console.log("✅ game_saves table created/verified");

// Create game_versions table
await client.query(`
  CREATE TABLE IF NOT EXISTS game_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_number VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    proposed_by UUID,
    votes_received INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);
console.log("✅ game_versions table created/verified");

// Insert v1.0 changelog entry
const existing = await client.query(`SELECT id FROM game_versions WHERE version_number = '1.0'`);
if (existing.rows.length === 0) {
  await client.query(`
    INSERT INTO game_versions (version_number, title, description, proposed_by, votes_received)
    VALUES (
      '1.0',
      'El Destino en tus Manos — Primera versión',
      'Naces en un lugar totalmente aleatorio: país, familia, nivel económico. La vida avanza mes a mes y tú decides qué hacer. Sistema completo con: generación aleatoria de personaje (30+ países), 8 stats (dinero, educación, salud, felicidad, relaciones, reputación, inteligencia, carisma), decisiones por fase de vida, eventos aleatorios, carreras profesionales, escena 3D con Babylon.js que evoluciona según tu vida, game over con puntuación y rankings.',
      'e546d157-f62a-4a98-952d-b4f42f37c44f',
      4
    );
  `);
  console.log("✅ v1.0 changelog entry inserted");
} else {
  console.log("ℹ️ v1.0 already exists");
}

await client.end();
console.log("Done!");
