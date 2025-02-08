"use client";

import { useState } from "react";
import { useConnect } from "wagmi";
import { motion } from "framer-motion";
import { WalletMinimal } from "lucide-react";

export default function WelcomeScreen() {
  const { connectors, connect } = useConnect();
  const [isLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-purple-300 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-6">Turing Dapp</h1>
        <p className="text-xl mb-12">
          Conecte-se sua carteira para começar a votar.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300 cursor-pointer ${
            isHovered
              ? "text-gray-900 border-2 border-gray-300"
              : "bg-transparent border-2 border-gray-300"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => connect({ connector: connectors[0] })}
        >
          {isLoading ? (
            <span className="inliWalletne-block animate-spin mr-2">⚙️</span>
          ) : null}
          <span className="flex flex-row gap-2">
            <WalletMinimal />
            Conectar
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
