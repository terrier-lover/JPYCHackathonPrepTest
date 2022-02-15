import Card from "./certification.svg";
import { Center, Text } from '@chakra-ui/react'

export default function CertificationCard() {
    return (
        <div style={{ position: "relative" }}>
            <img
                src={Card}
                style={{
                    width: "270px",
                    display: "block",
                }}
                alt="CertificationCard"
            />
            <Center 
                position="absolute" 
                top="15px" 
                left="15px" 
                height='30px' 
                width='50px'
                bgGradient="linear(to-r, #865325, #b3671f)"
                borderRadius="10px"
            >
                <Text color="white" fontWeight="bold" fontSize="xl">見本</Text>
            </Center>
        </div>
    );
}