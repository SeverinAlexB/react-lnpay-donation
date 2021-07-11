// The donation itself and the donation message is send to a telegram bot to notify me
// This is a custom implementation on my server. You need to find your own way to send
// the notifications.


import React from "react";
import { SatoshiPriceContext } from "./SatoshiPriceProvider";
import { Button } from '@material-ui/core';
import LightningInvoice from "./LightningInvoice";
import DonationMessage from "./DonationMessage";


export type Props = {

}

const DonationHandler: React.FC<Props> = ({ }: Props) => {
  const donationLimitSat = 1000 * 1000; // 1m sat
  const defaultAmountDollar = 10;
  const satoshiPrice = React.useContext(SatoshiPriceContext);
  const [inputContent, setInputContent] = React.useState<string>(defaultAmountDollar.toString());
  const [amountDollar, setAmountDollar] = React.useState<number>(defaultAmountDollar);
  const [amountSat, setAmountSat] = React.useState<number>(0);
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
  const [isPaid, setIsPaid] = React.useState<boolean>(false);
  const [maxDollar, setMaxDollar] = React.useState<number>(30);

  React.useEffect(() => {
    const sat = amountDollar / satoshiPrice.satoshiUsdPrice;
    const roundingFactor = 100;
    const roundedSat = Math.round(sat / roundingFactor) * roundingFactor;
    setAmountSat(roundedSat);
  }, [satoshiPrice, amountDollar]);


  React.useEffect(() => {
    const parsedValue = Number.parseInt(inputContent);
    if (isNaN(parsedValue)) {
      setDollars(1);
    } else {
      if (parsedValue > maxDollar) {
        setInputContent(maxDollar.toString());
      } else {
        setDollars(parsedValue);
      }
      
    }
  }, [inputContent]);


  React.useEffect(() => {
    // Fix donations to 1m sat because of lnpay limits
    const dollars = donationLimitSat * satoshiPrice.satoshiUsdPrice;
    setMaxDollar(Math.floor(dollars));
  }, [satoshiPrice]);

  function setDollars(dollars: number) {
    if (dollars < 1) {
      setAmountDollar(1);
    } else if (dollars > maxDollar) {
      setAmountDollar(maxDollar)
    } else {
      setAmountDollar(dollars);
    }
  }

  const maxSliderValue = maxDollar < 150? maxDollar: 150; // Limit slider value

  return (
    <div className="inline-block">
      <div className="w-80">
        {isPaid &&
          <DonationMessage />
        }
        {isConfirmed && !isPaid &&
          <div className='flex flex-col justify-center items-center h-full'>
            <LightningInvoice confetti={true} onPaid={() => {
              setIsPaid(true);
              telegram.sendMessageToOwner(`Donation ${amountSat}sat`, `A donation has been made!`);
            }} 
            amountSat={amountSat} 
            label="lnrouter.app donation" 
            />
          </div>
        }
        {!isConfirmed && !isPaid &&

          <div className="relative">
            <div className="flex justify-between items-baseline ">
              <div className="text-xl font-medium">
                <NumberFormat displayType={'text'} thousandSeparator={true} suffix=" satoshi" value={amountSat} />
              </div>
              <div className="text-gray-800 border-b border-viking-700 bg-gray-50 px-2">
                $<input className="outline-none bg-gray-50 text-black" onChange={e => {
                  const value = e.target.value;
                  setInputContent(value);

                }} type="number" value={inputContent} style={{ width: amountDollar.toString().length + 'ch' }} />
              </div>
            </div>
            <Slider value={amountDollar} onChange={(e, value) => setInputContent((value as number).toString())} min={1} max={maxSliderValue} getAriaValueText={value => '$' + value}></Slider>
            {maxSliderValue <= amountDollar &&
              <p style={{marginTop: '-10px'}} className="text-xs text-gray-500 pb-4">Use the dollar input field if you like to increase the donation.</p>
            }
            <Button onClick={() => {   
              setIsConfirmed(true);
            }} className="w-full" color="primary" variant="contained" >Donate</Button>
            <div className="flex justify-center items-center mt-2">
              <svg className="text-yellow-400 mr-1" xmlns="http://www.w3.org/2000/svg" version="1.0" width="16px" height="16px" viewBox="0 0 1230.000000 1280.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M10122 12729 l-2123 -66 -82 -80 c-75 -72 -3682 -3574 -4649 -4513 l-406 -395 70 -10 70 -10 -54 -52 -55 -51 101 -6 c56 -3 317 -13 581 -21 264 -8 615 -20 780 -25 165 -6 488 -17 719 -25 230 -8 420 -15 422 -17 2 -2 -866 -827 -1928 -1833 -1062 -1007 -2022 -1917 -2134 -2022 l-203 -193 74 0 c41 0 75 -2 75 -4 0 -2 -26 -29 -57 -59 l-57 -55 200 -6 c109 -3 494 -11 854 -17 360 -6 656 -12 657 -13 0 0 -665 -702 -1479 -1559 -814 -857 -1478 -1560 -1476 -1561 2 -2 59 27 128 65 69 37 129 68 135 69 5 0 -31 -42 -80 -92 -50 -51 -106 -110 -125 -132 l-35 -38 75 40 c41 22 1135 604 2430 1292 1295 689 2936 1561 3646 1938 l1292 687 -120 5 -119 5 101 54 c56 29 99 55 97 57 -4 4 -1463 -9 -2234 -20 -178 -2 -323 -1 -322 2 0 4 460 356 1022 783 562 427 1517 1154 2122 1614 605 461 1370 1043 1699 1294 l600 456 -89 5 -88 5 72 55 72 55 -1213 6 c-667 3 -1311 7 -1430 8 l-217 1 52 48 c29 27 939 838 2022 1803 2778 2473 2775 2470 2775 2475 0 2 -37 1 -82 -2 l-83 -5 64 60 c36 33 63 62 60 64 -2 2 -959 -27 -2127 -64z" />
                </g>
              </svg>
              <span className='text-sm text-gray-700 font-bold'>Lightning Network</span>
            </div>
            <div className=" ">
              <div className="text-xs text-gray-400" style={{marginRight: '-20px'}}>
              powered by <a className="text-viking-800 text-opacity-60" href="https://lnpay.co" target="_blank">LNPay.co</a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default DonationHandler;