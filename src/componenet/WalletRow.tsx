import React from "react";
import { walkUpBindingElementsAndPatterns } from "typescript";

interface WalletRowProps {
  amount: number;
  usdValue: number;
  currency: string;
  formattedAmount: string;
  className?: string;
}

const WalletRow: React.FC<WalletRowProps> = ({
  amount,
  usdValue,
  currency,
  formattedAmount,
  className,
}) => {
  return (
    <div className={className}>
      <div>Currency: {currency}</div>
      <div>Amount: {amount}</div>
      <div>Formatted Amount: {formattedAmount}</div>
      <div>USD Value: {usdValue}</div>
      {/* Add more information or styling as needed */}
    </div>
  );
};

export default WalletRow;
