import { config } from "dotenv";

const { parsed } = config();
export const { PORT, DB_URL, SECRET, URL } = parsed;
