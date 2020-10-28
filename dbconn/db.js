const { Client } = require('pg');
const { EventEmitter } = require('events');

class DatabaseReconnection extends EventEmitter {
  #client = null;       #conn = null;
  #kill = false;        connected = false;

  constructor(conn) {
    super();
    this.#conn = conn;
  }

  connect() {
    if (this.#client) this.#client.end();
    if (this.kill) return;
    const client = new Client(this.#conn);
    client.on('error', (err) => this.emit('error', err));
    client.once('end', () => {
      if (this.connected) this.emit('disconnect');
      this.connected = false;
      if (this.kill) return;
      setTimeout(() => this.connect(), this.#conn.retry || 1_000);
    });
    client.connect((err) => {
      this.connected = !err;
      if (!err) this.emit('connect');
    });
    this.#client = client;
    this.emit('reconnect');
  }

  async query(q, p) {
    if (this.#kill || !this.connected) throw new Error('disconnected');
    return this.#client.query(q, p);
  }

  disconnect() {
    this.#kill = true;
    this.#client.end();
  }
}
module.exports = DatabaseReconnection;
