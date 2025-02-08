"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Connector, useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function WalletConnect() {
  const [hasMounted, setHasMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return isConnected ? <Account /> : <WalletOptions />;
}

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || "" });

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="flex items-center space-x-2">
      <Avatar className="w-10 h-10">
        {ensAvatar ? (
          <AvatarImage src={ensAvatar} alt="ENS Avatar" />
        ) : (
          <AvatarFallback>N/A</AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm">
        {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
      </span>
      <Button variant="destructive" size="sm" onClick={() => disconnect()}>
        Desconectar
      </Button>
    </div>
  );
}

function WalletOptions() {
  const { connectors, connect, error } = useConnect();

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector: Connector) => (
        <WalletOption
          key={connector.id}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
      {error && (
        <span className="text-xs text-destructive text-center">
          {error.message}
        </span>
      )}
    </div>
  );
}

interface WalletOptionProps {
  connector: Connector;
  onClick: () => void;
}

function WalletOption({ connector, onClick }: WalletOptionProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const provider = await connector.getProvider();
        setReady(!!provider);
      } catch (error) {
        setReady(false);
      }
    })();
  }, [connector]);

  return (
    <Button
      disabled={!ready}
      onClick={onClick}
      variant="outline"
      size="sm"
      className="max-w-28"
    >
      <span>{connector.name}</span>
    </Button>
  );
}
