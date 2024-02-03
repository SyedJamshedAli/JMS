import NextAuth, { User } from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { error } from 'console';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import {UserForLogin} from '@/app/lib/definitions';
import { Client } from 'pg'
import {DB} from './app/lib/db';


async function getUser(email: string): Promise<any |undefined> {
  try {
        //const connectionString = process.env.POSTGRES_URL;
    const client =await  DB();
    await client.connect();
    const q='SELECT * FROM users WHERE email=$1';
    const values = [email];
    const user=await client.query (q,values);
    console.log(user.rows[0]);
    await client.end();
    return user.rows[0];
    //return res;
  } catch (err) {
    console.error('Failed to fetch user', err);

    throw new Error('Failed to fetch user.');
  }
}
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password!);
          if (passwordMatch) return user;
        }
        
        console.log('Invalid Credentials');
        return null;
      },
    }),
  ],
});
