import { ethers } from "hardhat";
import { ulid } from 'ulid';
import { promises as fs } from 'fs';

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
        useBinarySelections: true,
    };
}

function getSha256Hash(str: string) {
    return ethers.utils.sha256(
        ethers.utils.formatBytes32String(str)
    );
}

async function exportJSONString(
    jsonString: string,
    path: string,
) {
    await fs.writeFile(path, jsonString);
}

export { makeQuestionSelection, getSha256Hash, exportJSONString };