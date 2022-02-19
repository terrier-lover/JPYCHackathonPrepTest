import { useWeb3 } from '@3rdweb/hooks';
import { usePrevious } from '@chakra-ui/react';
import type { JsonRpcSigner } from '@ethersproject/providers'

import nullthrows from "nullthrows";
import React from 'react';
import { ReactNode, createContext, useContext, useEffect, useRef } from "react";

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

    const fragmentKeyRef = useRef(0);
    const previousAddress = usePrevious(currentAddress);

    useEffect(() => {
        if (currentAddress == null || previousAddress == null) {
            return;
        }
        if (previousAddress < currentAddress) {
            fragmentKeyRef.current = fragmentKeyRef.current + 1
        }
    }, [previousAddress, currentAddress]);

    useEffect(() => {
        return () => {
            fragmentKeyRef.current = 0;
        };
    }, []);

    return (
        <WalletContext.Provider value={{
            currentAddress: currentAddress ?? null,
            currentChainId: currentChainId ?? null,
            signer: signer ?? null,
        }}>
            <React.Fragment key={`fragmentKey-${fragmentKeyRef.current}`}>
                {children}
            </React.Fragment>
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