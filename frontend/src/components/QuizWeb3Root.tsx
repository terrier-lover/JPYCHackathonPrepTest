import { usePrevious } from "@chakra-ui/react";
import { useEffect } from "react";
import QuizRoot from "./QuizRoot";
import { QuizStateContextProvider } from "../contexts/QuizStateContextProvider";
import { useWalletContext } from "../contexts/WalletContextProvider";

export default function QuizWeb3Root() {
    const { currentAddress } = useWalletContext();
    const previousAddress = usePrevious(currentAddress);

    useEffect(() => {
        // When switching from Wallet to wallet
        if (
            previousAddress != null 
            && currentAddress != null 
            && previousAddress !== currentAddress
        ) {
            window.location.reload();
            return;
        }
        // When locking the current wallet
        if (previousAddress != null && currentAddress == null) {
            console.log('locking the current wallet');
            window.location.reload();
            return;
        }
    }, [previousAddress, currentAddress]);

    return (
        <QuizStateContextProvider>
            <QuizRoot />
        </QuizStateContextProvider>
    );
}