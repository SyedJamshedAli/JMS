const {Client, Pool } = require('pg');
//import {Client,Pool } from 'pg';
//import { DB } from '@/app/lib/db';



const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  clients,
  items,
  subItems,
  pasa,
  trade,
  saman,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS users;');
    const createTable = await client.query(
      `CREATE TABLE IF NOT EXISTS    users (  
      id Serial  PRIMARY KEY  , 
      name VARCHAR(255)   Not Null , 
      password Text   Not Null , 
      locked Text   DEFAULT '0'   , 
      active Int    DEFAULT 1 , 
      email VARCHAR(255)    , 
      cell VARCHAR(255)    , 
      role Text DEFAULT 'u'    
      );      
    `,
    );

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(hashedPassword);
        return client.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2,$3)',
          [`${user.name}`, `${user.email}`, `${hashedPassword}`],
          (err, result) => {
            if (err) {
              console.log('Error inserting user into the database', err);
            } else {
              console.log('User created successfully', err);
              console.log(`Seeded ${insertedUsers.length} users`);
            }
          },
        );

        /* return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `);*/
      }),
    );
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Seeding Clients
async function seedClients(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "clients" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS clients;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    clients (  
      id Serial  PRIMARY KEY  , 
      name VARCHAR(255)   Not Null , 
      cut NUMERIC   Not Null , 
      diff NUMERIC   Not Null , 
      active Int   Not Null , 
      type VARCHAR(255)   Not Null , 
      pendingGold VARCHAR(255)   Not Null , 
      description VARCHAR(255)    ); 
    `);

    console.log(`Created "clients" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      clients.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   clients (      name ,     cut ,     diff ,     active ,     type ,     pendingGold ,     description )                Values ( $1,$2,$3,$4,$5,$6,$7  )  ';
        const p = [
          `${cl.name}`,
          `${cl.cut}`,
          `${cl.diff}`,
          `${cl.active}`,
          `${cl.type}`,
          `${cl.pendingGold}`,
          `${cl.description}`,
        ];
        const r = await client.query(q, p);
        console.log(r);
        /*
        return client.query(
          'Inserts Into   clients (  id ,     name ,     cut ,     diff ,     active ,     type ,     pendingGold ,     description )                Values ( $1,$2,$3,$4,$5,$6,$7,$8 )  ', 
          [`${cl.id}`,`${cl.name}`,`${cl.cut}`,`${cl.diff}`,`${cl.active}`,`${cl.type}`,`${cl.pendingGold}`,`${cl.description}`], 
          (err, result) => {
            console.log(err);

            if (err) {
              console.log('Error inserting clients into the database', err);
            } else {
              console.log('clients created successfully', err);
              console.log(`Seeded ${insertedUsers.length} clients`);
            }
          },
        );*/

        /* return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `);*/
      }),
    );
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Seeding Items
async function seedItems(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "clients" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS items;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    items (  
      id Serial PRIMARY KEY  , 
      name VARCHAR(255)   Not Null , 
      active int Default 1  Not Null   ); 
    `);

    console.log(`Created "items" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      items.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   items (      name ,active )                Values ( $1,$2  )  ';
        const p = [`${cl.name}`, `${cl.active}`];
        const r = await client.query(q, p);
        console.log(r);
      }),
    );
  } catch (error) {
    console.error('Error seeding items:', error);
    throw error;
  }
}

// Seeding subItems
async function seedSubItems(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "clients" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS subitems;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    subitems (  
      id Serial PRIMARY KEY  , 
      name VARCHAR(255)   Not Null , 
      active int Default 1  Not Null   ); 
    `);

    console.log(`Created "subItems" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      subItems.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   subitems (      name ,active )                Values ( $1,$2  )  ';
        const p = [`${cl.name}`, `${cl.active}`];
        const r = await client.query(q, p);
        console.log(r);
      }),
    );
  } catch (error) {
    console.error('Error seeding subItems:', error);
    throw error;
  }
}

// Seeding Pasa
async function seedPasa(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "pasa" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS pasa;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    pasa (  
      id Serial PRIMARY KEY  , 
      clientID int, 
      date  timestamp NOT NULL DEFAULT NOW(),
      cd    timestamp  DEFAULT NOW(),

cb VARCHAR(20),
mb VARCHAR(20),
md timestamp  DEFAULT NOW(),
paid numeric default 0 not null,
recieve numeric default 0 not null,
active int default 1,
clientName varchar(50)  );
       
    `);

    console.log(`Created "pasa" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      pasa.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   pasa (clientID,Date,cb,mb,paid,recieve,active,clientName)                Values ( $1,$2,$3,$4,$5,$6,$7,$8  )  ';
        const p = [
          `${cl.clientID}`,
          `${cl.date}`,
          `${cl.cb}`,
          `${cl.mb}`,
          `${cl.paid}`,
          `${cl.recieve}`,
          `${cl.active}`,
          `${cl.clientName}`,
        ];
        const r = await client.query(q, p);
        console.log(r);
      }),
    );
  } catch (error) {
    console.error('Error seeding pasa:', error);
    throw error;
  }
}

