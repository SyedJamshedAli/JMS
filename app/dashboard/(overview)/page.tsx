'use client'
//import {CardWrapper } from '@/app/ui/dashboard/cards';
//import RevenueChart from '@/app/ui/dashboard/revenue-chart';
//import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
//import {fetchCardData } from '@/app/lib/data';
//import { Suspense } from 'react';
//import { CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import { useQRCode } from 'next-qrcode';
import ReactToPrint from 'react-to-print';
import React, { useRef } from "react";
import QRCode from "react-qr-code";

class ComponentToPrint extends React.Component {
  render() {
        return (
      <ContentToPrint/>

    );
  }
}

export default function PrintComponent() {
  let componentRef:React.ReactInstance | any  = useRef();
  
  
  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          trigger={() => <button>Print this out!</button>}
          content={() => componentRef}
        />

        {/* component to be printed */}
        <ComponentToPrint ref={(el) => (componentRef = el)} />
      </div>

      <div>
      
      </div>
    </>
  );
}


export   function ContentToPrint() {
  const { Image , SVG} = useQRCode();
  const value='111/111/111/111/111/111';
  const pondw='123.111'
  const samanid='1234'

  return (
    <>
<main>

    <div style={{ fontSize:10,fontWeight:'bolder', height: "auto", margin: "0 auto", maxWidth: 70, width: "100%" }}>
      {pondw}
    <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={value}
    viewBox={`0 0 256 256`}
    />
    {samanid}

    
</div>
</main>
    
    </>
  );    
/*    
    const {numberOfCustomers,numberOfInvoices,totalPaidInvoices,totalPendingInvoices}=await fetchCardData();
    
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton/>}>
        <CardWrapper />
        </Suspense>
       
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {
        <Suspense fallback={<RevenueChartSkeleton/>}>
        <RevenueChart/> 
        </Suspense>
        }
        { 
        <Suspense fallback={<LatestInvoicesSkeleton/>} >
        <LatestInvoices />
        </Suspense>
        
        }
      </div>
    </main>
  );
  */
}