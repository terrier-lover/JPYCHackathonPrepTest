//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

interface IJPYCQuizEligibility {
    enum QuizStatus { 
        IS_USER_ELIGIBLE,
        USER_HAS_SOLVED,
        USER_HAS_MINTED,
        QUIZ_NOT_READY, 
        QUIZ_NFT_SOURCE_NOT_READY,
        QUIZ_NFT_NOT_READY,
        INVALID_OPERATION
    }

    function getQuizEligiblity() external view returns(bool, QuizStatus);
}