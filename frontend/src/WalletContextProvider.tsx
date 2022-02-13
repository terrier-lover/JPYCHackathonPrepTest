import type { JsonRpcSigner } from '@ethersproject/providers'

import nullthrows from "nullthrows";
import { ReactNode, createContext, useContext } from "react";

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
    contextData,
}: {
    children: ReactNode,
    contextData: WalletContextDataType,
}) {
    return (
        <WalletContext.Provider value={
            contextData == null ? null : contextData}>
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