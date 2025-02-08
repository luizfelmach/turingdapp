export const contractAddr = "0x8A768b1a8755496DF5e7f557ce3d1289a82B690d";

export interface User {
  codename: string;
  addr: string;
}

export type UserWithBalance = User & { balance: bigint };
