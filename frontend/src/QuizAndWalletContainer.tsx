import QuizContainer from "./QuizContainer";
import { useWeb3 } from "@3rdweb/hooks";
import { WalletContextProvider } from "./WalletContextProvider";

export default function Web3Container() {
    const {
        address: currentAddress,
        provider,
        chainId: currentChainId,
        error,
    } = useWeb3();
    const signer = provider?.getSigner();

    return (
        <WalletContextProvider contextData={{
            currentAddress: currentAddress ?? null,
            currentChainId: currentChainId ?? null,
            signer: signer ?? null,
        }}>
            <QuizContainer />
        </WalletContextProvider>
    );
}