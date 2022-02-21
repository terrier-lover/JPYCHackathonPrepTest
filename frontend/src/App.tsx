import ThirdwebProviderWrapper from "./ThirdwebProviderWrapper";
import { WalletContextProvider } from "./WalletContextProvider";
import QuizWeb3Root from "./QuizWeb3Root";

export default function App() {
  return (
      <ThirdwebProviderWrapper>
        <WalletContextProvider>
          <QuizWeb3Root />
        </WalletContextProvider>
      </ThirdwebProviderWrapper>
  );
}