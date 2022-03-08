//SPDX-License-Identifier: Unlicense
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
    mapping(address => mapping(uint256 => UserAnswerHistory)) private _userAnserStatusMap;
    QuizEvent private _quizEvent;
    // Initial value is 0. But the actual version starts from 1.
    Counters.Counter private _eventVersionID;

    constructor(address mintRewardContract_)
        AbstractJPYCQuizAccessControl(address(0), mintRewardContract_)
    {}

    function getQuizEligiblity()
        external
        view
        onlyWhenEligibleTargetExist
        returns (bool, QuizStatus)
    {
        if (getHasUserPassed()) {
            return (false, QuizStatus.USER_HAS_SOLVED);
        }

        return IJPYCQuizEligibility(_eligibleTarget).getQuizEligiblity();
    }

    function getIsQuizEnded() external view returns (bool) {}

    function getQuizEvent()
        external
        view
        returns (
            string memory quizName,
            uint256 numOfQuestions,
            uint256 minNumOfPasses,
            bool quizEnded
        )
    {
        quizName = _quizEvent.quizName;
        numOfQuestions = _quizEvent.questionsInfo.length;
        minNumOfPasses = _quizEvent.minNumOfPasses;
        quizEnded = _quizEvent.quizEnded;
    }

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

    function compareStrings(string memory a_, string memory b_)
        private
        pure
        returns (bool)
    {
        return getHash(a_) == getHash(b_);
    }

    function mintReward(bool isAdmin_) private {
        emit LogMintReward(
            _msgSender(),
            IJPYCQuizRewardNFT(_eligibleTarget).mintFromRewardCaller(
                _msgSender()
            ),
            isAdmin_
        );
    }

    function ownerMintRewardBypassCheck()
        external
        onlyOwner
        onlyWhenEligibleTargetExist
    {
        mintReward(true);
    }

    function setQuestionInfo(
        uint256 questionID_,
        string[] memory selectionLabels_,
        string[] memory selectionIDs_,
        string memory solutionHash_
    ) external onlyOwner {
        _questionIDCheck(questionID_);

        if (selectionIDs_.length != selectionLabels_.length) {
            revert QuestionSelectionsNumberShouldMatch();
        }

        // questionID_ will never be less than or equals to 0
        unchecked {
            questionID_ -= 1;
        }
        QuestionInfo storage questionInfo = _quizEvent.questionsInfo[
            questionID_
        ];

        questionInfo.selectionLabels = selectionLabels_;
        questionInfo.solutionHash = solutionHash_;
        questionInfo.selectionIDs = selectionIDs_;

        emit LogSetQuestionInfo(questionID_);
    }

    function setQuestionStatement(uint256 questionID_, string memory question_)
        external
        onlyOwner
    {
        _questionIDCheck(questionID_);

        unchecked {
            _quizEvent.questionsInfo[questionID_ - 1].question = question_;
        }
    }

    function setQuizEventAndQuestionsSkelton(
        string memory quizName_,
        string[] memory questions_,
        uint256 minNumOfPasses_
    ) external onlyOwner {
        if (minNumOfPasses_ == 0) {
            revert MinNumOfPassesShouldBeNonZero();
        }

        uint256 sentNumOfQuestions = questions_.length;
        if (sentNumOfQuestions < minNumOfPasses_) {
            revert MinNumOfPassesShouldBeLowerThanOrEqualToNumOfQuestions(
                sentNumOfQuestions
            );
        }

        _quizEvent.quizName = quizName_;
        _quizEvent.minNumOfPasses = minNumOfPasses_;
        _eventVersionID.increment();
        _quizEvent.versionID = _eventVersionID.current();
        for (uint256 i = 0; i < sentNumOfQuestions; ) {
            _quizEvent.questionsInfo.push();
            _quizEvent.questionsInfo[i].question = questions_[i];
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
    function setUserAnswerHashes(string[] memory answerHashes_)
        external
        onlyWhenEligibleTargetExist
    {
        if (answerHashes_.length != _quizEvent.questionsInfo.length) {
            revert AnswerNumberDoesNotMatch();
        }
        if (getHasUserPassed()) {
            revert IsUserAlreadyPassed(_msgSender());
        }

        uint256 numOfCorrectAnswers = 0;
        for (uint256 i = 0; i < answerHashes_.length; ) {
            if (
                compareStrings(
                    answerHashes_[i],
                    _quizEvent.questionsInfo[i].solutionHash
                )
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
            mintReward(false);
            history.hasSentCorrectAnswer = hasPassed;
        }

        history.answers.push(
            UserAnswer({hasPassed: hasPassed, hashes: answerHashes_})
        );

        emit LogUserAnswer(_msgSender(), hasPassed);
    }

    function setQuizEnd(bool quizEnded_) external onlyOwner {
        _quizEvent.quizEnded = quizEnded_;
    }

    function setQuizName(string memory quizName_) external onlyOwner {
        _quizEvent.quizName = quizName_;
    }

    function setMinNumOfPasses(uint256 minNumOfPasses_) external onlyOwner {
        _quizEvent.minNumOfPasses = minNumOfPasses_;
    }

    function getAnswerHistories()
        external
        view
        returns (bool hasSentCorrectAnswer, bool[] memory hasPassedList)
    {
        UserAnswerHistory memory history = _userAnserStatusMap[_msgSender()][
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

    function getCurrentEventVersionID() external view returns (uint256) {
        return _eventVersionID.current();
    }

    function getHash(string memory str) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }

    function _questionIDCheck(uint256 questionID_) private pure {
        if (questionID_ == 0) {
            revert QuestionIDShouldBeNonZero();
        }
    }
}
