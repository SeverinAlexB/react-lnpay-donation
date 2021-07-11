

import * as React from 'react'


export interface SatoshiPrice {
  btcUsdPrice: number;
  satoshiUsdPrice: number,
}

export const SatoshiPriceContext = React.createContext<SatoshiPrice>({
  btcUsdPrice: undefined,
  satoshiUsdPrice: undefined,
});



type Props = {
  children: any
}

const SatoshiPriceProvider = ({ children }: Props) => {
  const [btcPrice, setBtcPrice] = React.useState<number>(undefined);

  React.useEffect(() => {
    async function fetchSatoshiPrice(){
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const json = await response.json();
        const btcPrice = json.bpi.USD.rate_float;
        setBtcPrice(btcPrice);
    }
    fetchSatoshiPrice();
}, []);
  let satoshiPrice = undefined;
  if (btcPrice) {
    satoshiPrice = btcPrice / 100000000
  }
  return (
    <SatoshiPriceContext.Provider value={{
      btcUsdPrice: btcPrice,
      satoshiUsdPrice: satoshiPrice,
    }}>
      {children}
    </SatoshiPriceContext.Provider>
  );
};

export default SatoshiPriceProvider;