//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IJPYCQuizRewardNFTSource} from "./JPYCQuizRewardNFTSource.sol";
import {AbstractJPYCQuizAccessControl} from "./AbstractJPYCQuizAccessControl.sol";
import {IJPYCQuizEligibility} from "./IJPYCQuizEligibility.sol";

interface IJPYCQuizRewardNFT is IJPYCQuizEligibility {
    function mintFromRewardCaller(address destination_)
        external
        returns (uint256);
}

/**
 * @title Quiz Reward ERC721 compatible NFT
 * @dev Contains information of NFT which is used for Quiz Reward of JPYC hackathon 2022.
 */
contract JPYCQuizRewardNFT is
    ERC721,
    IJPYCQuizRewardNFT,
    AbstractJPYCQuizAccessControl
{
    error AlreadyMinted(address destinationAddress_);
    error TokenDoesNotExist(uint256 tokenId_);
    error NotMintedYet(uint256 tokenId_);
    error WrongAddressSize();
    error NFTSourceDoesNotExist();

    uint256 private _currentTokenId;

    // tokenId to user address who initially minted the nft
    mapping(uint256 => address) private tokenIDToOriginalMinterMap;
    // minter address to tokenId
    mapping(address => uint256) private originalMinterToTokenIDMap;

    constructor(
        string memory name_,
        string memory symbol_,
        address mintRewardCaller_,
        address nftSource_
    )
        AbstractJPYCQuizAccessControl(mintRewardCaller_, nftSource_)
        ERC721(name_, symbol_)
    {}

    function getTokenIDFromMinter(address minter_)
        public
        view
        returns (uint256)
    {
        return originalMinterToTokenIDMap[minter_];
    }

    function getQuizEligiblity() external view returns (bool, QuizStatus) {
        if (_eligibleTarget == address(0)) {
            return (false, QuizStatus.QUIZ_NFT_SOURCE_NOT_READY);
        }

        if (_eligibleCaller != _msgSender()) {
            return (false, QuizStatus.QUIZ_NFT_NOT_READY);
        }

        // Assume that the original caller is minter
        if (_minterHasAlreadyMinted(tx.origin)) {
            return (false, QuizStatus.USER_HAS_MINTED);
        }

        return IJPYCQuizRewardNFTSource(_eligibleTarget).getQuizEligiblity();
    }

    function mintFromRewardCaller(address destination_)
        external
        returns (uint256)
    {
        _checkDoesEligibleCallerExecute();

        // Owner can have more than 1 NFT
        if (_minterHasAlreadyMinted(destination_)) {
            revert AlreadyMinted(destination_);
        }

        // It is unlikely that tokenId overflows
        unchecked {
            _currentTokenId++;
        }
        tokenIDToOriginalMinterMap[_currentTokenId] = destination_;
        originalMinterToTokenIDMap[destination_] = _currentTokenId;
        _safeMint(destination_, _currentTokenId);

        return _currentTokenId;
    }

    function tokenURI(uint256 tokenId_)
        public
        view
        override
        returns (string memory)
    {
        _checkEligibleTargetExist();

        if (!_exists(tokenId_)) {
            revert TokenDoesNotExist(tokenId_);
        }

        address originalMinter = tokenIDToOriginalMinterMap[tokenId_];
        if (originalMinter == address(0)) {
            revert NotMintedYet(tokenId_);
        }

        return
            IJPYCQuizRewardNFTSource(_eligibleTarget).getTokenURIJson(
                tokenId_,
                name(),
                originalMinter
            );
    }

    function getTokenURIForMinter(address minterAddress_)
        external
        view
        returns (string memory)
    {
        return tokenURI(getTokenIDFromMinter(minterAddress_));
    }

    function _minterHasAlreadyMinted(address minter_)
        private
        view
        returns (bool)
    {
        return owner() != minter_ && originalMinterToTokenIDMap[minter_] != 0;
    }
}
