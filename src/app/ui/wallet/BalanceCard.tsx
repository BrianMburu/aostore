// ui/wallet/BalanceCard.tsx
'use client'

import { TokenService } from "@/services/ao/tokenService";
import { AppTokenData } from "@/types/dapp"
import { useEffect, useState, useTransition } from "react"
import { Skeleton } from "../skeleton";
import { findPrecision } from "@/utils/ao";
import { useRank } from "@/context/RankContext";

export default function BalanceCard({ tokens, fetchingTokens, activeToken, setActiveToken }:
  {
    tokens: AppTokenData[], fetchingTokens: boolean, activeToken: AppTokenData | undefined,
    setActiveToken: React.Dispatch<React.SetStateAction<AppTokenData | undefined>>
  }) {
  const [tokenBalance, setTokenBalance] = useState<number>(0.00);
  const [fetching, startTransition] = useTransition();
  const { rank } = useRank();

  useEffect(() => {
    startTransition(
      async () => {
        try {
          if (activeToken) {
            const fetchedTokenBalance = await TokenService.fetchTokenBalance(activeToken.tokenId);

            if (activeToken && fetchedTokenBalance) {
              const tokenValue = Number(fetchedTokenBalance) / Number(activeToken.tokenDenomination);

              setTokenBalance(Number(tokenValue.toFixed(findPrecision(activeToken.tokenDenomination))) + 1)
            }
          }
        } catch (error) {
          console.error("Failed to fetch Token Balance: ", error);
        }

      })
  }, [activeToken, rank]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Current Balance</h2>
        <div className="flex items-center gap-3">
          {fetching ? <Skeleton className="h-5 w-10 animate-pulse" /> :
            <span className="text-3xl font-bold dark:text-white">{tokenBalance.toLocaleString("en-US")}</span>
          }

          {
            fetchingTokens ? (
              <Skeleton className="h-8 w-20 animate-pulse rounded-full" />
            ) : (
              <select
                value={activeToken?.tokenTicker}
                onChange={(e) => {
                  const selectedToken = tokens.find(token => token?.tokenTicker === e.target.value);
                  if (selectedToken) {
                    setActiveToken(selectedToken);
                  }
                }}
                className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
              >
                <option value="">Select Token</option>
                {tokens.length > 0 && tokens.some(token => token.tokenTicker) &&
                  tokens.map((token) =>
                    token.tokenTicker && (
                      <option key={token.tokenId} value={token.tokenTicker}>
                        {token.tokenTicker}
                      </option>
                    )
                  )
                }
              </select>
            )
          }
          {/* <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm">
            AOS
          </span> */}
        </div>
      </div>
    </div>
  )
}
