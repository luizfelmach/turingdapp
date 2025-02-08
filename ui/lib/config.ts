export const contractAddr = "0x225455675fa8b65c4df3402009De7C47c6B19377";

export interface User {
  codename: string;
  addr: string;
}

export type UserWithBalance = User & { balance: BigInt };
