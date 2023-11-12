//Config:
export const update_time: number = 1000;
export const max_page_table: number = 4;
export const rounding_digits: number = 4;

export const REDCROSS_ROLE = "RC_ROLE";
export const FAMILY_ROLE = "FAMILY_ROLE";
export const MERCHANT_ROLE = "MERCHANT_ROLE";
export const DONOR_ROLE = "DONOR_ROLE";

export const navLinks = [
  {
    id: "dashboard",
    title: "Dashbard",
  },
  {
    id: "features",
    title: "Features",
  },
];

export const CRI_ASA_ID = 203022506;
export const USDC_ASA_ID = 67395862;
export const APP_ID = 203022326;
export const CONTRACT_ADD =
  "2KM6WMO62H3PO46VDRYGCQOSY4RWHKAKELI4SYSHCZZXXKUGT3LSKA7XYI";

export const cri_addresses = [
  {
    role: "RedCross",
    name: "Red Cross Milan",
    address: "TBB76BCKOQUEZ2INFYIKCWI7UQYPJ33Y4TMVMAYPURPLAGIBFKCHVBC5L4",
    note: "Red Cross Milan",
  },
  {
    role: "RedCross",
    name: "Red Cross Rome",
    address: "B7MRBD2YWYS4ZCNXKQNJMXK34SETVOC3GD7347SIQSVYSC76MU7IZDLDGU",
    note: "Red Cross Rome",
  },
];

export const family_addresses = [
  {
    role: "Family",
    name: "John's family",
    address: "ASMH6F3JAZJTRHNKAQQQII3A65OYJPIKPQ5PMMW2U6NSDQQIAP6DZIVX4A",
    note: "John's family is the best",
  },
  {
    role: "Family",
    name: "Maria's family",
    address: "HH5HBMWWNFOKRXTG3ZTZRUPZO66WCNTWK5PG6NTD5JVC2GEDMDG6O2OZLU",
    note: "Maria's family is the best",
  },
];

export const merchants = [
  {
    role: "merchant",
    name: "Coop",
    address: "MSHIHS7AHBMSJOXN2HWJTANMUCWSRLAHGLJVHVXDACRFV4JBSJYV7G5ZKU",
    products: [
      {
        id: "1",
        name: "Pasta 1Kg",
        price: 0.8,
      },
      {
        id: "2",
        name: "Salt 500g",
        price: 0.3,
      },
      {
        id: "3",
        name: "Tomatoes 500g",
        price: 1.2,
      },
    ],
  },
  {
    role: "merchant",
    name: "Lidl",
    address: "XEYYPHWL2TQTACQMOOYTGZQPW3RRR5F2NOW2DQRDTF52KQ4XVTQ7XOJ7DU",
    products: [
      {
        id: "4",
        name: "Flour 1Kg",
        price: 1.0,
      },
      {
        id: "5",
        name: "Milk 1L",
        price: 1.1,
      },
      {
        id: "6",
        name: "Tuna 200g",
        price: 2.5,
      },
    ],
  },
];
