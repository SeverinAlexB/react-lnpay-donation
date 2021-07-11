
import React from "react";
import { defaultWallet } from "./routerWallet";
import QRCode from 'qrcode.react';
import Loader from "react-loader-spinner";
import canvasConfetti from 'canvas-confetti';
import NumberFormat from "react-number-format";
import { CopyToClipboard } from 'react-copy-to-clipboard';


export type Props = {
  amountSat: number,
  label?: string,
  onPaid?: (amountMsat: number) => void,
  confetti?: boolean
}

const LightningInvoice: React.FC<Props> = ({ amountSat, confetti = false, label = 'lnrouter.app', onPaid = (amountMsat: number) => undefined }: Props) => {
  const BASE_COPY_TEXT = 'Click to copy invoice';
  const [invoice, setInvoice] = React.useState<any>(undefined);
  const [isSetteled, setIsSetteled] = React.useState<boolean>(false);
  const [copyText, setCopyText] = React.useState<string>(BASE_COPY_TEXT);
  const myDom = React.useRef(null);


  function sprayConfetti() {
    const element = myDom.current;
    const { top, height, left, width, } = element.getBoundingClientRect();
    const x = (left + width / 2) / window.innerWidth;
    const y = (top + height / 2) / window.innerHeight;
    const origin = { x, y };
    canvasConfetti({
      origin: origin
    });
  }

  async function createInvoice() {
    const _invoice = await defaultWallet.createInvoice({
      num_satoshis: amountSat,
      memo: label
    });
    console.log('invoice', _invoice);
    setInvoice(_invoice);
  }

  React.useEffect(() => {
    if (invoice) {
      let intervalId = undefined;
      intervalId = setInterval(async () => {
        const info = await defaultWallet.getTransactionInfo(invoice.id);
        if (info.settled) {
          console.log('Invoice settled', info);
          clearInterval(intervalId);
          setIsSetteled(true);
          if (confetti) {
            sprayConfetti();
          }
          onPaid(info.num_satoshis)
        }
      }, 1500);
      return () => {
        clearInterval(intervalId);
      }
    }
  }, [invoice])


  React.useEffect(() => {
    if (amountSat > 0 && !invoice) {
      setInvoice(undefined);
      createInvoice();
    }
  }, [amountSat, label])

  return (
    <div className="inline-block h-[256px] w-[256px]" ref={myDom}>
      {!isSetteled && invoice &&
        <div className="flex justify-center items-center">
          <div>
            <CopyToClipboard text={invoice.payment_request} onCopy={() => {
              setCopyText('Copied!')
              setTimeout(() => {
                setCopyText(BASE_COPY_TEXT)
              }, 3000)
            }}><div>
              <div className="relative cursor-pointer" onClick={() => { }}>

                <QRCode value={invoice.payment_request} size={240} />
                <div className="absolute top-[50%] left-[50%] bg-white px-2 py-2"
                  style={{ transform: 'translate(-50%, -50%)' }}>
                  <div className=" font-bold text-center text-lg">
                    <NumberFormat displayType={'text'} thousandSeparator={true} value={amountSat} />
                  </div>
                  <div className="text-xs font-bold text-gray-500" style={{ marginTop: '-4px' }}>satoshi</div>
                </div>
              </div>
              <p className="text-xs cursor-pointer font-bold text-gray-500">{copyText}</p>
            </div>
            </CopyToClipboard>
          </div>
        </div>  
      }
      {!isSetteled && !invoice &&
        <div className="flex justify-center pt-6">
          <Loader color="#27A3A4" type="ThreeDots"></Loader>
        </div>
      }
    </div>
  );
}

export default LightningInvoice;