import QuizRoot from "./QuizRoot";

import ThirdwebProviderWrapper from "./ThirdwebProviderWrapper";
import QuizAndWalletContainer from "./QuizAndWalletContainer";

export default function App() {
  return (
    <ThirdwebProviderWrapper>
      <QuizRoot>
        <QuizAndWalletContainer />
      </QuizRoot>
    </ThirdwebProviderWrapper>
  );
}