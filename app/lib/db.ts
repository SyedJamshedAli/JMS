import {Client,Pool } from 'pg';
export async function DB(): Promise<Client> {
    const connectionString = process.env.POSTGRES_URL;
    const client = new Client({      connectionString,    })
    return client;
}

export async function DBPool():Promise<Pool>{
    const pool = new Pool({
        connectionString:
        process.env.POSTGRES_URL,
      });
      
      pool.connect((err, client, done) => {
        if (err) {
          console.error('Error connecting to the database', err);
        } else {
          console.log('Connected to the database');
          return pool;
        }
      });
      return pool;

}