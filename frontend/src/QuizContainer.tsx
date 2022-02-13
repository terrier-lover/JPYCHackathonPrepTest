import type {AnswerType, QuestionType} from "./QuizContextProvider";

import { QuizContextProvider } from "./QuizContextProvider";

export default function QuizStatesContainer() {
  // TODO: connet with quiz contracts, and get status
  const exampleQuestions: QuestionType[] = [
    {
      questionID: 0,
      question: "質問1",
      selectionLabels: ["○", "x"],
      selectionIDs: ["19283", "997755"],
    },
    {
      questionID: 1,
      question: "質問2",
      selectionLabels: ["○", "x"],
      selectionIDs: ["28374", "74655"],
    },
  ];
  const emptyAnswers: AnswerType[] = [
    {
      questionID: 0,
      selectionID: null,
    },
    {
      questionID: 1,
      selectionID: null
    }
  ];

  return (
    <QuizContextProvider 
      questions={exampleQuestions}
      answers={emptyAnswers}
      isSolved={false}
    />
  );
}
