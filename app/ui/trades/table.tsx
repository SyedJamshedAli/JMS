import Image from 'next/image';
import { DeleteTrade } from '@/app/ui/trades/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal,formatDateToLocalWithTime  , formatCurrency } from '@/app/lib/utils';
import { fetchFilteredTrades } from '@/app/lib/data/tradeData';
import { Client } from '@vercel/postgres';
import { Suspense } from 'react';

export default async function TradesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const trades = await fetchFilteredTrades(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {trades?.map((trade) => (
              <div
                key={trade.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      
                      <p>{`${trade.name}-${trade.pondamt} / ${trade.tradecutrate} / ${trade.pasaamt}`}</p>
                    </div>
                    <p className="text-sm text-gray-500"> {formatDateToLocal(trade.tradedate)} / {trade.itemname} / {trade.subitemname}</p>
                  </div>
                  
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                   <p> {`Wasul:${trade.pasawasul} / ${trade.cb} -`}  {formatDateToLocalWithTime(trade.cd)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                  
                    <DeleteTrade id={parseInt(trade.id)}/>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Pond / Rate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type / Item
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Pasa
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Wasul
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created Date/By
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {trades?.map((trade) => (
                <tr
                  key={trade.clientid}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                     
                      <p>{trade.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  
                  {formatDateToLocal(trade.tradedate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  {`${trade.pondamt} / ${trade.tradecutrate}`}
                    
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  {`${trade.type} / ${trade.itemname} - ${trade.subitemname}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trade.pasaamt}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {trade.pasawasul}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  {`${trade.cb} / `}  {formatDateToLocalWithTime(trade.cd)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      
                      <DeleteTrade id={parseInt(trade.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
