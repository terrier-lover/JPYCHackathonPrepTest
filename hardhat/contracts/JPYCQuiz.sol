//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {IJPYCQuizRewardNFT} from "./JPYCQuizRewardNFT.sol";
import {IJPYCQuizEligibility} from "./IJPYCQuizEligibility.sol";
import {AbstractJPYCQuizAccessControl} from "./AbstractJPYCQuizAccessControl.sol";

contract JPYCQuiz is
    Ownable,
    IJPYCQuizEligibility,
    AbstractJPYCQuizAccessControl
{
    error QuestionIDShouldBeNonZero();
    error MinNumOfPassesShouldBeNonZero();
    error QuestionSelectionsNumberShouldMatch();
    error MinNumOfPassesShouldBeLowerThanOrEqualToNumOfQuestions(
        uint256 numOfQuestions_
    );
    error AnswerNumberDoesNotMatch();
    error IsUserAlreadyPassed(address sender_);
    error NotEnoughQuestionSize();
    error AdminOnlyOperation();

    using Counters for Counters.Counter;

    event LogSetQuestionInfo(uint256 indexed questionId_);
    event LogUserAnswer(address indexed userAddress_, bool hasPassed_);
    event LogMintReward(
        address indexed userAddress_,
        uint256 indexed mintedTokenId_,
        bool isAdmin_
    );

    struct QuestionInfo {
        uint256 questionID; // QuestionID starts with 1
        string question;
        string[] selectionLabels;
        string[] selectionIDs;
        string solutionHash; // Store solution in a hash format
    }

    struct QuizEvent {
        string quizName;
        uint256 minNumOfPasses; // If correct answers surpass minimumNumOfPasses, user can pass the quiz.
        QuestionInfo[] questionsInfo;
        bool quizEnded;
        uint256 versionID; // Increment this value when updating the quiz
    }

    struct UserAnswerHistory {
        bool hasSentCorrectAnswer;
        UserAnswer[] answers;
    }

    struct UserAnswer {
        bool hasPassed;
        string[] hashes; // Store answers in a hash format
    }

    // User address to event versionID to user answer history
    mapping(address => mapping(uint256 => UserAnswerHistory))
        private _userAnserStatusMap;
    QuizEvent private _quizEvent;
    // Initial value is 0. But the actual version starts from 1.
    Counters.Counter private _eventVersionID;

    constructor(address mintRewardContract_)
        AbstractJPYCQuizAccessControl(address(0), mintRewardContract_)
    {}

    /**
     * @dev Check if the caller can take quiz. The first argument represents the
     * status, and the second argument shows the quiz status. It calls the other
     * contracts to get the status.
     */
    function getQuizEligiblity() external view returns (bool, QuizStatus) {
        if (_eligibleTarget == address(0)) {
            return (false, QuizStatus.QUIZ_NOT_READY);
        }

        if (getHasUserPassed()) {
            return (false, QuizStatus.USER_HAS_SOLVED);
        }

        return IJPYCQuizEligibility(_eligibleTarget).getQuizEligiblity();
    }

    /**
     * @dev Get basic quiz event with version info.
     */
    function getQuizEvent()
        external
        view
        returns (
            string memory quizName,
            uint256 numOfQuestions,
            uint256 minNumOfPasses,
            bool quizEnded,
            uint256 versionID
        )
    {
        quizName = _quizEvent.quizName;
        numOfQuestions = _quizEvent.questionsInfo.length;
        minNumOfPasses = _quizEvent.minNumOfPasses;
        quizEnded = _quizEvent.quizEnded;
        versionID = _eventVersionID.current();
    }

    /**
     * @dev Given questionID, returns the detailed question info.
     */
    function getQuestionInfo(uint256 questionID_)
        external
        view
        returns (
            uint256 questionID,
            string memory question,
            string[] memory selectionLabels,
            string[] memory selectionIDs
        )
    {
        _questionIDCheck(questionID_);

        // questionID_ will never be less than or equals to 0
        unchecked {
            questionID_ -= 1;
        }
        QuestionInfo memory questionInfo = _quizEvent.questionsInfo[
            questionID_
        ];
        questionID = questionInfo.questionID;
        question = questionInfo.question;
        selectionLabels = questionInfo.selectionLabels;
        selectionIDs = questionInfo.selectionIDs;
    }

    /**
     * @dev Only able to call this function from within this contract. Can specify
     * the target person to mint.
     */
    function mintReward(address minterTarget, bool isAdmin_) private {
        uint256 tokenID = IJPYCQuizRewardNFT(_eligibleTarget).mintFromRewardCaller(
            minterTarget
        );
        emit LogMintReward(minterTarget, tokenID, isAdmin_);
    }

    /**
     * @dev Mint rewards for other users. This function can be called by the owner.
     */
    function ownerMintRewardBypassCheck(address minterTarget)
        external
        onlyOwner
    {
        _checkEligibleTargetExist();
        mintReward(minterTarget, true);
    }

    /**
     * @dev Owner uses this function to set the details of each question.
     */
    function setQuestionInfo(
        uint256 questionID_,
        string memory question_,
        string[] memory selectionLabels_,
        string[] memory selectionIDs_,
        string memory solutionHash_
    ) external onlyOwner {
        _questionIDCheck(questionID_);

        if (selectionIDs_.length != selectionLabels_.length) {
            revert QuestionSelectionsNumberShouldMatch();
        }

        // questionID_ will never be less than or equals to 0 after _questionIDCheck check
        unchecked {
            questionID_ -= 1;
        }
        QuestionInfo storage questionInfo = _quizEvent.questionsInfo[
            questionID_
        ];

        questionInfo.question = question_;
        questionInfo.selectionLabels = selectionLabels_;
        questionInfo.solutionHash = solutionHash_;
        questionInfo.selectionIDs = selectionIDs_;

        emit LogSetQuestionInfo(questionID_);
    }

    /**
     * @dev Owner is supposed to call this function first to set basic info of quiz.
     * If the owner calls this function again after the initialization, it will delete
     * the old quiz, and completely replace new one. In this case, it has new versionID.
     */
    function setQuizEventAndQuestionsSkelton(
        string memory quizName_,
        uint256 numOfQuestions_,
        uint256 minNumOfPasses_
    ) external onlyOwner {
        if (numOfQuestions_ == 0) {
            revert NotEnoughQuestionSize();
        }
        if (minNumOfPasses_ == 0) {
            revert MinNumOfPassesShouldBeNonZero();
        }

        if (numOfQuestions_ < minNumOfPasses_) {
            revert MinNumOfPassesShouldBeLowerThanOrEqualToNumOfQuestions(
                numOfQuestions_
            );
        }

        // Reset the version if a version already exists
        if (_quizEvent.versionID != 0) {
            delete _quizEvent.questionsInfo;
        }
        _quizEvent.quizName = quizName_;
        _quizEvent.minNumOfPasses = minNumOfPasses_;
        _eventVersionID.increment();
        _quizEvent.versionID = _eventVersionID.current();
        for (uint256 i = 0; i < numOfQuestions_; ) {
            _quizEvent.questionsInfo.push();
            unchecked {
                _quizEvent.questionsInfo[i].questionID = i + 1;
                i++;
            }
        }
    }

    /**
     * @dev Return true if user has already passed the exam.
     */
    function getHasUserPassed() public view returns (bool) {
        return
            _userAnserStatusMap[_msgSender()][_eventVersionID.current()]
                .hasSentCorrectAnswer;
    }

    /**
     * @dev Set answer hashes send by users. If it exceeds the threshold, mint NFT.
     */
    function setUserAnswerHashes(string[] memory answerHashes_) external {
        _checkEligibleTargetExist();

        if (answerHashes_.length != _quizEvent.questionsInfo.length) {
            revert AnswerNumberDoesNotMatch();
        }
        if (getHasUserPassed()) {
            revert IsUserAlreadyPassed(_msgSender());
        }

        uint256 numOfCorrectAnswers;
        for (uint256 i = 0; i < answerHashes_.length; ) {
            if (
                _getHash(answerHashes_[i]) ==
                _getHash(_quizEvent.questionsInfo[i].solutionHash)
            ) {
                unchecked {
                    numOfCorrectAnswers += 1;
                }
            }
            unchecked {
                i++;
            }
        }

        UserAnswerHistory storage history = _userAnserStatusMap[_msgSender()][
            _eventVersionID.current()
        ];

        bool hasPassed = numOfCorrectAnswers >= _quizEvent.minNumOfPasses;
        if (hasPassed) {
            mintReward(_msgSender(), false);
            history.hasSentCorrectAnswer = hasPassed;
        }

        history.answers.push(
            UserAnswer({hasPassed: hasPassed, hashes: answerHashes_})
        );

        emit LogUserAnswer(_msgSender(), hasPassed);
    }

    /**
     * @dev Call this function when the quiz should end.
     */
    function setQuizEnd(bool quizEnded_) external onlyOwner {
        _quizEvent.quizEnded = quizEnded_;
    }

    /**
     * @dev Call this function to change the quiz name only
     */
    function setQuizName(string memory quizName_) external onlyOwner {
        _quizEvent.quizName = quizName_;
    }

    /**
     * @dev Call this function to change the threshold of minimum numbers of the
     * thresholds for passing the quiz.
     */
    function setMinNumOfPasses(uint256 minNumOfPasses_) external onlyOwner {
        _quizEvent.minNumOfPasses = minNumOfPasses_;
    }

    /**
     * @dev Retrieves users' answer histories. Normal users can check their quiz
     * status. Only owner can get all users' answer histories.
     */
    function getAnswerHistories(address targetAddress)
        external
        view
        returns (bool hasSentCorrectAnswer, bool[] memory hasPassedList)
    {
        if (owner() != _msgSender() && targetAddress != _msgSender()) {
            revert AdminOnlyOperation();
        }

        UserAnswerHistory memory history = _userAnserStatusMap[targetAddress][
            _eventVersionID.current()
        ];
        hasSentCorrectAnswer = history.hasSentCorrectAnswer;
        UserAnswer[] memory answers = history.answers;

        hasPassedList = new bool[](answers.length);
        for (uint256 i = 0; i < answers.length; ) {
            hasPassedList[i] = answers[i].hasPassed;
            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev Use this to get the keccak256 hash.
     */
    function _getHash(string memory str) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }

    /**
     * @dev Use this function to check if the given questionID is valid.
     * Modifier can be used instead, but the modifier can increase the gas cost
     * so it uses private function here.
     */
    function _questionIDCheck(uint256 questionID_) private pure {
        if (questionID_ == 0) {
            revert QuestionIDShouldBeNonZero();
        }
    }
}
