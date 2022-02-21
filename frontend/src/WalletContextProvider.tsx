import type { JsonRpcSigner } from '@ethersproject/providers'

import { useWeb3 } from '@3rdweb/hooks';
import nullthrows from "nullthrows";
import { ReactNode, createContext, useContext, } from "react";

interface WalletContextDataType {
    currentAddress: string | null,
    currentChainId: number | null,
    signer: JsonRpcSigner | null,
};

const walletContextDefaultValue
    : WalletContextDataType | null = null;

const WalletContext =
    createContext<WalletContextDataType | null>(
        walletContextDefaultValue,
    );

function WalletContextProvider({
    children,
}: {
    children: ReactNode,
}) {
    const {
        address: currentAddress,
        provider,
        chainId: currentChainId,
    } = useWeb3();
    const signer = provider?.getSigner();

    return (
        <WalletContext.Provider value={{
            currentAddress: currentAddress ?? null,
            currentChainId: currentChainId ?? null,
            signer: signer ?? null,
        }}>
            {children}
        </WalletContext.Provider>
    );
}

function useWalletContext() {
    const WalletDataNullable = useContext(WalletContext);

    return nullthrows(
        WalletDataNullable,
        "Context should not be used outside context provider",
    );
}

export {
    WalletContextProvider,
    WalletContext,
    useWalletContext,
};