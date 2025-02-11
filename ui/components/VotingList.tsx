"use client";

import contract from "@/lib/Saturing.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { contractAddr, User } from "@/lib/config";
import { EmptyVotingState } from "./EmptyVotingState";

export default function VotingList() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const { data: isVotingActiveContract, isLoading: loadingVotingActive } =
    useReadContract({
      address: contractAddr,
      abi: contract.abi,
      functionName: "votingActive",
    });

  const {
    data: usersContract,
    isLoading: loadingUsers,
    refetch,
    isFetching,
  } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    account: address,
    functionName: "getUsersToVote",
  });

  const users = usersContract as User[];
  const isVotingActive = isVotingActiveContract as boolean;

  async function handleVote(user: User) {
    writeContract(
      {
        abi: contract.abi,
        address: contractAddr,
        functionName: "vote",
        args: [user.codename, +amounts[user.codename] * 10 ** 18],
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  }

  useWatchContractEvent({
    abi: contract.abi,
    address: contractAddr,
    eventName: "UserRegistered",
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    abi: contract.abi,
    address: contractAddr,
    eventName: "BalanceUpdated",
    onLogs() {
      refetch();
    },
  });

  if (!isVotingActive && !loadingVotingActive) {
    return (
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        role="alert"
      >
        <p className="font-bold">Atenção</p>
        <p>
          O sistema de votação está desativado no momento. Contacte um admin.
        </p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <EmptyVotingState onRefresh={refetch} loading={isFetching} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {!loadingUsers &&
          users.map((user) => (
            <Card key={user.codename}>
              <CardHeader>
                <CardTitle>{user.codename}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Quantidade de Turings"
                    value={amounts[user.codename] || ""}
                    onChange={(e) =>
                      setAmounts({
                        ...amounts,
                        [user.codename]: e.target.value,
                      })
                    }
                    className="flex-grow"
                    disabled={!isVotingActive}
                  />
                  <Button
                    onClick={() => handleVote(user)}
                    disabled={!isVotingActive}
                  >
                    Votar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
