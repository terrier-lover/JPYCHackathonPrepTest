import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { useQuizStateContext } from "./QuizStateContextProvider";
import { useWalletContext } from "./WalletContextProvider";

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

export default function QuizComponentAnimatePresense({
    children
}: {
    children: ReactNode,
}) {
    const { currentAddress } = useWalletContext();
    const { currentQuizState } = useQuizStateContext();

    return (
        <AnimatePresence>
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                }}
                key={`quizComponent-${currentQuizState}-${currentAddress ?? 'empty'}`}
                initial="initial"
                animate="in"
                exit="out"
                variants={CARD_ANIMATION_VARIANTS}
            >
                {children}
              </motion.div>
         </AnimatePresence>
    );
}