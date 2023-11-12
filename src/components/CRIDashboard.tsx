import { useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet";
import styles, { layout } from "../style.js";
import { useContract } from "../utils/useContract.js";
import {
  CRI_ASA_ID,
  USDC_ASA_ID,
  CONTRACT_ADD,
  merchants,
  update_time,
  max_page_table,
  rounding_digits,
} from "../constants/index.js";
import { SmallButton } from "./Button.js";

type IncomingDonationTxn = {
  id: string;
  date: Date;
  sender: string;
  amount: number;
};
type OutcomingDonationTxn = {
  id: string;
  date: Date;
  recipient: string;
  amount: number;
};

const CriDashboard = () => {
  const { activeAddress } = useWallet();
  const [incDon, set_incDon] = useState<IncomingDonationTxn[]>([]);
  const [outPurch, set_outPurch] = useState<OutcomingDonationTxn[]>([]);
  const [outDon, set_outDon] = useState<OutcomingDonationTxn[]>([]);
  const { get_asa_balance } = useContract();
  const [usdc_balance, set_usdc_balance] = useState(0);
  const [cri_balance, set_cri_balance] = useState(0);
  const [cri_used_purchases, set_cri_used_purchases] = useState(0);
  const [cri_received, set_cri_received] = useState(0);
  const [cri_donated, set_cri_donated] = useState(0);
  const [pagination, set_pagination] = useState(0);
  const [pagination2, set_pagination2] = useState(0);
  const [pagination3, set_pagination3] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let usdcBalance = await get_asa_balance(USDC_ASA_ID);
        set_usdc_balance(usdcBalance / 1_000_000);

        let cri_balance = await get_asa_balance(CRI_ASA_ID);
        set_cri_balance(cri_balance / 1_000_000);

        const req =
          "https://testnet-idx.algonode.cloud/v2/assets/" +
          CRI_ASA_ID +
          "/transactions";

        const response = await fetch(req);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();

        const currentAccountTxInc: [IncomingDonationTxn] =
          responseData.transactions
            .filter((txn: any) => {
              if (txn["tx-type"] !== "appl" || txn["inner-txns"].length !== 1)
                return false;

              const innerTxn = txn["inner-txns"][0];

              return (
                innerTxn["tx-type"] === "axfer" &&
                innerTxn["asset-transfer-transaction"]["asset-id"] ===
                  CRI_ASA_ID &&
                innerTxn["asset-transfer-transaction"].receiver ===
                  activeAddress
              );
            })
            .map((filteredTxn: any) => {
              const objToReturn: IncomingDonationTxn = {
                id: filteredTxn.id,
                date: new Date(filteredTxn["round-time"] * 1000),
                sender:
                  filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                    .sender,
                amount:
                  filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                    .amount / 1_000_000,
              };

              return objToReturn;
            })
            .sort(
              (a: IncomingDonationTxn, b: IncomingDonationTxn) =>
                b.date.getTime() - a.date.getTime()
            );

        set_incDon(currentAccountTxInc);

        set_cri_received(
          currentAccountTxInc.reduce(
            (prevValue, currentValue) => prevValue + currentValue.amount,
            0
          )
        );

        const currentAccountTxOutPurch: [OutcomingDonationTxn] =
          responseData.transactions
            .filter((txn: any) => {
              if (txn["tx-type"] !== "appl" || txn["inner-txns"].length !== 2)
                return false;

              const innerTxn = txn["inner-txns"][0];

              return (
                innerTxn["tx-type"] === "axfer" &&
                innerTxn["asset-transfer-transaction"]["asset-id"] ===
                  CRI_ASA_ID &&
                innerTxn["asset-transfer-transaction"].sender ===
                  activeAddress &&
                innerTxn["asset-transfer-transaction"].receiver === CONTRACT_ADD
              );
            })
            .map((filteredTxn: any) => {
              const objToReturn: OutcomingDonationTxn = {
                id: filteredTxn.id,
                date: new Date(filteredTxn["round-time"] * 1000),
                recipient:
                  filteredTxn["inner-txns"][1]["asset-transfer-transaction"]
                    .receiver,
                amount:
                  filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                    .amount / 1_000_000,
              };

              return objToReturn;
            })
            .sort(
              (a: OutcomingDonationTxn, b: OutcomingDonationTxn) =>
                b.date.getTime() - a.date.getTime()
            );

        set_outPurch(currentAccountTxOutPurch);

        set_cri_used_purchases(
          currentAccountTxOutPurch.reduce(
            (prevValue, currentValue) => prevValue + currentValue.amount,
            0
          )
        );

        const currentAccountTxOutDona: [OutcomingDonationTxn] =
          responseData.transactions
            .filter((txn: any) => {
              if (txn["tx-type"] !== "appl" || txn["inner-txns"].length !== 1)
                return false;

              const innerTxn = txn["inner-txns"][0];

              return (
                innerTxn["tx-type"] === "axfer" &&
                innerTxn["asset-transfer-transaction"]["asset-id"] ===
                  CRI_ASA_ID &&
                innerTxn["asset-transfer-transaction"].sender === activeAddress
              );
            })
            .map((filteredTxn: any) => {
              const objToReturn: OutcomingDonationTxn = {
                id: filteredTxn.id,
                date: new Date(filteredTxn["round-time"] * 1000),
                recipient:
                  filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                    .receiver,
                amount:
                  filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                    .amount / 1_000_000,
              };

              return objToReturn;
            })
            .sort(
              (a: OutcomingDonationTxn, b: OutcomingDonationTxn) =>
                b.date.getTime() - a.date.getTime()
            );

        set_outDon(currentAccountTxOutDona);

        set_cri_donated(
          currentAccountTxOutDona.reduce(
            (prevValue, currentValue) => prevValue + currentValue.amount,
            0
          )
        );
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
          <p className={`${styles.heading2} `}>Red Cross Dashboard</p>

          <p className={`${styles.paragraph} mt-8`}>
            {"USDC Amount: " + usdc_balance.toPrecision(rounding_digits)}
          </p>
          <p className={`${styles.paragraph}`}>
            {"CRI Amount: " + cri_balance.toPrecision(rounding_digits)}
          </p>

          <p className={`${styles.paragraph} mt-8 `}>
            {"CRI Received: " + cri_received.toPrecision(rounding_digits)}
          </p>

          <p className={`${styles.paragraph} `}>
            {"CRI used for purchases: " +
              cri_used_purchases.toPrecision(rounding_digits)}
          </p>

          <p className={`${styles.paragraph} `}>
            {"CRI used for donations: " +
              cri_donated.toPrecision(rounding_digits)}
          </p>

          <div className="container mx-auto">
            <p className={`${styles.heading4} mt-6 `}>Received Donations</p>

            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Sender</th>
                  <th className="border border-black p-4">Role</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {incDon
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
                      <td className="border border-black p-4">Simple donor</td>
                      <td className="border border-black p-4">
                        {transaction.amount + " CRI"}
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

          <div className="container mx-auto">
            <p className={`${styles.heading4} mt-6 `}>Purchases</p>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Recipient</th>
                  <th className="border border-black p-4">Role</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {outPurch
                  .slice(pagination2, pagination2 + max_page_table)
                  .map((transaction, index) => (
                    <tr key={index}>
                      <td className="border border-black p-4">
                        {transaction.date.toDateString() +
                          "  " +
                          transaction.date.toLocaleTimeString()}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.recipient.substring(0, 10)}
                      </td>
                      <td className="border border-black p-4">
                        {merchants.filter(
                          (cri) => cri.address === transaction.recipient
                        ).length !== 0
                          ? "Merchant"
                          : "Family"}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.amount + " CRI"}
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
              onClick={() => set_pagination2(pagination2 + max_page_table)}
              text="-->"
            >
              .
            </SmallButton>

            <SmallButton
              styles="m-2"
              onClick={() => {
                const current_pagination = pagination2;
                if (current_pagination >= max_page_table)
                  set_pagination2(current_pagination - max_page_table);
                else set_pagination2(0);
              }}
              text="<--"
            >
              .
            </SmallButton>
          </div>

          <div className="container mx-auto">
            <p className={`${styles.heading4} mt-6 `}>Donations</p>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Recipient</th>
                  <th className="border border-black p-4">Role</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {outDon
                  .slice(pagination3, pagination3 + max_page_table)
                  .map((transaction, index) => (
                    <tr key={index}>
                      <td className="border border-black p-4">
                        {transaction.date.toDateString() +
                          "  " +
                          transaction.date.toLocaleTimeString()}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.recipient.substring(0, 10)}
                      </td>
                      <td className="border border-black p-4">
                        {merchants.filter(
                          (cri) => cri.address === transaction.recipient
                        ).length !== 0
                          ? "Merchant"
                          : "Family"}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.amount + " CRI"}
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
              onClick={() => set_pagination3(pagination3 + max_page_table)}
              text="-->"
            >
              .
            </SmallButton>

            <SmallButton
              styles="m-2"
              onClick={() => {
                const current_pagination = pagination3;
                if (current_pagination >= max_page_table)
                  set_pagination3(current_pagination - max_page_table);
                else set_pagination3(0);
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

export default CriDashboard;
