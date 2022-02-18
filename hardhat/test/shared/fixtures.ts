import type {
    JPYCQuiz as JPYCQuizType,
} from "../../typechain";

import { setQuestionsInfo, setQuizEventAndQuestionsSkelton } from './utils';
import { ulid } from 'ulid';
import { getSha256Hash } from '../../utils/QuizUtils';

function makeQuestions(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `質問${key}`);
}

function makeSelectionLabels(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `選択肢${key}`);
}

function makeSelectionIDs(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => ulid());
}

async function makeQuizQuestions(options: {
    JPYCQuiz: JPYCQuizType,
    quizName: string,
    numOfQuestions: number,
    minNumOfPasses: number,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number,
    }[]
}) {
    const { 
        JPYCQuiz, 
        quizName, 
        numOfQuestions, 
        minNumOfPasses, 
        questionSelectionsInfo 
    } = options;

    const questions = makeQuestions(numOfQuestions);
    await setQuizEventAndQuestionsSkelton(
        JPYCQuiz,
        {
            quizName,
            questions,
            minNumOfPasses: minNumOfPasses,
        },
    );

    const questionSelections = questionSelectionsInfo.map(
        selectionInfo => {
            const { numOfSelections, solutionIndex } = selectionInfo;
            const selectionIDs = makeSelectionIDs(numOfSelections);

            return {
                selectionLabels: makeSelectionLabels(numOfSelections),
                selectionIDs,
                solutionHash: getSha256Hash(selectionIDs[solutionIndex])
            };
        },
    );
    await setQuestionsInfo(JPYCQuiz, questionSelections);

    return { questions, questionSelections }
}

export { makeQuestions, makeQuizQuestions };
