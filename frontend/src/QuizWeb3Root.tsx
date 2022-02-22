import { usePrevious } from "@chakra-ui/react";
import { useEffect } from "react";
import QuizRoot from "./QuizRoot";
import { QuizStateContextProvider } from "./QuizStateContextProvider";
import { useWalletContext } from "./WalletContextProvider";

export default function QuizWeb3Root() {
    const { currentAddress } = useWalletContext();
    const previousAddress = usePrevious(currentAddress);

    useEffect(() => {
        if (currentAddress == null || previousAddress == null) {
            return;
        }
        if (previousAddress !== currentAddress) {
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