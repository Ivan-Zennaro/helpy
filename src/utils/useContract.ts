import algosdk from "algosdk";
import { useWallet } from "@txnlab/use-wallet";
import crt from "./crt.json";
import { CRI_ASA_ID, USDC_ASA_ID, APP_ID, CONTRACT_ADD } from "../constants";

//For Purestake
/* const algodToken = {
  "X-API-Key": "dUAm46iRb73HzsHBrEYGr1nVw81Yc0Kp5eiNmZDF",
};
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const algodPort = "";
 */

const algodToken = "";
const algodServer = "https://testnet-api.algonode.cloud/";
const algodPort = "";

const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const contract = new algosdk.ABIContract(crt);

export type Roles = {
  is_donor: boolean;
  is_redcross: boolean;
  is_merchant: boolean;
  is_family: boolean;
};

export function useContract() {
  const { activeAddress, signer } = useWallet();

  /* ---------------------------------- donor_buy_token ---------------------------------- */
  const donor_buy_token = async (amount: number) => {
    if (!activeAddress) return -1;

    const atc = new algosdk.AtomicTransactionComposer();
    const sp = await client.getTransactionParams().do();
    sp.fee = 3000;
    sp.flatFee = true;

    const commonParams = {
      appID: APP_ID,
      sender: activeAddress!,
      suggestedParams: sp,
      signer: signer,
    };

    const txn = {
      txn: algosdk.makeAssetTransferTxnWithSuggestedParams(
        activeAddress!,
        CONTRACT_ADD,
        undefined,
        undefined,
        amount,
        undefined,
        USDC_ASA_ID,
        sp
      ),
      signer: signer,
    };

    atc.addMethodCall({
      method: getMethodByName("donor_buy_token", contract),
      methodArgs: [txn, CRI_ASA_ID],
      ...commonParams,
    });

    const result = await atc.execute(client, 2);

    return result.confirmedRound ? 1 : -1;
  };

  /* ---------------------------------- donor_transfer_asa ---------------------------------- */
  const donor_transfer_asa = async (amount: number, receiver: string) => {
    if (!activeAddress) return -1;

    const atc = new algosdk.AtomicTransactionComposer();

    const sp = await client.getTransactionParams().do();
    sp.fee = 2000;
    sp.flatFee = true;

    const commonParams = {
      appID: APP_ID,
      sender: activeAddress!,
      suggestedParams: sp,
      signer: signer,
    };

    atc.addMethodCall({
      method: getMethodByName("donation_transfer", contract),
      methodArgs: [CRI_ASA_ID, amount, activeAddress!, receiver],
      ...commonParams,
    });

    const result = await atc.execute(client, 2);

    return result.confirmedRound ? 1 : -1;
  };

  /* ---------------------------------- pay_merchant ---------------------------------- */
  const pay_merchant = async (amount: number, receiver: string) => {
    if (!activeAddress) return -1;

    const atc = new algosdk.AtomicTransactionComposer();

    const sp = await client.getTransactionParams().do();
    sp.fee = 3000;
    sp.flatFee = true;

    const commonParams = {
      appID: APP_ID,
      sender: activeAddress!,
      suggestedParams: sp,
      signer: signer,
    };

    atc.addMethodCall({
      method: getMethodByName("pay_merchant", contract),
      methodArgs: [CRI_ASA_ID, USDC_ASA_ID, amount, activeAddress, receiver],
      ...commonParams,
    });

    const result = await atc.execute(client, 2);
    return result.confirmedRound ? 1 : -1;
  };

  /* ---------------------------------- get_asa_balance ---------------------------------- */
  const get_asa_balance = async (asset_id: number) => {
    if (activeAddress) {
      const accountInfo = await client.accountInformation(activeAddress).do();
      const assetHolding = accountInfo.assets.find(
        (asset: any) => asset["asset-id"] === asset_id
      );
      return assetHolding ? assetHolding.amount : 0;
    }
    return 0;
  };

  /* ---------------------------------- getRole ---------------------------------- */
  const getRole = async (): Promise<Roles> => {
    let base_role = {
      is_donor: false,
      is_redcross: false,
      is_family: false,
      is_merchant: false,
    };

    if (!!activeAddress) {
      const accountAppInfo = await client
        .accountApplicationInformation(activeAddress!, APP_ID)
        .do();

      let index = 0;
      let res = [];

      while (true) {
        const localState =
          accountAppInfo["app-local-state"]["key-value"][index];
        if (!!localState) {
          const localKey = Buffer.from(localState.key, "base64").toString();
          const localValue = localState.value.uint;
          if (localValue == 1) res.push(localKey);
          index++;
        } else break;
      }

      base_role = {
        is_donor: res.includes("donor_role"),
        is_redcross: res.includes("redcross_role"),
        is_merchant: res.includes("merchant_role"),
        is_family: res.includes("family_role"),
      };
    }

    console.log(base_role);
    return base_role;
  };

  return {
    donor_buy_token,
    donor_transfer_asa,
    pay_merchant,
    get_asa_balance,
    getRole,
  };
}

function getMethodByName(name: string, contract: any) {
  const m = contract.methods.find((mt: any) => {
    return mt.name == name;
  });
  if (m === undefined) throw Error("Method undefined: " + name);
  return m;
}
