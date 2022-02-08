//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {SafeMathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract JPYCQuiz is Initializable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    event LogQuizEventID(uint256 indexed eventQuizId_);

    event LogQuizQuestionID(
        uint256 indexed questionId_,
        uint256 indexed quizEventId_
    );

    event LogUserAnswer(
        address indexed userAddress_,
        uint256 indexed quizEventID_,
        bool hasPassed_
    );

    event LogMintReward(
        address indexed userAddress_,
        uint256 indexed quizEventID_
    );

    struct QuestionInfo {
        uint256 questionID;
        string question;
        string[] selectionLabels;
        string[] selectionIDs;
        bool useUniqueSelectionID;
        string solutionHash; // Store solution in a hash format
    }

    struct QuizEvent {
        uint256 quizEventID;
        string quizName;
        uint256 minNumOfPasses; // If correct answers surpass minimumNumOfPasses, user can pass the quiz.
        QuestionInfo[] questionsInfo;
    }

    struct UserAnswerHistory {
        bool hasSentCorrectAnswer;
        UserAnswer[] answers;
    }

    struct UserAnswer {
        bool hasPassed;
        string[] hashes; // Store answers in a hash format
    }

    // 1st Map: key=an address of user, value=2nd Map
    // 2nd Map: key=quizEventID, value=UserAnswerHistory
    mapping(
        address => mapping(uint256 => UserAnswerHistory)
    ) _userAndAnserStatusMap;
    QuizEvent[] public _quizEvents;
    address public _mintRewardContract;

    function initialize(address mintRewardContract_) public initializer {
        _mintRewardContract = mintRewardContract_;
        __Ownable_init();
    }

    function addQuizEventAndQuestionsSkelton(
        string memory quizName_,
        string[] memory questions_,
        uint256 minNumOfPasses_
    ) public onlyOwner {
        uint256 sentNumOfQuestions = questions_.length;
        QuestionInfo[] memory questionsInfo = new QuestionInfo[](
            sentNumOfQuestions
        );
        for (uint256 i = 0; i < sentNumOfQuestions; i = i.add(1)) {
            questionsInfo[i].questionID = i;
            questionsInfo[i].question = questions_[i];
        }

        uint256 currentNumOfEvents = _quizEvents.length;

        _quizEvents.push();
        _quizEvents[currentNumOfEvents].quizName = quizName_;
        _quizEvents[currentNumOfEvents].minNumOfPasses = minNumOfPasses_;
        for (uint256 i = 0; i < sentNumOfQuestions; i = i.add(1)) {
            _quizEvents[currentNumOfEvents].quizEventID = i;
            _quizEvents[currentNumOfEvents].questionsInfo.push();
            _quizEvents[currentNumOfEvents].questionsInfo[i] = questionsInfo[i];
        }

        emit LogQuizEventID(currentNumOfEvents);
    }

    function getAllQuizEvents()
        public
        view
        returns (
            uint256[] memory quizEventIDs,
            string[] memory quizNames,
            uint256[] memory numOfQuestions
        )
    {
        uint256 quizEventsLength = _quizEvents.length;
        quizEventIDs = new uint256[](quizEventsLength);
        quizNames = new string[](quizEventsLength);
        numOfQuestions = new uint256[](quizEventsLength);

        for (uint256 i = 0; i < quizEventsLength; i = i.add(1)) {
            quizEventIDs[i] = _quizEvents[i].quizEventID;
            quizNames[i] = _quizEvents[i].quizName;
            numOfQuestions[i] = _quizEvents[i].questionsInfo.length;
        }
    }

    function getSingleQuizEvent(uint256 quizEventID_)
        public
        view
        returns (
            string memory quizName,
            string[] memory questions,
            uint256[] memory questionIDs
        )
    {
        QuizEvent memory quizEvent = _quizEvents[quizEventID_];

        quizName = quizEvent.quizName;

        QuestionInfo[] memory questionsInfo = quizEvent.questionsInfo;
        uint256 questionsSize = questionsInfo.length;
        questions = new string[](questionsSize);
        questionIDs = new uint256[](questionsSize);
        for (uint256 i = 0; i < questionsSize; i = i.add(1)) {
            questions[i] = questionsInfo[i].question;
            questionIDs[i] = questionsInfo[i].questionID;
        }
    }

    function setQuestionInfo(
        uint256 quizEventID_,
        uint256 questionID_,
        string[] memory selectionLabels_,
        string[] memory selectionIDs_,
        string memory solutionHash_
    ) public onlyOwner {
        QuestionInfo storage questionInfo = _quizEvents[quizEventID_]
            .questionsInfo[questionID_];
        uint256 selectionSize = selectionLabels_.length;
        bool useUniqueSelectionID = selectionSize == selectionIDs_.length;

        questionInfo.selectionLabels = selectionLabels_;
        questionInfo.useUniqueSelectionID = useUniqueSelectionID;
        questionInfo.solutionHash = solutionHash_;

        if (useUniqueSelectionID) {
            questionInfo.selectionIDs = selectionIDs_;
        } else {
            for (uint256 i = 0; i < selectionSize; i = i.add(1)) {
                questionInfo.selectionIDs.push(StringsUpgradeable.toString(i));
            }
        }

        emit LogQuizQuestionID(questionID_, quizEventID_);
    }

    function getQuestionInfo(uint256 quizEventID_, uint256 questionID_)
        public
        view
        returns (string[] memory selectionLabels, string[] memory selectionIDs)
    {
        QuestionInfo memory questionInfo = _quizEvents[quizEventID_]
            .questionsInfo[questionID_];
        selectionLabels = questionInfo.selectionLabels;
        selectionIDs = questionInfo.selectionIDs;
    }

    function setUserAnswerHashes(
        uint256 quizEventID_,
        string[] memory answerHashes_
    ) public onlyOwner {
        UserAnswerHistory storage history = _userAndAnserStatusMap[msg.sender][
            quizEventID_
        ];
        QuizEvent memory quizEvent = _quizEvents[quizEventID_];

        require(
            answerHashes_.length == quizEvent.questionsInfo.length,
            "Not enough answers"
        );

        uint256 numOfCorrectAnswers = 0;
        for (uint256 i = 0; i < answerHashes_.length; i = i.add(1)) {
            if (
                compareStrings(
                    answerHashes_[i],
                    quizEvent.questionsInfo[i].solutionHash
                )
            ) {
                numOfCorrectAnswers = numOfCorrectAnswers.add(1);
            }
        }

        bool hasPassed = numOfCorrectAnswers >= quizEvent.minNumOfPasses;
        if (hasPassed) {
            mintReward(quizEventID_);
        }

        history.answers.push(
            UserAnswer({hasPassed: hasPassed, hashes: answerHashes_})
        );

        emit LogUserAnswer(msg.sender, quizEventID_, hasPassed);
    }

    function compareStrings(string memory a_, string memory b_)
        private
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(a_)) == keccak256(abi.encodePacked(b_));
    }

    function mintReward(uint256 quizEventID_) private {
        AddressUpgradeable.functionCall(
            _mintRewardContract, 
            abi.encodeWithSignature("mint(address)", msg.sender)
        );

        emit LogMintReward(msg.sender, quizEventID_);
    }

    function ownerMintRewardBypassCheck() public onlyOwner {
        AddressUpgradeable.functionCall(
            _mintRewardContract, 
            abi.encodeWithSignature("mint(address)", msg.sender)
        );

        emit LogMintReward(msg.sender, 0);
    }

    function setMintRewardContract(address mintRewardContract_) public onlyOwner {
        _mintRewardContract = mintRewardContract_;
    }
}
