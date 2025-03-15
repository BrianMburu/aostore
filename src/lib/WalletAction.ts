// lib/validations.ts
import { z } from 'zod'

export const transactionSchema = z.object({
    amount: z.number().positive(),
    token: z.enum(['ETH', 'DAPP', 'USDC']),
    recipient: z.string().optional()
}).refine(data => {
    if (data.recipient && !/^0x[a-fA-F0-9]{40}$/.test(data.recipient)) {
        return false
    }
    return true
}, {
    message: "Invalid Ethereum address",
    path: ["recipient"]
})

export const swapSchema = z.object({
    fromAmount: z.number().positive(),
    fromToken: z.enum(['ETH', 'DAPP', 'USDC']),
    toToken: z.enum(['ETH', 'DAPP', 'USDC'])
})