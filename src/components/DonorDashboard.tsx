import { useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet";
import styles, { layout } from "../style.js";
import { useContract } from "../utils/useContract.js";
import {
  CRI_ASA_ID,
  USDC_ASA_ID,
  cri_addresses,
  update_time,
  max_page_table,
  rounding_digits,
  CONTRACT_ADD,
} from "../constants/index.js";
import { SmallButton } from "./Button";

type DonorTransaction = {
  id: string;
  date: Date;
  receiver: string;
  amount: number;
};

type OutcomingDonationTxn = {
  id: string;
  date: Date;
  recipient: string;
  amount: number;
};

const DonorDashboard = () => {
  const { activeAddress } = useWallet();
  const [donations, set_donations] = useState<DonorTransaction[]>([]);
  const [cri_transactions, set_cri_transactions] = useState<
    OutcomingDonationTxn[]
  >([]);
  const { get_asa_balance } = useContract();
  const [usdc_balance, set_usdc_balance] = useState(0);
  const [cri_balance, set_cri_balance] = useState(0);
  const [pagination, set_pagination] = useState(0);
  const [pagination2, set_pagination2] = useState(0);
  const [selected_rc_address, set_selected_rc_address] = useState(
    cri_addresses[0].address
  );

  const handleRcSelectedChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;
    set_selected_rc_address(selectedOption);
  };

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

        const currentAccountTx: [DonorTransaction] = responseData.transactions
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
            const objToReturn: DonorTransaction = {
              id: filteredTxn.id,
              date: new Date(filteredTxn["round-time"] * 1000),
              receiver:
                filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                  .receiver,
              amount:
                filteredTxn["inner-txns"][0]["asset-transfer-transaction"]
                  .amount / 1_000_000,
            };

            return objToReturn;
          })
          .sort(
            (a: DonorTransaction, b: DonorTransaction) =>
              b.date.getTime() - a.date.getTime()
          );

        set_donations(currentAccountTx);

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
                  selected_rc_address &&
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

        set_cri_transactions(currentAccountTxOutPurch);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(() => fetchData(), update_time);
    return () => {
      clearInterval(interval);
    };
  }, [activeAddress, selected_rc_address]);

  return (
    <section className={layout.sectionCol}>
      <div
        className={`${layout.sectionCenter} ${styles.paragraph}  rounded-[20px] box-shadow bg-box py-8 px-12 pb-10 `}
      >
        <div className="flex flex-col p-2 ">
          <p className={`${styles.heading2} `}>Donor Dashboard</p>

          <p className={`${styles.paragraph} mt-8 text-black`}>
            {"USDC Amount: " + usdc_balance.toPrecision(rounding_digits)}
          </p>
          <p className={`${styles.paragraph} text-black`}>
            {"CRI Amount: " + cri_balance.toPrecision(rounding_digits)}
          </p>

          <div className="container mx-auto">
            <p className={`${styles.heading4} mt-6 text-black`}>Donations</p>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Donation To</th>
                  <th className="border border-black p-4">Role</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {donations
                  .slice(pagination, pagination + max_page_table)
                  .map((transaction, index) => (
                    <tr key={index}>
                      <td className="border border-black p-4">
                        {transaction.date.toDateString() +
                          "  " +
                          transaction.date.toLocaleTimeString()}
                      </td>
                      <td className="border border-black p-4">
                        {transaction.receiver.substring(0, 10)}
                      </td>
                      <td className="border border-black p-4">
                        {cri_addresses.filter(
                          (cri) => cri.address === transaction.receiver
                        ).length !== 0
                          ? "Red Cross"
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
            <p className={`${styles.heading4} mt-6 text-black`}>
              Red Cross transactions
            </p>
            <div className="w-full relative">
              <select
                className=" border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[40%] p-2.5 "
                value={selected_rc_address}
                onChange={handleRcSelectedChange}
              >
                {cri_addresses.map((option, index) => (
                  <option key={index} value={option.address}>
                    {option.name} - {option.address.substring(0, 10)}
                  </option>
                ))}
              </select>
            </div>
            <table className="min-w-full mt-6">
              <thead>
                <tr>
                  <th className="border border-black p-4">Date</th>
                  <th className="border border-black p-4">Donation To</th>
                  <th className="border border-black p-4">Role</th>
                  <th className="border border-black p-4">Amount</th>
                  <th className="border border-black p-4">TxnId</th>
                </tr>
              </thead>
              <tbody>
                {cri_transactions
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
                        {cri_addresses.filter(
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
        </div>
      </div>
    </section>
  );
};

export default DonorDashboard;
