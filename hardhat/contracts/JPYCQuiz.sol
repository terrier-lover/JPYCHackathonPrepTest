//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {IJPYCQuizRewardNFT} from "./JPYCQuizRewardNFT.sol";

contract JPYCQuiz is Ownable {
    error QuestionIDShouldBeNonZero();
    error MinNumOfPassesShouldBeNonZero();
    error QuestionSelectionsNumberShouldMatch();
    error MinNumOfPassesShouldBeLowerThanOrEqualToNumOfQuestions(uint256 numOfQuestions);
    error AnswerNumberDoesNotMatch();
    error IsUserAlreadyPassed(address sender);

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
    mapping(address => mapping(uint256 => UserAnswerHistory)) _userAnserStatusMap;
    QuizEvent public _quizEvent;
    IJPYCQuizRewardNFT public _mintRewardContract;
    // Initial value is 0. But the actual version starts from 1.
    Counters.Counter private _eventVersionID;

    constructor(address mintRewardContract_) {
        _mintRewardContract = IJPYCQuizRewardNFT(mintRewardContract_);
    }

    function getQuizEvent()
        public
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
        public
        view
        returns (
            uint256 questionID,
            string memory question,
            string[] memory selectionLabels,
            string[] memory selectionIDs
        )
    {
        if (questionID_ == 0) {
            revert QuestionIDShouldBeNonZero();
        }

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
        uint256 mintedTokenId = _mintRewardContract.mintFromRewardCaller(_msgSender());

        emit LogMintReward(_msgSender(), mintedTokenId, isAdmin_);
    }

    function ownerMintRewardBypassCheck() public onlyOwner {
        mintReward(true);
    }

    function setMintRewardContract(address mintRewardContract_)
        public
        onlyOwner
    {
        _mintRewardContract = IJPYCQuizRewardNFT(mintRewardContract_);
    }

    function setQuestionInfo(
        uint256 questionID_,
        string[] memory selectionLabels_,
        string[] memory selectionIDs_,
        string memory solutionHash_
    ) public onlyOwner {
        if (questionID_ == 0) {
            revert QuestionIDShouldBeNonZero();
        }

        // questionID_ will never be less than or equals to 0
        unchecked {
            questionID_ -= 1;
        }
        QuestionInfo storage questionInfo = _quizEvent.questionsInfo[
            questionID_
        ];

        if (selectionIDs_.length != selectionLabels_.length) {
            revert QuestionSelectionsNumberShouldMatch();
        }

        questionInfo.selectionLabels = selectionLabels_;
        questionInfo.solutionHash = solutionHash_;
        questionInfo.selectionIDs = selectionIDs_;

        emit LogSetQuestionInfo(questionID_);
    }

    function setQuestionStatement(uint256 questionID_, string memory question_)
        public
        onlyOwner
    {
        if (questionID_ == 0) {
            revert QuestionIDShouldBeNonZero();
        }

        unchecked {
            _quizEvent.questionsInfo[questionID_ - 1].question = question_;
        }
    }

    function setQuizEventAndQuestionsSkelton(
        string memory quizName_,
        string[] memory questions_,
        uint256 minNumOfPasses_
    ) public onlyOwner {
        if (minNumOfPasses_ == 0) {
            revert MinNumOfPassesShouldBeNonZero();
        }

        uint256 sentNumOfQuestions = questions_.length;
        if (sentNumOfQuestions < minNumOfPasses_) {
            revert MinNumOfPassesShouldBeLowerThanOrEqualToNumOfQuestions(sentNumOfQuestions);
        }

        _quizEvent.quizName = quizName_;
        _quizEvent.minNumOfPasses = minNumOfPasses_;
        _eventVersionID.increment();
        _quizEvent.versionID = _eventVersionID.current();
        for (uint256 i = 0; i < sentNumOfQuestions; ) {
            _quizEvent.questionsInfo.push();
            _quizEvent.questionsInfo[i].questionID = i + 1;
            _quizEvent.questionsInfo[i].question = questions_[i];
            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev Return true if user has already passed the exam. 
     */
    function getHasUserPassed() public view returns (bool) {
        address sender = _msgSender();
        _userAnserStatusMap[sender];
        uint256 currentEventVersionID = _eventVersionID.current();

        for (uint256 i = 1; i <= currentEventVersionID; ) {
            if (_userAnserStatusMap[sender][currentEventVersionID].hasSentCorrectAnswer) {
                return true;
            }
            unchecked {
                i++;
            }
        }
        return false;
    }

    /**
     * @dev Set answer hashes send by users. If it exceeds the threshold, mint NFT. 
     */
    function setUserAnswerHashes(string[] memory answerHashes_) public {
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

    function setQuizEnd(bool quizEnded_) public onlyOwner {
        _quizEvent.quizEnded = quizEnded_;
    }

    function setQuizName(string memory quizName_) public onlyOwner {
        _quizEvent.quizName = quizName_;
    }

    function setMinNumOfPasses(uint256 minNumOfPasses_) public onlyOwner {
        _quizEvent.minNumOfPasses = minNumOfPasses_;
    }

    function getAnswerHistories()
        public
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

    function getCurrentEventVersionID() public view returns (uint256) {
        return _eventVersionID.current();
    }

    function getHash(string memory str) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }
}
