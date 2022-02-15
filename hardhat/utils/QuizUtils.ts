import { ethers } from "hardhat";
import { ulid } from 'ulid';

function makeQuestionSelection(
    selectionLabels: string[],
    solutionIndex: number,
) {
    if (selectionLabels.length <= solutionIndex) {
        throw "Index outbound";
    }

    const selectionIDs = selectionLabels.map(_ => ulid());
    const solutionHash = getSha256Hash(selectionIDs[solutionIndex]);

    return {
        selectionLabels,
        selectionIDs,
        solutionHash,
        solutionIndex,
    };
}

function getSha256Hash(str: string) {
    return ethers.utils.sha256(
        ethers.utils.formatBytes32String(str)
    );
}

export { makeQuestionSelection, getSha256Hash };