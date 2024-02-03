'use client';
import Html5QrcodePlugin from '@/app/lib/Html5QrcodePlugin';

export default  function Scanner({setPondAmt}: any){
//setPondAmt(123);
    const onNewScanResult = (decodedText:string, decodedResult:string) => {
        
        console.log(decodedText);
        console.log(decodedResult);
        alert(decodedText);
        setPondAmt(decodedText);
        // handle decoded results here
    };

    return (
        <div >
            <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
};