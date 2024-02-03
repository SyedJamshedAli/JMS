'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { DB, DBPool } from '@/app/lib/db';
import { TradesTable, saman } from '../definitions';
/*
const TradeFormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please Select Client' }),
  tradeDate: z.string(),
  tradeType: z.enum(['S', 'B', 'SS', 'R', 'F'], {
    invalid_type_error: 'Please select Trade Type.',
  }),
  itemType: z.string({ invalid_type_error: 'Please Select Item Type' }),
  itemSubType: z.string({ invalid_type_error: 'Please Select Item Sub Type' }),
  pondAmt: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amt greater then $0.' }),
  pasamt: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amt greater then $0.' }),
  wasulAmt: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amt greater then $0.' }),
});*/
const TradeFormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please Select Client' }),
  tradeDate: z.string({ invalid_type_error: 'Please Select Trade Date' }),
  tradeType: z.string({ invalid_type_error: 'Please Select Trade Type' }),
  pondAmt: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amt greater then $0.' }),
  itemType: z.string({ invalid_type_error: 'Please Select Item Type' }),
  itemSubType: z.string({ invalid_type_error: 'Please Select Item Sub Type' }),
});
export type State = {
  errors?: {
    customerId?: string[];
    tradeDate?: string[];
    tradeType?: string[];
    pondAmt?: string[];
    itemType?: string[];
    itemSubType?: string[];

    /*pendAmt?:string[];
      
      cutRate?:string[];
      chanageCut?:string[];
      pasaAmt?:string[];
      pasaWasul?:string[];*/
  };
  message?: string | null;
  code?: boolean | null;
};

const UpdateInvoice = TradeFormSchema.omit({ id: true });

export async function getSamanDetails(id: number) {
  try {
    //console.log(`getPendingAmt of client : ${id}`);
    const client = await DB();
    await client.connect();

    const q = `select itemnameid,itemname,subitemnameid,subitemname,pondAmt from saman 
    where active=1 and id=${id}`;
console.log(q);
    const samanDetails = await client.query<saman>(q);
    client.end();
    //    console.log(`Server query response: ${pendingAmt.rows[0].pending}`)
    console.log(samanDetails.rows[0]);
    return samanDetails.rows;
  } catch (err) {
    return { message: 'DB Err: Failed to getPendingAmt..' };
  }
}



export async function getPendingAmt(id: number) {
  try {
    //console.log(`getPendingAmt of client : ${id}`);
    const client = await DB();
    await client.connect();

    const q = `
       SELECT 
  Round(((SUM(CASE WHEN type = 'S'  THEN pasaAmt ELSE 0 END) +
  SUM(CASE WHEN type = 'SS'  THEN pasaAmt ELSE 0 END) )- 
  SUM(CASE WHEN type = 'S'  THEN pasawasul ELSE 0 END) - 
  SUM(CASE WHEN type = 'SS'  THEN pasawasul ELSE 0 END) - 
  SUM(CASE WHEN type = 'R'  THEN pasaAmt ELSE 0 END)-
  SUM(CASE WHEN type = 'F'  THEN pasaAmt ELSE 0 END)-
  SUM(CASE WHEN type = 'B'  THEN pasaAmt ELSE 0 END)-
  (select sum(recieve) from pasa where pasa.clientid= ${id} and active=1)),4) AS pending
  FROM trades WHERE active=1 and clientid= ${id}`;
console.log(q);
    const pendingAmt = await client.query(q);
    client.end();
    //    console.log(`Server query response: ${pendingAmt.rows[0].pending}`)
    return pendingAmt.rows[0].pending;
  } catch (err) {
    return { message: 'DB Err: Failed to getPendingAmt..' };
  }
}

export async function deleteTrade(id: Number) {
//  throw new Error('Failed to Delete Invoice');
const client = await DB();
await client.connect();

  try {
    console.log(`Deleing Invoice : ${id}`);
    const pendingAmt = await client.query( `update trades set active=0 where id= ${id}`);
    client.end();
    revalidatePath('/');
  } catch (err) {
    return { message: 'DB Err: Failed to delete invoice..' };
  }
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateInvoice.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, tradeDate } = validatedFields.data;

  const amtInCents = 100;
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amtInCents}, status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const CreateTrade = TradeFormSchema.omit({ id: true , saman:true});

export async function createTrade(prevState: State, formData: FormData) {
  
  
  const rawFormData_ = {
    customerId: formData.get('customerId'),
    tradeDate: formData.get('tradeDate'),
    pendAmt: formData.get('clientPendingAmt'),
    tradeType: formData.get('tradeType'),
    itemType: formData.get('itemType'),
    itemSubType: formData.get('itemSubType'),
    pondAmt: formData.get('pondAmt'),
    cutRate: formData.get('cutRate'),
    changeCut: formData.get('changeCut'),
    pasaAmt: formData.get('pasaAmt'),
    pasaWasul: formData.get('pasaWasul'),
    clientName: formData.get('clientName'),
    clientID: formData.get('clientID'),
    samanID:formData.get('saman'),
  };
  //const rawFormData = Object.fromEntries(formData.entries());
  // console.log(rawFormData_);
  const validatedFields = CreateTrade.safeParse(
    {customerId: formData.get('customerId'),
    tradeDate: formData.get('tradeDate'),
    pendAmt: formData.get('clientPendingAmt'),
    tradeType: formData.get('tradeType'),
    itemType: formData.get('itemType'),
    itemSubType: formData.get('itemSubType'),
    pondAmt: formData.get('pondAmt'),
    cutRate: formData.get('cutRate'),
    changeCut: formData.get('changeCut'),
    pasaAmt: formData.get('pasaAmt'),
    pasaWasul: formData.get('pasaWasul'),
    clientName: formData.get('clientName'),
    clientID: formData.get('clientID'),}
  );
  //console.log(validatedFields);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, tradeDate } = validatedFields.data;

  const date = new Date(); //.toISOString().split('T')[0];
  try {
    const client = await DB();
    await client.connect();

    const q = `Insert Into   trades (clientID,tradeDate,type,tradeID,SamanID,barCode,pondAmt,itemName,
      subItemName,defaultCutRate,TradeCutRate,pasaAmt,pasaWasul,cb,mb,StockID,
      profitAmt,cutRatePur,clientName) Values 
      ( ${rawFormData_.clientID},'${rawFormData_.tradeDate}',
      '${rawFormData_.tradeType}','${rawFormData_.samanID}',0,'',ROUND(${rawFormData_.pondAmt}, 4), '${rawFormData_.itemType}',
      '${rawFormData_.itemSubType}',ROUND(${rawFormData_.cutRate}, 4),ROUND(${rawFormData_.changeCut}, 4),
      ROUND(${rawFormData_.pasaAmt}, 4),ROUND(${rawFormData_.pasaWasul}, 4),'jam','jam',0,0,0,'${rawFormData_.clientName}'   )  RETURNING id;
      `;

    console.log(q);
    const r = await client.query(q);
    console.log(r);
    const updateTradeIdInSamanTable = await client.query(`update saman set mb='jam-Update Trade ID',md=NOW(),tradeid=${r.rows[0].id} where id=${rawFormData_.samanID}`);
    console.log(updateTradeIdInSamanTable);
    
    
    client.end();
  
    revalidatePath('/');
    

    return {
      message:'Success',
      code:!(prevState.code),
    }

  } catch (err) {
    
    return {
      message: 'Database Err: Failed to create Trade.',
      error: err,
      
    };
  }
  //    console.log(rawFormData);
  
  
  
  
}
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
