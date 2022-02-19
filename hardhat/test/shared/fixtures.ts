import type {
    JPYCQuiz as JPYCQuizType,
} from "../../typechain";

import { setQuestionsInfo, setQuizEventAndQuestionsSkelton } from './utils';
import { getSha256Hash } from '../../utils/QuizUtils';

function makeQuestions(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `質問${key}`);
}

function makeSelectionLabels(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `選択肢${key}`);
}

function makeSelectionIDs(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => {
        // return string which has similar value with ulid
        return `01ARZ3NDEKTSV4RRFFQ69G5FA${key.toString(10)}`;
    });
}

function makeSelectionInfo(numOfQuestions: number) {
    const numOfSelections = 2;

    return Array.from(Array(numOfQuestions).keys()).map(
        key => {
            return {
                numOfSelections,
                solutionIndex: numOfSelections - (key % 2 == 0 ? 1 : 2),
            };
        }
    );
}

async function makeQuizQuestions(options: {
    JPYCQuiz: JPYCQuizType,
    quizName: string,
    numOfQuestions: number,
    minNumOfPasses: number,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number,
    }[],
    useBinarySelections: boolean,
}) {
    const { 
        JPYCQuiz, 
        quizName, 
        numOfQuestions, 
        minNumOfPasses, 
        questionSelectionsInfo,
        useBinarySelections,
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
                solutionHash: getSha256Hash(selectionIDs[solutionIndex]),
                useBinarySelections,
            };
        },
    );
    await setQuestionsInfo(JPYCQuiz, questionSelections);

    return { questions, questionSelections }
}

export { makeQuestions, makeQuizQuestions, makeSelectionInfo };
