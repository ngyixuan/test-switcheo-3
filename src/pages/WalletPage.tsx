import React, { useEffect, useState, useMemo, ReactNode } from "react";
import WalletRow from "../componenet/WalletRow";

// interface
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
interface PricesData {
  currency: string;
  date: string;
  price: number;
}

// mock wallet balance
const useWalletBalances = () => {
  let balances = [
    { currency: "ETH", amount: 1.2341 },
    { currency: "OSMO", amount: 5.123 },
  ];
  return balances;
};

class Datasource {
  // TODO: Implement datasource class
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  async getPrices() {
    try {
      const response = await fetch(this.url);
      const pricesData: PricesData[] = await response.json();
      const pricesDict = pricesData.reduce<{ [key: string]: number }>(
        (acc, data) => {
          acc[data.currency] = data.price;
          return acc;
        },
        {}
      );

      return pricesDict;
    } catch (err) {
      console.log(err);
    }
  }
}

interface Props {
  children?: ReactNode;
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        if (prices) {
          setPrices(prices);
          console.log(prices);
        } else console.error("Prices response is undefined");
      })
      .catch((error) => {
        // typo error
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      // I change this full name same to the token name in the API call
      case "OSMO":
        return 100;
      case "ETH":
        return 50;
      case "ARB":
        return 30;
      case "ZIL":
        return 20;
      case "NEO":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.currency);
        if (balancePriority > -99) {
          // might be compare the balancePriority and balance amount
          if (balance.amount >= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.currency);
        const rightPriority = getPriority(rhs.currency);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]); // delete prices here

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      console.log(balance.currency, balance.amount, prices);
      return (
        <WalletRow
          key={index}
          className={"walletRow"}
          currency={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
export default WalletPage;
