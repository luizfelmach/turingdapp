export const contractAddr = "0x91E394b92f874169C3d4D5AC9829d71d7AB12fAE";

export interface User {
  codename: string;
  addr: string;
}

export type UserWithBalance = User & { balance: bigint };
