import QuizRoot from "./QuizRoot";
import { QuizStateContextProvider } from "./QuizStateContextProvider";
import { useWalletContext } from "./WalletContextProvider";

export default function QuizWeb3Root() {
    const { currentAddress } = useWalletContext();

    console.log('currentAddress', currentAddress);
    return (
        <QuizStateContextProvider key={`QuizWeb3Root-${currentAddress}`}>
            <QuizRoot />
        </QuizStateContextProvider>
    );
}