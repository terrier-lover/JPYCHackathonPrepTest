//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IJPYCQuizRewardNFTSource} from "./JPYCQuizRewardNFTSource.sol";
import "hardhat/console.sol";

interface IJPYCQuizRewardNFT {
    function mintFromRewardCaller(address destination_) external returns(uint256);
}

/**
 * @title Quiz Reward ERC721 compatible NFT
 * @dev Contains information of NFT which is used for Quiz Reward of JPYC hackathon 2022.
 */
contract JPYCQuizRewardNFT is ERC721, Ownable, IJPYCQuizRewardNFT {
    error InvalidCaller(address mintRewardCaller_);
    error AlreadyMinted(address destinationAddress_);
    error TokenDoesNotExist(uint256 tokenId_);
    error NotMintedYet(uint256 tokenId_);
    error WrongAddressSize();
    error NFTSourceDoesNotExist();

    uint256 private _currentTokenId;
    address private _mintRewardCaller;
    IJPYCQuizRewardNFTSource private _nftSource;

    // tokenId to user address who initially minted the nft
    mapping(uint256 => address) private tokenIDToOriginalMinterMap;
    // minter address to tokenId
    mapping(address => uint256) private originalMinterToTokenIDMap;

    constructor(
        string memory name_,
        string memory symbol_,
        address mintRewardCaller_,
        address nftSource_
    ) ERC721(name_, symbol_) {
        _mintRewardCaller = mintRewardCaller_;
        _nftSource = IJPYCQuizRewardNFTSource(nftSource_);
    }

    function getTokenIDFromMinter(address minter_) public view returns(uint256) {
        return originalMinterToTokenIDMap[minter_];
    }

    function mintFromRewardCaller(address destination_) external returns(uint256) {
        if (_msgSender() != _mintRewardCaller) {
            revert InvalidCaller(_mintRewardCaller);
        }

        // Owner can have more than 1 NFT
        if (
            owner() != destination_ 
            && originalMinterToTokenIDMap[destination_] != 0
        ) {
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

    function setMintRewardCaller(address mintRewardCaller_) public onlyOwner {
        _mintRewardCaller = mintRewardCaller_;
    }

    function setNFTSource(address nftSource_) public onlyOwner {
        _nftSource = IJPYCQuizRewardNFTSource(nftSource_);
    }

    function tokenURI(uint256 tokenId_)
        public
        view
        override
        returns (string memory)
    {
        if (_nftSource == IJPYCQuizRewardNFTSource(address(0))) {
            revert NFTSourceDoesNotExist();
        }
        console.log('tokenId_', tokenId_);
        if (!_exists(tokenId_)) {
            revert TokenDoesNotExist(tokenId_);
        }

        address originalMinter = tokenIDToOriginalMinterMap[tokenId_];
        console.log('originalMinter', originalMinter);
        if (originalMinter == address(0)) {
            revert NotMintedYet(tokenId_);
        }

        console.log('getTokenURIJson before');
        return _nftSource.getTokenURIJson(tokenId_, name(), originalMinter);
    }

    function getTokenURIForMinter(address minterAddress_) 
        public view 
        returns (string memory) 
    {
        return tokenURI(getTokenIDFromMinter(minterAddress_));
    }
}