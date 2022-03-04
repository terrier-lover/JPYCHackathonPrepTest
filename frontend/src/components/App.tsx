import ThirdwebProviderWrapper from "../contexts/ThirdwebProviderWrapper";
import { WalletContextProvider } from "../contexts/WalletContextProvider";
import QuizWeb3Root from "./QuizWeb3Root";
import { ReactNode } from "react";
import { useMediaQuery } from '@chakra-ui/react';
import Mobile from "./Mobile";

export default function App() {
  return (
      <ThirdwebProviderWrapper>
        <DisplayHandler>
          <WalletContextProvider>
            <QuizWeb3Root />
          </WalletContextProvider>
        </DisplayHandler>
      </ThirdwebProviderWrapper>
  );
}

function DisplayHandler({ children }: {children: ReactNode}) {
  const [ isLargerThan600 ] = useMediaQuery('(min-width: 600px)');

  if (!isLargerThan600) {
    return <Mobile />;
  }

  return <>{children}</>;
}