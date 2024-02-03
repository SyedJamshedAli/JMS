import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/trades/table';
import TradeForm from '@/app/ui/trades/create-form';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchItems, fetchSubItems, fetchTradePages } from '@/app/lib/data/tradeData';
import { fetchClients } from '@/app/lib/data/tradeData';

import { authConfig } from '@/auth.config';
import getServerSession from 'next-auth';

 
export default async function Page(
    {searchParams,}:
    {searchParams?:{query?:string;page?:string;};
}) {

const query=searchParams?.query || '';
const totalPages=await fetchTradePages(query);
const currentPage=Number(searchParams?.page) || 1;
//console.log(query);

//Get Clients info
const clientsData =await fetchClients();
const itemsData =await fetchItems();
const subItemsData =await fetchSubItems();



    return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Trades</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Trade..." />
    
      </div>
      {  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
      <Table query={query} currentPage={currentPage} />
      
      <div className="mt-5 flex w-full justify-center">
        
        { <Pagination totalPages={totalPages} /> }
      </div>
      <div className=" w-full items-center justify-between">
      <h1 className={`${lusitana.className} text-2xl`}>New Trades</h1>      
       <TradeForm customers={clientsData} itemData={itemsData} subItemData={subItemsData} />
     </div>
     </Suspense> }
    </div>
  );
}