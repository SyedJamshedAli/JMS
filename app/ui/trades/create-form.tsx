'use client';
import { clients, items, saman } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createTrade } from '@/app/lib/actions/tradeActions';
import { getPendingAmt ,getSamanDetails} from '@/app/lib/actions/tradeActions';
import { useFormState, useFormStatus } from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';
import { split } from 'postcss/lib/list';
import { useCallback, useRef, useState } from 'react';
import { DB } from '@/app/lib/db';
import React from 'react';
import Scanner from '@/app/ui/trades/scanner';


export default function TradeForm({
  customers,
  itemData,
  subItemData,
}: {
  customers: clients[];
  itemData: items[];
  subItemData: items[];
  
}) {
  
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createTrade, initialState);
  const [cutRate, setCutRate] = useState(0.0);
  const [changeCutRate, setChangeCutRate] = useState(0.0);
  const [pondAmt, setPondAmt] = useState('');
  const [pasaAmt, setPasaAmt] = useState(0.0);
  const [clientID, setClientID] = useState(0);
  const [ClientName, setClientName] = useState('');
  const [pendingAmt, setPendingAmt] = useState(0);
  const [itemTypeName, setItemTypeName] = useState('');
  const [subItemTypeName, setSubItemTypeName] = useState('');
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  

  const handleDateChange = (event:any) => {
    setSelectedDate(event.target.value);
    
  };
  const handleChangeCut = (value: string) => {
    if (value=='') {value=cutRate.toString();setChangeCutRate(parseFloat(value))}
    const changeCut = parseFloat(value);
const pasaAmt=((parseFloat(pondAmt)/96)*changeCut)
    setPasaAmt(pasaAmt);
  };

  const handlePondChange =  () => {
    const changeCut = changeCutRate;
const pasaAmt=((parseFloat(pondAmt)/96)*changeCut)
    setPasaAmt(pasaAmt);
  };

  const searchSamanWithID= async (samanID:string)=>{
const samanDetails:any= await getSamanDetails(parseInt(samanID));
setPondAmt(samanDetails[0].pondamt);
setItemTypeName(samanDetails[0].itemname);
setSubItemTypeName(samanDetails[0].subitemname);

const pasaAmt=((parseFloat(samanDetails[0].pondamt)/96)*changeCutRate)
setPasaAmt(pasaAmt);
  }

  const handleSearch = async (term: string) => {
    console.log(`DD Value: ${term}`);
    var splitted = term.split('-');
    console.log(splitted);
    const clientID = splitted[0];
    setClientID(parseInt(clientID));
    const clientName = splitted[1];
    setClientName(clientName);
    const clientCut = splitted[2];
    setCutRate(parseFloat(clientCut));
    setChangeCutRate(parseFloat(clientCut));

    let pendingAmt = await getPendingAmt(parseInt(clientID));
    if (!pendingAmt) pendingAmt = 0;
    setPendingAmt(pendingAmt);
    
    const pasaAmt=((parseFloat(pondAmt)/96)*parseFloat(clientCut))
    setPasaAmt(pasaAmt);
  
  
  };

  
  const formRef = useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    formRef.current?.reset();
      setPondAmt('0');
      setCutRate(0);
      setChangeCutRate(0);
      setPasaAmt(0);
      setPendingAmt(0);
      setItemTypeName('');
      setSubItemTypeName('');
      //setPendingAmt(0);
      
      //state.code='0';
    
  }, [state]);


  return (
  
  <form action={dispatch}  className="w-full max-w-full" ref={formRef}>
      <div className=''><Scanner setPondAmt={setPondAmt}/>    </div>
      <div className="-mx-3 mb-2 flex flex-wrap rounded-md bg-gray-50 p-4 md:p-6">
        {/* Trade Date */}
        
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label htmlFor="tradeDate" className="mb-2 block text-sm font-medium">
            Trade Date
          </label>
          <div className="relative">
            <input
            id="tradeDate"
            name="tradeDate"
              type="date"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-1 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="date-error"
              value={selectedDate}
        onChange={handleDateChange}
            ></input>
          </div>
        </div>

        {/* Customer Name */}

        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Select Client
          </label>
          <input type='hidden' id='clientID' name='clientID' value={`${clientID}`}/>
          <input type='hidden' id='clientName' name='clientName' value={`${ClientName}`}/>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            >
              <option value="" disabled>Select Client</option>
              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={`${customer.id}-${customer.name}-${customer.cut}`}
                >
                  {customer.name}-{customer.cut}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Client Sabqa Amt */}
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label htmlFor="pend" className="mb-2 block text-sm font-medium">
            Sabqa / Pending
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="pend"
                name="clientPendingAmt"
                type="number"
                step="0.01"
                placeholder="Client Pending Amt"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pend-error"
                value={pendingAmt}
                
                
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-6 w-full px-3 py-3 md:mb-0 md:w-1/3">
          <label htmlFor="tradeType" className="mb-2 block text-sm font-medium">
            Trade (Sell/Buy/Sell Stock/Return/Faulty)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="tradeType"
                name="tradeType"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="tradeType-error"
              >
                <option value="" disabled>
                  Select Type{' '}
                </option>
                <option key="B" value="B">
                  Buy
                </option>
                <option key="S" value="B">
                  Sell
                </option>
                <option key="SS" value="B">
                  Stock Sell
                </option>
                <option key="R" value="B">
                  Return
                </option>
                <option key="F" value="B">
                  Faulty
                </option>
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="tradeType-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.tradeType &&
              state.errors.tradeType.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-6 w-full px-3 py-3 md:mb-0 md:w-1/3">
          <label htmlFor="pend" className="mb-2 block text-sm font-medium">
            Enter Saman ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="saman"
                name="saman"
                type="number"
                step="0.01"
                placeholder="Enter Saman ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pend-error"
                onBlur={(e) => {
                 // setPondAmt((e.target.value));
                 // const changeCut = changeCutRate;
                 // const pasaAmt=((parseFloat(e.target.value)/96)*changeCut)
                   //   setPasaAmt(pasaAmt);
                  
                  searchSamanWithID(e.target.value);
                }}
                
                
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <div className="mb-6 w-full px-3 py-3 md:mb-0 md:w-1/3">
          <label htmlFor="itemType" className="mb-2 block text-sm font-medium">
            Select Item
          </label>
          <div className="relative">
            <select
              id="itemType"
              name="itemType"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="itemType-error"
              value={itemTypeName}
            >
              <option value="" disabled>
                Select Item
              </option>
              {itemData.map((i) => (
                <option key={i.id} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="itemType-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.itemType &&
              state.errors.itemType.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="mb-6  px-3   md:mb-0 md:w-1/3 ">
          <label htmlFor="itemSubType" className="mb-2 block text-sm font-medium">
            Select Sub Item
          </label>
          <div className="relative">
            <select
              id="itemSubType"
              name="itemSubType"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="itemSubType-error"
              value={subItemTypeName}
            >
              <option value="" disabled>
                Select Sub-Item
              </option>
              {subItemData.map((si) => (
                <option key={si.id} value={si.name}>
                  {si.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="itemSubType-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.itemSubType &&
              state.errors.itemSubType.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="mb-6 w-full px-3  md:mb-0 md:w-1/3">
          <label htmlFor="pondAmt" className="mb-2 block text-sm font-medium">
            Amount (Pond)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="pondAmt"
                name="pondAmt"
                type="number"
                step="0.01"
                placeholder="Enter Pond Amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pondAmt-error"
                value={pondAmt}
                onChange={(e) => {
                  setPondAmt((e.target.value));
                  const changeCut = changeCutRate;
                  const pasaAmt=((parseFloat(e.target.value)/96)*changeCut)
                      setPasaAmt(pasaAmt);
                  //handlePondChange();
                }}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="pondAmt-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.pondAmt &&
                state.errors.pondAmt.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label htmlFor="cutRate" className="mb-2 block text-sm font-medium">
            Client Cut Rate
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="cutRate"
                name="cutRate"
                type="number"
                step="0.01"
                placeholder="Client Cut Rate"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="cutRate-error"
                value={cutRate}

              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-6 w-full px-3 py-3 md:mb-0 md:w-1/3">
          <label htmlFor="changeCut" className="mb-2 block text-sm font-medium">
            Change Cut Rate
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="changeCut"
                name="changeCut"
                type="number"
                step="0.01"
                placeholder="Change Cut Rate"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="changeCut-error"
                value={changeCutRate}
                onChange={(e) => {
                  setChangeCutRate(parseFloat(e.target.value));
                  handleChangeCut(e.target.value);
                }}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            
          </div>
        </div>
        <div className="mb-6 w-full px-3 py-3  md:mb-0 md:w-1/3">
          <label htmlFor="pasaAmt" className="mb-2 block text-sm font-medium">
            Pasa Amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="pasaAmt"
                name="pasaAmt"
                type="number"
                step="0.01"
                placeholder="Pasa Amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pasaAmt-error"
                value={pasaAmt}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="pasaAmt-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.tradeDate &&
                state.errors.tradeDate.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-6 w-full px-3 py-3 md:mb-0 md:w-1/3">
          <label htmlFor="pasaWasul" className="mb-2 block text-sm font-medium">
            Pasa Wasul
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="pasaWasul"
                name="pasaWasul"
                type="number"
                step="0.01"
                placeholder="Enter Pasa Amount (if any)"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pasaWasul-error"
                defaultValue={0}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/trade"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <SubmitButton />

       
      </div>
      

    </form>
  );
  function SubmitButton() {
    const status = useFormStatus();
    return <Button disabled={status.pending}> {status.pending ? 'Saving...' : 'Save Trade'}</Button>
  }
}
