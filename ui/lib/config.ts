export const contractAddr = "0x10668c26c1F4e1e24a0d52786a9d60698dd1e218";

export interface User {
  codename: string;
  addr: string;
}

export type UserWithBalance = User & { balance: bigint };
