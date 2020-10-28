module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost', port: 5432,
      user: 'user', password: 'hunter2',
      database: 'dbconn'
    }
  }
};