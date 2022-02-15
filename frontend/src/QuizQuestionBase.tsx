import { VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import QuizProgressBar from "./QuizProgressBar";

export default function QuizQuestionBase({ children }: { children: ReactNode }) {
  return (
    <VStack height="100%" marginTop={0}>
      <QuizProgressBar />
      {children}
    </VStack>
  );
}