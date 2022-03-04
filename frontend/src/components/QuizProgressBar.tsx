import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Progress } from "@chakra-ui/react";
import useQuizPreviousAndNextClick from "../hooks/useQuizPreviousAndNextClick";

export default function QuizProgressBar() {
    const { 
        progressValue, 
        onPreviousClick, 
        onNextClick, 
        isNextButtonDisabled 
    } = useQuizPreviousAndNextClick();

    return (
        <HStack justify="space-between" width="100%" marginBottom="8px">
            <IconButton
                aria-label="previous"
                colorScheme="green"
                icon={<ArrowBackIcon />}
                onClick={onPreviousClick}
            />
            <Progress 
                colorScheme="green" 
                size="sm" 
                value={progressValue} 
                width="100%" 
            />
            <IconButton
                aria-label="next"
                colorScheme="green"
                icon={<ArrowForwardIcon />}
                disabled={isNextButtonDisabled}
                onClick={onNextClick}
            />
        </HStack>
    );
}