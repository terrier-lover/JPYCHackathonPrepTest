import QuizState from "../utils/QuizState";
import QuizTop from "./QuizTop";
import QuizQuestion from "./QuizQuestion";
import QuizCompleted from "./QuizCompleted";
import { useQuizStateContext } from "../contexts/QuizStateContextProvider";
import QuizComponentAnimatePresense from "./QuizComponentAnimatePresense";
import CommonErrorBoundary from "./CommonErrorBoundary";

export default function QuizComponent() {
    const { currentQuizState } = useQuizStateContext();

    let component;
    switch (currentQuizState) {
        case QuizState.TOP:
            component = <CommonErrorBoundary><QuizTop /></CommonErrorBoundary>;
            break;
        case QuizState.QUESTIONS:
            component = <CommonErrorBoundary><QuizQuestion /></CommonErrorBoundary>;
            break;
        case QuizState.COMPLETED:
            component = <CommonErrorBoundary><QuizCompleted /></CommonErrorBoundary>;
            break;
    }

    return (
        <QuizComponentAnimatePresense>
            {component}
        </QuizComponentAnimatePresense>
    );
}