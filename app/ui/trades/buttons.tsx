'use client';
import { deleteInvoice } from '@/app/lib/actions';
import { deleteTrade } from '@/app/lib/actions/tradeActions';
import { PencilIcon, PlusIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';


export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );

}
export function DeleteTrade({ id }: { id: Number }) {

    const deleteTradeWithID= deleteTrade.bind(null,id);
  return (
    <>
    <form action={deleteTradeWithID}>
      <DeleteButton />
      </form>
    </>
  );

  
  function DeleteButton() {
    const status = useFormStatus();
    return (
    <Button disabled={status.pending}> {status.pending ? 'Deleting...' : 'Delete Trade'}</Button>
      )}
}



