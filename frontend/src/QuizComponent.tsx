import Navigation from "./Navigation";
import { useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";
import QuizTop from "./QuizTop";
import { motion, AnimatePresence } from 'framer-motion'
import QuizQuestion from "./QuizQuestion";
import QuizCompleted from "./QuizCompleted";

const CARD_ANIMATION_VARIANTS = {
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
                duration: 0.4,
            }
        }
    }
};

export default function QuizComponent() {
    const { currentQuizState } = useQuizContext();

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
        <>
            <Navigation />
            <AnimatePresence>
                <motion.div
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    key={`quizComponent-${currentQuizState}`}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={CARD_ANIMATION_VARIANTS}
                >
                    {component}
                </motion.div>
            </AnimatePresence>
        </>
    );
}