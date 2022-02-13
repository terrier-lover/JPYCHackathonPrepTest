import Navigation from "./Navigation";
import { useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";
import QuizTop from "./QuizTop";
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from "react";

const cardVariants = {
    initial: {
        opacity: 0
    },
    in: {
        opacity: 1,
        transition: {
            opacity: {
                duration: 0.4,
                delay: 0.4
            }
        }
    },
    out: {
        opacity: 0,
        transition: {
            opacity: {
                duration: 0.4
            }
        }
    }
};

export default function QuizComponent() {
    const { currentQuizState } = useQuizContext();

    const quizInfo = [
        {
            quizState: QuizState.TOP,
            component: <QuizTop />,
        },
        {
            quizState: QuizState.QUESTIONS,
            component: <>questions</>,
        },
        {
            quizState: QuizState.COMPLETED,
            component: <>completed</>,
        }
    ];

    return (
        <>
            <Navigation />
            {quizInfo.map(
                quiz => <AnimatedQuizComponents
                    currentQuizState={currentQuizState}
                    component={quiz.component}
                    quizState={quiz.quizState}
                />
            )}
        </>
    );
}

function AnimatedQuizComponents({
    currentQuizState,
    component,
    quizState
}: {
    currentQuizState: QuizState
    component: ReactNode,
    quizState: QuizState,
}) {
    return (
        <AnimatePresence>
            {currentQuizState === quizState &&
                (
                    <motion.div
                        key="quizComponent"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={cardVariants}
                    >
                        {component}
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}