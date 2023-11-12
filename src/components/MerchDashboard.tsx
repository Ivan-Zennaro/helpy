import { useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet";
import styles, { layout } from "../style.js";
import { useContract } from "../utils/useContract.js";
import {
  CONTRACT_ADD,
  CRI_ASA_ID,
  USDC_ASA_ID,
  merchants,
  update_time,
  max_page_table,
  rounding_digits,
} from "../constants/index.js";
import { SmallButton } from "./Button";

type MerchTransaction = {
  id: string;
  date: Date;
  sender: string;
  receiver: string;
  amount: number;
};

const MerchDashboard = () => {
  const { activeAddress } = useWallet();
  const [myData, setData] = useState<MerchTransaction[]>([]);
  const { get_asa_balance } = useContract();
  const [usdc_balance, set_usdc_balance] = useState(0);
  const [pagination, set_pagination] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (activeAddress)
        try {
          let usdcBalance = await get_asa_balance(USDC_ASA_ID);
          set_usdc_balance(usdcBalance / 1_000_000);

          const req =
            "https://testnet-idx.algonode.cloud/v2/assets/" +
            CRI_ASA_ID +
            "/transactions";

          const response = await fetch(req);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const responseData = await response.json();

          const currentAccountTx: [MerchTransaction] = responseData.transactions
            .filter((txn: any) => {
              if (txn["tx-type"] !== "appl" || txn["inner-txns"].length !== 2)
                return false;

              const innerTxn = txn["inner-txns"][1];

              return (
                innerTxn["tx-type"] === "axfer" &&
                innerTxn.sender === CONTRACT_ADD &&
                innerTxn["asset-transfer-transaction"]["asset-id"] ===
                  USDC_ASA_ID &&
                innerTxn["asset-transfer-transaction"].receiver ===
                  activeAddress
              );
            })
            .map((filteredTxn: any) => {
              const objToReturn: MerchTransaction = {
                id: filteredTxn.id,
                date: new Date(filteredTxn["round-time"] * 1000),
                sender: filteredTxn.sender,
                receiver:
                  filteredTxn["inner-txns"][1]["asset-transfer-transaction"]
                    .receiver,
                amount:
                  filteredTxn["inner-txns"][1]["asset-transfer-transaction"]
                    .amount / 1_000_000,
              };

              return objToReturn;
            })
            .sort(
              (a: MerchTransaction, b: MerchTransaction) =>
                b.date.getTime() - a.date.getTime()
            );

          //console.log(currentAccountTx);
          setData(currentAccountTx);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    const interval = setInterval(() => fetchData(), update_time);
    return () => {
      clearInterval(interval);
    };
  }, [activeAddress]);

  return (
    <section className={layout.sectionCol}>
      <div
        className={`${layout.sectionCenter} ${styles.paragraph} bg-box rounded-[20px] py-8 px-12 pb-10`}
      >
        <div className="flex flex-col p-2 ">
          <p className={`${styles.heading2} `}>Merchant Dashboard</p>

          <p className={`${styles.paragraph} mt-8`}>
            {"USDC Amount: " + usdc_balance.toPrecision(rounding_digits)}
          </p>

          <div className="container mx-auto">
            <p className={`${styles.heading4} mt-6`}>Purchases</p>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Sender</th>
                  <th className="border border-black p-4">Receiver</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {myData
                  .slice(pagination, pagination + max_page_table)
                  .map((transaction, index) => (
                    <tr key={index}>
                      <td className="border border-black p-4">
                        {transaction.date.toDateString() +
                          "  " +
                          transaction.date.toLocaleTimeString()}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.sender.substring(0, 10)}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.receiver.substring(0, 10)}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.amount + " USD"}
                      </td>
                      <td className="border border-black p-4">
                        <a
                          href={
                            "https://app.dappflow.org/explorer/transaction/" +
                            transaction.id
                          }
                        >
                          {transaction.id.substring(0, 10)}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row-reverse mt-2">
            <SmallButton
              styles="m-2"
              onClick={() => set_pagination(pagination + max_page_table)}
              text="-->"
            >
              .
            </SmallButton>

            <SmallButton
              styles="m-2"
              onClick={() => {
                const current_pagination = pagination;
                if (current_pagination >= max_page_table)
                  set_pagination(current_pagination - max_page_table);
                else set_pagination(0);
              }}
              text="<--"
            >
              .
            </SmallButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchDashboard;