// Seeding Pasa
async function seedTrade(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "pasa" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS trades;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    trades (  
      id Serial PRIMARY KEY  , 
      clientID int, 
      tradeDate timestamp default Now(),
type varchar(50) not null,
tradeId int,
samanId int,
barCode text,
pondAmt numeric not null,
itemName varchar(50),
subItemName varchar(50),
defaultCutRate numeric,
tradeCutRate numeric,
pasaAmt numeric,
pasaWasul numeric,
cd timestamp  DEFAULT NOW(),
cb VARCHAR(20),
mb VARCHAR(20),
md timestamp  DEFAULT NOW(),
active int default 1,
stockID int,
profitAmt numeric,
cutRatePur numeric,
clientName varchar(50)  );
       `);

    console.log(`Created "trade" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      trade.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   trades (clientID,tradeDate,type,tradeID,SamanID,barCode,pondAmt,itemName,subItemName,defaultCutRate,TradeCutRate,pasaAmt,pasaWasul,cb,mb,StockID,profitAmt,cutRatePur,clientName)                Values ( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19  )  ';
        const p = [
          `${cl.clientID}`,
          `${cl.tradeDate}`,
          `${cl.type}`,
          `${cl.tradeID}`,
          `${cl.samanID}`,
          `${cl.barCode}`,
          `${cl.pondAmt}`,
          `${cl.itemName}`,
          `${cl.subItemName}`,
          `${cl.defaultCutRate}`,
          `${cl.tradeCutRate}`,
          `${cl.pasaAmt}`,
          `${cl.pasaWasul}`,
          `${cl.cb}`,
          `${cl.mb}`,
          `${cl.stockID}`,
          `${cl.profitamt}`,
          `${cl.cutRatePur}`,
          `${cl.clientName}`,
        ];
        const r = await client.query(q, p);
        console.log(r);
      }),
    );
  } catch (error) {
    console.error('Error seeding pasa:', error);
    throw error;
  }
}


// Seeding Pasa
async function seedSaman(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "pasa" table if it doesn't exist
    const deleteTable = await client.query('DROP TABLE IF EXISTS Saman;');
    const createTable = await client.query(`
   
    CREATE TABLE IF NOT EXISTS    Saman (  
      id Serial PRIMARY KEY  , 
      clientID int not null , 
      cutRatePur numeric not null,
      cutRateSale numeric,
      itemNameID int,
      itemName varchar(50),
      subItemNameID int,
      subItemName varchar(50),
      barCode varchar(50),
      pondAmt numeric not null,
      stockID int,
      tradeID int,
      active int default 1,
      description varchar(100),
      cd timestamp  DEFAULT NOW(),
cb VARCHAR(20),
mb VARCHAR(20),
md timestamp  DEFAULT NOW()
 );
       `);

    console.log(`Created "saman" table`);

    // Insert data into the "users" table
    const insertedclients = await Promise.all(
      saman.map(async (cl) => {
        console.log(`inside map: ${cl.id}`);
        const q =
          'Insert Into   saman (clientID,cutRatePur,cutRateSale,itemNameId,itemName,subItemNameID,subItemName,barCode,pondAmt,stockID,tradeID,active,description,cb,mb)                Values ( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15 )  ';
        const p = [
          `${cl.clientID}`,
          `${cl.cutRatePur}`,
          `${cl.cutRateSale}`,
          `${cl.itemNameID}`,
          `${cl.itemName}`,
          `${cl.subItemNameID}`,
          `${cl.subItemName}`,
          `${cl.barCode}`,
          `${cl.pondAmt}`,
          `${cl.stockId}`,
          `${cl.tradeId}`,
          `${cl.active}`,
          `${cl.description}`,
          `${cl.cb}`,
          `${cl.mb}`
          
        ];
        const r = await client.query(q, p);
        console.log(r);
      }),
    );
  } catch (error) {
    console.error('Error seeding pasa:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}
 async function DB(){
  const connectionString = process.env.POSTGRES_URL;
  try{
  const client = new Client({      connectionString,    })
  return client;  
}
  catch(err)
  {console.log
  return err;}
  
}

async function main() {
  //const client = await db.connect();
  //const client=pool;
/*  const pool = new Pool({
    connectionString:
'postgres://ucitvxpv:4Yq5O7o44_T7MMp-UrexoaE3GLWzo3gY@manny.db.elephantsql.com/ucitvxpv',

  });
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to the database', err);
    } else {
      console.log('Connected to the database');
    }
  }); */
  const pool = await DB();
  console.log(pool);
  await pool.connect();

    await seedUsers(pool);
  await seedClients(pool);
  await seedItems(pool);
  await seedSubItems(pool);
    await seedPasa(pool);
//const db_pool=DBPool();
  await seedTrade(pool);
await seedSaman(pool);
  //await seedCustomers(client);
  //await seedInvoices(client);
  //await seedRevenue(client);

  //await client.close();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
