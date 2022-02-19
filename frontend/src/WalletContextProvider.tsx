import { useWeb3 } from '@3rdweb/hooks';
import { usePrevious } from '@chakra-ui/react';
import type { JsonRpcSigner } from '@ethersproject/providers'

import nullthrows from "nullthrows";
import React, { useEffect } from 'react';
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

let fragmentKey = 0;

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

    const previousAddress = usePrevious(currentAddress);

    console.log("### Start ");
    console.log({ currentAddress });
    console.log({ previousAddress });
    if (
        currentAddress != null
        && previousAddress != null
        && previousAddress !== currentAddress
    ) {
        console.log("currentAddress != null", currentAddress != null);
        console.log("previousAddress != null", previousAddress != null);
        console.log("previousAddress !== currentAddress", previousAddress !== currentAddress);
        // If the wallet is different from the previous one, increase the key
        fragmentKey = fragmentKey + 1;
    }    
    console.log({ fragmentKey });
    // // Detect the wallet switching
    // useEffect(() => {
    //     if (currentAddress == null || previousAddress == null) {
    //         return;
    //     }

    //     if (previousAddress !== currentAddress) {
    //         // If the wallet is different from the previous one, increase the key
    //         fragmentKey++;
    //     }

    // }, [ previousAddress, currentAddress ]);

    return (
        <WalletContext.Provider value={{
            currentAddress: currentAddress ?? null,
            currentChainId: currentChainId ?? null,
            signer: signer ?? null,
        }}>
            <React.Fragment key={`fragmentKey-${fragmentKey}`}>
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