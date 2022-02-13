import Card from "./certification.svg";
import { Center, Text } from '@chakra-ui/react'

export default function CertificationCard() {
    return (
        <div style={{ position: "relative" }}>
            <img
                src={Card}
                style={{
                    width: 270,
                    display: "block",
                    paddingRight: "20px"
                }}
                alt="CertificationCard"
            />
            <Center 
                position="absolute" 
                top="15px" 
                left="15px" 
                height='30px' 
                width='50px'
                bg="tomato"
                borderRadius="10px"
            >
                <Text color="white" fontWeight="bold" fontSize="xl">見本</Text>
            </Center>
        </div>
    );
}