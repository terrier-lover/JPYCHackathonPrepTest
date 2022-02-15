import type { AnswerType, QuestionType } from "./QuizContextProvider";

import { QuizContextProvider } from "./QuizContextProvider";

export default function QuizStatesContainer() {
  const exampleQuestions: QuestionType[] = [
    {
      questionID: 1,
      question: "はいを選択してください。",
      selectionLabels: ["はい", "いいえ"],
      selectionIDs: ["19283", "997755"],
    },
    {
      questionID: 2,
      question: "いいえを選択してください。",
      selectionLabels: ["はい", "いいえ"],
      selectionIDs: ["28374", "74655"],
    },
    {
      questionID: 3,
      question: "長文の例:桜木町の駅に降りたのが、かれこれ九時時分だったので、私達は、先ず暗い波止場に行った。はいを選択してください。",
      selectionLabels: ["はい", "いいえ"],
      selectionIDs: ["283719284", "222234"],
    },
  ];
  const emptyAnswers: AnswerType[] = exampleQuestions.map(question => ({
    questionID: question.questionID,
    selectionID: null,
  }));

  return (
    <QuizContextProvider
      questions={exampleQuestions}
      answers={emptyAnswers}
      isSolved={false}
    />
  );
}
