import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { useQuizStateContext } from "../contexts/QuizStateContextProvider";
import { useWalletContext } from "../contexts/WalletContextProvider";

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
    const { currentQuizState } = useQuizStateContext();
    const { currentAddress } = useWalletContext();

    return (
        <AnimatePresence>
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                }}
                key={`quizComponent-${currentQuizState}${currentAddress != null ? '-' + currentAddress: ''}`}
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