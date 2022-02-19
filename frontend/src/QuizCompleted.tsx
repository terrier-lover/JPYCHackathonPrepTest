import { Center, Link, Button, HStack, VStack, Text } from "@chakra-ui/react";
import Card from "./certification.svg";

export default function QuizCompleted() {
    return (
        <HStack
            justify="space-between"
            align="start"
            marginTop="16px"
        >
            <img
                src={Card}
                style={{
                    width: "270px",
                    display: "block",
                }}
                alt="CertificationCard"
            />
            <VStack
                width="400px"
                height="100%"
            >
                <Text
                    fontWeight="extrabold"
                    color="#EEC465"
                    fontSize="4xl"
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
                    事前テストの合格点を超えたため、合格書を発行します。
                </Text>
                <Center paddingTop="60px">
                    <Link
                        textDecoration="none"
                        href="#"
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