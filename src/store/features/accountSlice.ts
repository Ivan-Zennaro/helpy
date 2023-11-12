import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Roles } from "../../utils/useContract";

interface AccountState {
  account: string;
  roles: Roles;
}

const emptyRole: Roles = {
  is_donor: false,
  is_redcross: false,
  is_family: false,
  is_merchant: false,
};
const initialState: AccountState = {
  account: "",
  roles: emptyRole,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    clean: (state) => {
      state.account = "";
      state.roles = emptyRole;
    },
    setRole: (state, action: PayloadAction<Roles>) => {
      state.roles = action.payload;
    },
  },
});

export const { setAccount, clean, setRole } = accountSlice.actions;

export default accountSlice.reducer;
