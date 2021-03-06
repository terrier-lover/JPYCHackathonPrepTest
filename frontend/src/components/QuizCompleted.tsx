import { Center, Link, Button, HStack, VStack, Text } from "@chakra-ui/react";
import { LINK_HACKATHON_MAIN_PAGE } from "../CustomInputs";
import CommonErrorBoundary from "./CommonErrorBoundary";
import QuizCompletedMintedNFT from "./QuizCompletedMintedNFT";

export default function QuizCompleted() {
    return (
        <HStack
            justify="space-between"
            align="start"
            marginTop="16px"
        >
            <CommonErrorBoundary>
                <QuizCompletedMintedNFT />
            </CommonErrorBoundary>
            <VStack
                width="400px"
                height="100%"
            >
                <Text
                    fontWeight="extrabold"
                    color="#EEC465"
                    fontSize="3xl"
                    fontFamily="sans-serif"
                    display="block"
                    align="center"
                    textShadow="0 0 5px #95632E"
                    marginTop="40px"
                    marginBottom="44px"
                >
                    おめでとうございます!!
                </Text>
                <Text
                    color="white"
                    fontSize="2xl"
                    display="block"
                    textShadow="0 0 5px #0972AF"
                >
                    事前テストの合格点を超えたため、合格証を発行します。
                </Text>
                <Center paddingTop="60px">
                    <Link
                        textDecoration="none"
                        href={LINK_HACKATHON_MAIN_PAGE}
                        _hover={{
                            textDecoration: "none"
                        }}
                        isExternal>
                        <Button
                            bgGradient="linear(to-r, #865325, #b3671f)"
                            color="#ffffff"
                            size="lg"
                            _hover={{
                                bgGradient: "linear(to-r, #6b421d, #9e5b1b)",
                            }}
                            _active={{
                                bgGradient: "linear(to-r, #523216, #804a17)"
                            }}
                        >
                            ハッカソンメインページに行く
                        </Button>
                    </Link>
                </Center>
            </VStack>
        </HStack>
    );
}