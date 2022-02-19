import QuizState from "./QuizState";
import QuizTop from "./QuizTop";
import QuizQuestion from "./QuizQuestion";
import QuizCompleted from "./QuizCompleted";
import { useQuizStateContext } from "./QuizStateContextProvider";
import QuizComponentAnimatePresense from "./QuizComponentAnimatePresense";

export default function QuizComponent() {
    const { currentQuizState } = useQuizStateContext();

    let component;
    switch (currentQuizState) {
        case QuizState.TOP:
            component = <QuizTop />;
            break;
        case QuizState.QUESTIONS:
            component = <QuizQuestion />;
            break;
        case QuizState.COMPLETED:
            component = <QuizCompleted />;
            break;
    }

    return (
        <QuizComponentAnimatePresense>
            {component}
        </QuizComponentAnimatePresense>
    );
}