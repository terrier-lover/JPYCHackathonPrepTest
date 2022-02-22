import CommonErrorBoundary from "./CommonErrorBoundary";
import Navigation from "./Navigation";
import QuizComponent from "./QuizComponent";
import QuizContainer from "./QuizContainer";
import QuizLayout from "./QuizLayout";

export default function QuizRoot() {
    return (
        <QuizLayout>
            <CommonErrorBoundary><Navigation /></CommonErrorBoundary>
            <QuizContainer>
                <CommonErrorBoundary><QuizComponent /></CommonErrorBoundary>
            </QuizContainer>
        </QuizLayout>
    );
}