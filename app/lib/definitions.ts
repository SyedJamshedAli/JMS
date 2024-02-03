// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export type clients={
    id: string;
    name: string;
  cut:string;
}
export type items={
  id: string;
  name: string;

}
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, 
//but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type saman={
  itemnameid:number;
  itemname:string;
  subitemnameid:number;
  subitemname:string;
  pondAmt:number;
}

export type TradesTable = {
  id: string;
  clientid: string;
  name: string;
  tradedate: string;
  pondamt: number;
  tradecutrate: number;
  type:string;
  pasaamt:number;
  pasawasul:number;
  itemname:string;
  subitemname:string;
  cb:string;
  cd:string;
  mb:string;
  md:string;
  active:number;
  stockid:string;
  profitamt:string;
  cutratepur:string;

};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type UserForLogin= {
  id?: string
  name?: string | null
  email?: string | null
  password?: string | null 
  role:string | null
    }

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
