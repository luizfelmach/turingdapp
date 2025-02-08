"use client";

import contract from "@/lib/Saturing.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import VotingList from "@/components/VotingList";
import RankingList from "@/components/RankingList";
import AdminPanel from "@/components/AdminPanel";
import WalletConnect from "@/components/WalletConnect";
import { useAccount, useReadContract } from "wagmi";
import WelcomeScreen from "@/components/WelcomeScreen";
import { contractAddr } from "@/lib/config";

export default function Home() {
  const { isConnected, address } = useAccount();

  const { data: isAdminContract } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    account: address,
    functionName: "isAdmin",
  });

  const isAdmin = isAdminContract as boolean;

  if (!isConnected) {
    return <WelcomeScreen />;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Turing Dapp</CardTitle>
        </CardHeader>
        <CardContent>
          <WalletConnect />
        </CardContent>
      </Card>

      <Tabs defaultValue="voting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voting">Votação</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="admin" disabled={!isAdmin}>
            Admin
          </TabsTrigger>
        </TabsList>
        <TabsContent value="voting">
          <VotingList />
        </TabsContent>
        <TabsContent value="ranking">
          <RankingList />
        </TabsContent>
        <TabsContent value="admin">
          <AdminPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
