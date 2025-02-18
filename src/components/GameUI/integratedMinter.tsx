"use client";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MiniKit, SendTransactionInput } from '@worldcoin/minikit-js';
import GameContext from "../../context/GameContext";
import { motion, AnimatePresence } from "framer-motion";

export function IntegratedMinter() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { clicksForMint, setClicksForMint } = useContext(GameContext);

  // Consulta inicial al backend
  useEffect(() => {
    const fetchInitialClickCount = async () => {
      try {
        const response = await fetch("/api/get-clicks", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          setClicksForMint(data.initialClickCount);
        } else {
          console.error("Error al obtener el conteo inicial:", data.message);
        }
      } catch (error) {
        console.error("Error en la consulta inicial:", error);
      }
    };
    fetchInitialClickCount();
  }, []);

  const handleMint = async () => {
    if (!session?.user || clicksForMint <= 0) return;
    
    try {
      setIsLoading(true);
  
      const response = await fetch('/api/get-mintable', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ World_ID: session.user.name }),
      });
      const responseData = await response.json();

      const transac: SendTransactionInput = {
        transaction: [{
          address: responseData.address,
          abi: responseData.abi,
          functionName: responseData.functionName,
          args: [responseData.args],
        }],
      };
  
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction(transac);

      if(finalPayload.status === "success") {
        const postResponse = await fetch('/api/post-minteable', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            World_ID: session.user.name,
            amountMintedOnChain: responseData.args
          }),
        });
        
        if (postResponse.ok) {
          // Actualizar el estado local después de un mint exitoso
          setClicksForMint(0);
        }
      }
    } catch (error) {
      console.error("Error en el proceso de minting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = clicksForMint <= 0 || isLoading || !session?.user;

  return (
    <motion.button
      onClick={handleMint}
      disabled={isDisabled}
      className={`
        relative overflow-hidden
        bg-white/10 p-6 rounded-lg backdrop-blur-sm
        transition-all duration-300
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'}
      `}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold text-blue-300">
          {isLoading ? "Minteando..." : "Tokens disponibles"}
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={clicksForMint}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-4xl font-mono text-yellow-400"
          >
            {clicksForMint}
          </motion.p>
        </AnimatePresence>

        {isDisabled && (
          <p className="text-sm text-gray-400 mt-2">
            {!session?.user 
              ? "Conecta tu wallet para mintear"
              : clicksForMint <= 0 
                ? "No hay tokens disponibles para mintear"
                : "Procesando transacción..."}
          </p>
        )}
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}