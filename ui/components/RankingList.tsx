"use client";
import contract from "@/lib/Saturing.json";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { contractAddr, UserWithBalance } from "@/lib/config";
import { useReadContract } from "wagmi";

export default function RankingList() {
  const { data: usersContract, isLoading: loadingUsers } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    functionName: "getUsersWithBalance",
  });

  if (loadingUsers) return null;

  const users = usersContract as UserWithBalance[];
  const sortedUsers = [...users].sort((a, b) =>
    a.balance > b.balance ? -1 : 1
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Posição</TableHead>
          <TableHead>Codinome</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((candidate, index) => (
          <TableRow key={candidate.codename}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{candidate.codename}</TableCell>
            <TableCell className="text-right">
              {Number(candidate.balance) / 10 ** 18}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
