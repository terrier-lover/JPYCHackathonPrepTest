import { Tooltip, Button } from "@chakra-ui/react";

export default function QuizActionButton({
    isButtonDisabled,
    onButtonClick,
    tooltipLabel,
    buttonLabel,
    isLoading = false,
}: {
    isButtonDisabled: boolean,
    onButtonClick: () => void,
    tooltipLabel: string,
    buttonLabel: string,
    isLoading?: boolean,
}) {
    return (
        <Tooltip label={tooltipLabel} isDisabled={!isButtonDisabled}>
            <span>
                <Button
                    colorScheme="orange"
                    size="lg"
                    disabled={isButtonDisabled || isLoading}
                    onClick={onButtonClick}
                    isLoading={isLoading}
                >
                    {buttonLabel}
                </Button>
            </span>
        </Tooltip>
    );
}