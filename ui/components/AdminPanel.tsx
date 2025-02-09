"use client";

import contract from "@/lib/Saturing.json";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useReadContract, useWriteContract } from "wagmi";
import { contractAddr, User } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Controle do sistema de votação</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleVoting />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emitir Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <IssueToken />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Importar Usuários via CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <ImportUsersCSV />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersRegistered />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            Área de Perigo: Resetar Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResetSystem />
        </CardContent>
      </Card>
    </div>
  );
}

function ResetSystem() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const { writeContract } = useWriteContract();

  function handleReset() {
    if (confirmation === "eu quero resetar o sistema e estou ciente") {
      writeContract({
        abi: contract.abi,
        address: contractAddr,
        functionName: "resetSystem",
        args: [],
      });
      setOpen(false);
      setConfirmation("");
    }
  }

  return (
    <div>
      <Button
        className="bg-red-600 hover:bg-red-700 w-full"
        onClick={() => setOpen(true)}
      >
        Resetar Sistema
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Tem certeza?</DialogTitle>
          </DialogHeader>
          <p>
            Esta ação irá redefinir completamente o sistema. Para confirmar,
            digite exatamente:
          </p>
          <Label>eu quero resetar o sistema e estou ciente</Label>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={
                confirmation !== "eu quero resetar o sistema e estou ciente"
              }
            >
              Confirmar Reset
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ImportUsersCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const { writeContract } = useWriteContract();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
      event.target.files[0].text().then((text) => {
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        let countUsers = 0;
        for (const line of lines) {
          const [codename, addr] = line.split(",").map((item) => item.trim());
          if (codename && addr) {
            countUsers += 1;
          }
        }
        setCount(countUsers);
      });
    }
  }

  async function handleUpload() {
    if (!file) return;

    const text = await file.text();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const codenamesArray: string[] = [];
    const addressesArray: string[] = [];

    for (const line of lines) {
      const [codename, addr] = line.split(",").map((item) => item.trim());
      if (codename && addr) {
        codenamesArray.push(codename);
        addressesArray.push(addr);
      }
    }

    writeContract({
      abi: contract.abi,
      address: contractAddr,
      functionName: "registerUsers",
      args: [codenamesArray, addressesArray],
    });
  }

  return (
    <div className="space-y-4">
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      {count && <Label>{count} usuários</Label>}
      <Button onClick={handleUpload} className="w-full">
        Registrar Usuários
      </Button>
    </div>
  );
}

function UsersRegistered() {
  const { data: usersContract, isLoading: loadingUsers } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    functionName: "getUsers",
  });

  const users = usersContract as User[];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Endereço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!loadingUsers &&
          users.map((user) => (
            <TableRow key={user.codename}>
              <TableCell>{user.codename}</TableCell>
              <TableCell>{user.addr}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

function IssueToken() {
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { writeContract } = useWriteContract();

  const { data: usersContract, isLoading: loadingUsers } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    functionName: "getUsers",
  });

  const users = usersContract as User[];

  function handleIssueToken() {
    const issueAmount = +amount * 10 ** 18;
    console.log(issueAmount, selectedUser);
    writeContract({
      abi: contract.abi,
      address: contractAddr,
      functionName: "issueToken",
      args: [selectedUser?.codename, issueAmount],
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecione um usuário:
        </label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedUser?.addr || ""}
          onChange={(e) =>
            setSelectedUser(
              users.find((user) => user.addr === e.target.value) || null
            )
          }
        >
          <option value="">Selecione um usuário</option>
          {!loadingUsers &&
            users.map((user) => (
              <option key={user.codename} value={user.addr}>
                {user.codename} ({user.addr})
              </option>
            ))}
        </select>
      </div>
      <Input
        type="number"
        placeholder="Quantidade de tokens"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={() => handleIssueToken()} className="w-full">
        Emitir Tokens
      </Button>
    </div>
  );
}

function ToggleVoting() {
  const { writeContract } = useWriteContract();
  const { data: isVotingActive } = useReadContract({
    address: contractAddr,
    abi: contract.abi,
    functionName: "votingActive",
  });

  function toggleVotingStatus() {
    writeContract({
      abi: contract.abi,
      address: contractAddr,
      functionName: "votingToggle",
      args: [],
    });
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="voting-status"
        checked={isVotingActive as boolean}
        onCheckedChange={toggleVotingStatus}
      />
      <Label htmlFor="voting-status">
        Sistema de Votação {isVotingActive ? "Ativo" : "Inativo"}
      </Label>
    </div>
  );
}
