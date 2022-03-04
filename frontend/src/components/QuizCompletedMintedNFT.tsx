import nullthrows from "nullthrows";
import { useQuery } from "react-query";
import {
    DEFAULT_RETRY,
    getContracts,
    QUERY_KEY_GET_TOKEN_URI_FOR_INTER,
} from "../utils/QuizContractsUtils";
import { useWalletContext } from "../contexts/WalletContextProvider";
import FallbackCard from "../misc/certification.svg";
import { Skeleton } from "@chakra-ui/react";
import { utils } from "ethers"; 

export default function QuizCompletedMintedNFT() {
    const {
        currentAddress: currentAddressNullable,
        signer: signerNullable,
        currentChainId: currentChainIdNullable,
    } = useWalletContext();
    const signer = nullthrows(signerNullable);
    const currentAddress = nullthrows(currentAddressNullable);
    const currentChainId = nullthrows(currentChainIdNullable);

    const { jpycQuizReward } = getContracts(signer, currentChainId);

    const getTokenURIForMinter = jpycQuizReward.getTokenURIForMinter(currentAddress);
    const { isLoading, isError, data } = useQuery(
        QUERY_KEY_GET_TOKEN_URI_FOR_INTER,
        () => getTokenURIForMinter,
        {
            retry: DEFAULT_RETRY,
            refetchOnWindowFocus: false,
        },
    );

    let imageSrc = FallbackCard;
    if (!isError && data != null && typeof data === "string") {
        const base64Result = data.split(',')[1];
        const decodedJson = utils.base64.decode(base64Result);
        const nftInfoObject = JSON.parse(new TextDecoder("utf-8").decode(decodedJson));
        imageSrc = nftInfoObject.image ?? FallbackCard;
    }

    return (
        <FallbackCardNode imageSrc={imageSrc} isLoading={isLoading} />
    );
};

function FallbackCardNode({
    imageSrc,
    isLoading,
}: {
    imageSrc: string,
    isLoading: boolean,
}) {
    if (isLoading) {
        return <Skeleton width="270px" height="419.15px" borderRadius="16px" />;
    }

    return (
        <img
            src={imageSrc}
            style={{
                width: "270px",
                display: "block",
            }}
            alt="CertificationCard"
        />
    );
}