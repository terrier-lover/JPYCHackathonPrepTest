import Navigation from "./Navigation";
import QuizComponent from "./QuizComponent";
import QuizComponentAnimatePresense from "./QuizComponentAnimatePresense";
import QuizContainer from "./QuizContainer";
import QuizLayout from "./QuizLayout";

export default function QuizRoot() {
    return (
        <QuizLayout>
            <Navigation />
            <QuizContainer>
                <QuizComponentAnimatePresense>
                    <QuizComponent />
                </QuizComponentAnimatePresense>
            </QuizContainer>
        </QuizLayout>
    );
}