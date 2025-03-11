// types/wallet.ts
export type Transaction = {
    id: string
    type: 'deposit' | 'withdraw' | 'transfer' | 'swap'
    amount: number
    token: 'ETH' | 'DAPP' | 'USDC'
    date: number
    status: 'pending' | 'completed' | 'failed'
    hash?: string
}

export type TokenBalance = {
    ETH: number
    DAPP: number
    USDC: number
}