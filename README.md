# Helpy

Helpy is an Algorand blockchain-based solution that aims to solve the lack of transparency in charitable donations by providing a complete, fully transparent and secure donation system for thousands of humanitarian organizations

![Image text](/src/assets/hero_full.png)

## Table of Contents

1. [Introduction](#introduction)
2. [Solution](#solution)
3. [Implementation choices](#implementation-choices)
4. [Test Setup](#test-setup)
5. [Demo](#demo)

## Introduction


Voluntary societies are those associations that carry out non-profit activities with social, civil or cultural aims, and exclusively for the purpose of social solidarity. Often these societies propose fundraising campaigns, in which citizens can contribute by paying a certain amount of money. The money raised in this way is supposed to be used for charitable purposes associated with the company's field of work. However, these funds collected are not always used for their proper purpose and there is not even a way to verify how they were spent. This lack of transparency can create unease for contributors due to the uncertainty about how their contributions are being used by the charitable company. This can also be a cause of less participation by citizens to this type of activities. We have identified the Italian Red Cross as an ideal use case, for which food collection can also involve a significant use of resources like time, personnel and even money of volunteers spent travelling around the city to reach the various collection points.
To address this challenge, Helpy offers a comprehensive donation system to cover the whole donation donation process, from initial donor to the final family. Helpy incorporates a transparent purchasing mechanism, leveraging the Algorand blockchain as a fast, reliable, secure and carbon-negative payment infrastructure.

## Solution


The proposed solution is blockchain-based application that involves the use of a token as a substitute for the real money for donations. The token is programmed to allow its use only for authorized purposes. In addition, the use of a public blockchain allows anyone, at any time, to verify how and when the funds collected are used.

The citizens who act as donors, through a public portal, can buy tokens and send them directly to families or registered humanitarian organizations. Tokens can be used by families and charities to purchase products like food, stationery and medicines from registered merchants. For the purchase of these goods, merchants will directly receive fiat currency. An automatic exchange between token and fiat is direclty provided by the smart contract for all registered merchants. In the future to promote charitable initiatives, supermarkets or other businesses participating on the platform will be able to offer discounts and promotions redeemable by the donor. The proposed solution provides a fast and transparent system for anyone who wants to give to charity, which can also be used directly from their computer or mobile device.

## Implementation choices


Algorand, thanks to its high throughput and instant finality, is a perfect platform for the implementation of the desired solution. The user experience offered respects the high standards that we can find in classic web 2.0 applications, but it also increases security and transparency due to the presence of a public and immutable registry. Helpy, as donation token, uses a smart ASA following [ARC0020](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0020.md) specification. This ARC allows to put transfer logic inside an ASA token. Further details are included within the smart contract.

## Test Setup

### Initial setup

---

Setup the project to run it locally

```
$ git clone https://github.com/Ivan-Zennaro/helpy.git
$ cd ../helpy
$ npm install
$ npm start dev
```

### Roles

---

In Helpy there are 4 main roles:

- Donor
- Red Crosse
- Merchant
- Family

At the moment only donors, red crosses and merchants can access and interact with the application. All roles can only be assigned by the smart contract after a identity verification that has not yet been implemented.

For testing purpose, I provide the mnemonic phrase for one testing account for each relevant role.
You have to import the account you want to test into Pera Algo Wallet for testnet
The accounts provided are available in testnet with some ALGOs inside.

To get more funds use faucet services:

- for ALGO: [Algo Explorer Dispenser](https://testnet.algoexplorer.io/dispenser)
- for USDC (ASA_ID 67395862): [USDC Dispenser](https://testnet.folks.finance/faucet)

Testing accounts:

- Donor

  - Mnemonic: change behind arrow mean chief inhale phrase cup girl stand crack cash neglect foot misery cloud robust uncle radar thought funny kitten manage absent provide
  - Address: CERH3V2TCM6R7VQNBLPF46PX2OA7KCQLWF5ZB2HGC4IAIHZS735JEUO674

- Red Cross

  - Mnemonic: fall design suggest style build near credit salute loyal piano shallow job hair around sheriff ribbon problem suspect eagle cheap double curtain resource absorb arena
  - Address: B7MRBD2YWYS4ZCNXKQNJMXK34SETVOC3GD7347SIQSVYSC76MU7IZDLDGU

- Merchant
  - Mnemonic: style palace vocal access teach sunset flag answer only siege stick sample happy they cruise fire brick fortune holiday eternal napkin lamp tail about junk
  - Address: XEYYPHWL2TQTACQMOOYTGZQPW3RRR5F2NOW2DQRDTF52KQ4XVTQ7XOJ7DU

## Demo

A demo video is provided [here](https://youtube.com)


