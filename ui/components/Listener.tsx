import { contractAddr } from "@/lib/config";
import contract from "@/lib/Saturing.json";
import { toast } from "sonner";
import { decodeEventLog } from "viem";
import { useWatchContractEvent } from "wagmi";

interface BalanceUpdatedEvent {
  user: string;
  newBalance: bigint;
}

interface UserRegisteredEvent {
  user: string;
  codename: string;
}

export default function Listener() {
  useWatchContractEvent({
    abi: contract.abi,
    address: contractAddr,
    eventName: "BalanceUpdated",
    onLogs(logs) {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: contract.abi,
            eventName: "BalanceUpdated",
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as unknown as BalanceUpdatedEvent;
          toast.success(
            `Saldo atualizado! 🪙 ${args.user}: ${args.newBalance} STU`
          );
        } catch (error) {
          console.error("Erro ao decodificar log:", error);
        }
      });
    },
  });

  useWatchContractEvent({
    abi: contract.abi,
    address: contractAddr,
    eventName: "UserRegistered",
    onLogs(logs) {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: contract.abi,
            eventName: "UserRegistered",
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as unknown as UserRegisteredEvent;

          toast.success(
            `Novo usuário registrado! 🚀 ${args.codename} (${args.user})`
          );
        } catch (error) {
          console.error("Erro ao decodificar log:", error);
        }
      });
    },
  });

  return null;
}
