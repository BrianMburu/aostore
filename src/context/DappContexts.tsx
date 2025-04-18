// src/context/DappContexts.tsx
import { createContext } from 'react';
import { Dapp } from '@/types/dapp';

export const AppDataContext = createContext<Dapp | null>(null);
export const AppLoadingContext = createContext<boolean>(false);
