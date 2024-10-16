"use strict";

export default class Database {
    #db = null
    #dbType
    #options = { host: "localhost", port: 5432 }
    #supportedDBTypes = ['sqlite3', 'leveldb', 'rocksdb', 'redis']

    constructor( dbType, options ) {
        if (!this.#supportedDBTypes.includes(dbType)) {
            throw new Error(`Unsupported database type: ${dbType}`);
        }
        this.#dbType = dbType
        this.#options = options
    }

    async initialize() {
      this.#db = await this.#createClient();
      if (this.#dbType === 'sqlite3') {
          await new Promise((resolve, reject) => {
              this.#db.run(
                  "CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT)",
                  (err) => {
                      if (err) reject(err);
                      else resolve();
                  }
              );
          });
      }
    }

    async #createClient() {
        switch (this.#dbType) {
            case 'sqlite3':
              const sqlite3 = await import('sqlite3');
              return new sqlite3.Database(this.#options.path || ':memory:');
            case 'leveldb':
              const level = await import('level');
              return level.default(this.#options.path || './leveldb');
            case 'rocksdb':
              const rocksdb = await import('rocksdb');
              return rocksdb(this.#options.path || './rocksdb');
            case 'redis':
              const redis = await import('redis');
              const client = redis.createClient({
                  url: this.#options.url || `redis://${this.#options.host || 'localhost'}:${this.#options.port || 6379}`,
                  // Optional auth properties can be added here
              });
              await client.connect();
              return client;
            default:
              throw new Error(`Unsupported database type: ${this.#dbType}`);
        }
    }

    async insert(event) {
        const eventStr = JSON.stringify(event.message);
        switch (this.dbType) {
            case 'sqlite3':
                await new Promise((resolve, reject) => {
                    this.#db.run("INSERT INTO queue (id, event) VALUES (?)", [event.id, eventStr], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                break;
            case 'leveldb':
            case 'rocksdb':
                await this.#db.put(event.id, eventStr);
                break;
            case 'redis':
                await this.#db.set(event.id, eventStr);
                break;
        }
    }

    async delete(event) {
        switch (this.dbType) {
            case 'sqlite3':
                await new Promise((resolve, reject) => {
                    this.#db.run("DELETE FROM queue WHERE id = ?", [event.id], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                break;
            case 'leveldb':
            case 'rocksdb':
            case 'redis':
                await this.#db.del(event.id);
                break;
        }
    }

    async fetchAll() {
        const events = [];
        switch (this.dbType) {
            case 'sqlite3':
                return new Promise((resolve, reject) => {
                    this.#db.all("SELECT id, event FROM queue ORDER BY id ASC", [], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows.map(row => JSON.parse(row)));
                    });
                });
            case 'leveldb':
            case 'rocksdb':
                for await (const [_, value] of this.#db.iterator()) {
                    events.push(JSON.parse(value));
                }
                return events;
            case 'redis':
                const keys = await this.#db.keys('*');
                for (const key of keys) {
                    const value = await this.#db.get(key);
                    events.push(JSON.parse(value));
                }
                return events;
        }
    }
}