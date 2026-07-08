import fs from "fs";
import path from "path";

const STORE_PATH = process.env.HERMES_STORE_PATH || path.join(process.cwd(), "hermes-memory.json");
const MAX_OBSERVATIONS = 500;

interface Observation {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  content: string;
}

interface Store {
  observations: Observation[];
}

function load(): Store {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch {}
  return { observations: [] };
}

function save(store: Store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function append(observation: Omit<Observation, "id" | "timestamp">) {
  const store = load();
  store.observations.push({
    ...observation,
    id: Math.random().toString(36).slice(2, 10),
    timestamp: new Date().toISOString(),
  });
  if (store.observations.length > MAX_OBSERVATIONS) {
    store.observations = store.observations.slice(-MAX_OBSERVATIONS);
  }
  save(store);
}

export function recent(n = 50): Observation[] {
  return load().observations.slice(-n);
}

export function all(): Observation[] {
  return load().observations;
}
