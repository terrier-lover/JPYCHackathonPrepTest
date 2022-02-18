import QuizLayout from "./QuizLayout";

import ThirdwebProviderWrapper from "./ThirdwebProviderWrapper";
import { WalletContextProvider } from "./WalletContextProvider";
import { QuizStateContextProvider } from "./QuizStateContextProvider";
import QuizComponentAnimatePresense from "./QuizComponentAnimatePresense";
import QuizContainer from "./QuizContainer";
import QuizComponent from "./QuizComponent";
import Navigation from "./Navigation";

export default function App() {
  return (
    <ThirdwebProviderWrapper>
      <QuizStateContextProvider>
        <QuizLayout>
          <WalletContextProvider>
            <Navigation />
            <QuizContainer>              
              <QuizComponentAnimatePresense>
                <QuizComponent />
              </QuizComponentAnimatePresense>
            </QuizContainer>
          </WalletContextProvider>
        </QuizLayout>
      </QuizStateContextProvider>
    </ThirdwebProviderWrapper>
  );
}