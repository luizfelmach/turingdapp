import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface EmptyVotingStateProps {
  onRefresh: () => void;
  loading: boolean;
}

export function EmptyVotingState({
  onRefresh,
  loading,
}: EmptyVotingStateProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Nenhuma votação disponível
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-center text-muted-foreground">
          Não há votações disponíveis para você neste momento. Verifique
          novamente mais tarde ou entre em contato com um administrador.
        </p>
        <Button onClick={() => onRefresh()} variant="outline">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin " : ""}`}
          />
          Atualizar
        </Button>
      </CardContent>
    </Card>
  );
}
