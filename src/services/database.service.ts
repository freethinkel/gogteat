import { path } from "@tauri-apps/api";
import Database, { QueryResult } from "tauri-plugin-sql-api";
import seed from "./seed.sql";

const DB_FILE = "gogteat.db";

let instance: DatabaseService | undefined;

export class DatabaseService {
  db = Promise.resolve()
    .then(() => path.appDir())
    .then((appDir) => `sqlite:${appDir}${DB_FILE}`)
    .then((path) => Database.load(path));

  constructor() {
    this._init();
    return instance || (instance = this);
  }

  private _init() {
    this.execute(seed);
  }

  async execute(sql: string, params?: any[]): Promise<QueryResult> {
    return this.db.then((db) => db.execute(sql, params));
  }

  async select(sql: string, params?: any[]): Promise<any> {
    return this.db.then((db) => db.select(sql, params));
  }
}
