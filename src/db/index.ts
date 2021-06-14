import { Pool } from "pg";

const db = new Pool({
  user: "postgres",
  database: "nested",
  password: "pass",
});

export default db;
