import QuizState from "./QuizState";
import QuizTop from "./QuizTop";
import QuizQuestion from "./QuizQuestion";
import QuizCompleted from "./QuizCompleted";
import { useQuizStateContext } from "./QuizStateContextProvider";
import QuizComponentAnimatePresense from "./QuizComponentAnimatePresense";
import { useWalletContext } from "./WalletContextProvider";
import { usePrevious } from "@chakra-ui/react";
import { useEffect } from "react";

export default function QuizComponent() {
    const { currentAddress } = useWalletContext();
    const { currentQuizState, setCurrentQuizState } = useQuizStateContext();
    const previousAddress = usePrevious(currentAddress);

    // // Detect the wallet switching
    // useEffect(() => {
    //     if (currentAddress == null || previousAddress == null) {
    //         return;
    //     }

    //     if (previousAddress !== currentAddress) {
    //         // If the wallet is different from the previous one, go to root
    //         setCurrentQuizState(QuizState.TOP);
    //     }

    // }, [ previousAddress, currentAddress, setCurrentQuizState ]);

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