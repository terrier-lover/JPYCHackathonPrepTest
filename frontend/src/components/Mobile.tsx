import { Text, Container } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Mobile() {
    return (
        <Container
            width="100%"
            maxWidth="100%"
            height="100vh"
            paddingX="0px"
            marginX="0px"
            bgGradient="linear(to-br, #00255C, #0972AF)"
        >
            <Container
                width="100%"
                height="100vh"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/backgroundImageMin.jpg)`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPositionY: "bottom"
                }}
                paddingTop="20px"
            >
                <MobileText fontSize="2xl">
                    日本円ハッカソン 事前テストページ
                </MobileText>
                <MobileText fontSize="md" marginTop="20px">
                    横幅600px以上の表示が可能なブラウザでアクセスしてください
                </MobileText>
            </Container>
        </Container>
    );
}

function MobileText({
    children,
    fontSize,
    marginTop,
}: {
    children: ReactNode,
    fontSize: string,
    marginTop?: string,
}) {
    return (
        <Text
            marginTop={marginTop}
            fontFamily="sans-serif"
            fontWeight="extrabold"
            color="white"
            fontSize={fontSize}
            display="block"
            align="center"
            textShadow="0 0 5px #0972AF"
        >
            {children}
        </Text>
    );
}