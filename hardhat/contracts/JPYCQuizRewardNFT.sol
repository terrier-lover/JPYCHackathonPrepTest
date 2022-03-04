//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

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

    uint256 private constant PREFIX_LEN = 4;
    uint256 private constant SUFFIX_LEN = 4;
    uint256 private constant ADDRESS_LEN = 42;

    uint256 private _currentTokenId;
    address private _mintRewardCaller;

    // tokenId to user address who initially minted the nft
    mapping(uint256 => address) private tokenIDToOriginalMinterMap;
    // minter address to tokenId
    mapping(address => uint256) private originalMinterToTokenIDMap;

    constructor(
        string memory name_,
        string memory symbol_,
        address mintRewardCaller_
    ) ERC721(name_, symbol_) {
        _mintRewardCaller = mintRewardCaller_;
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

    function tokenURI(uint256 tokenId_)
        public
        view
        override
        returns (string memory)
    {
        if (!_exists(tokenId_)) {
            revert TokenDoesNotExist(tokenId_);
        }

        return getTokenURIJson(tokenId_);
    }

    function getTokenURIForMinter(address minterAddress_) 
        public view 
        returns (string memory) 
    {
        return tokenURI(getTokenIDFromMinter(minterAddress_));
    }

    function getTokenURIJson(uint256 tokenId_)
        private
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(getJsonByte(tokenId_, _getSVG(tokenId_)))
                )
            );
    }

    function getJsonByte(uint256 tokenId_, string memory svg_)
        private
        view
        returns (bytes memory)
    {
        return
            abi.encodePacked(
                '{"name": "',
                name(),
                ' #',
                Strings.toString(tokenId_),
                '", "description": "This NFT certifies that the original minter is eligible for JPYC hackathon.", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg_)),
                '"}'
            );
    }

    function _getSVG(uint256 tokenId_) private view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _getSVGRootOpen(),
                    _getSVGMain1(),
                    _getSVGWalletID(tokenId_),
                    _getSVGMain3(),
                    _getSVGRootClose()
                )
            );
    }

    function _getSVGRootOpen() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg width="353" height="548" xmlns="http://www.w3.org/2000/svg">'
                )
            );
    }

    function _getSVGRootClose() private pure returns (string memory) {
        return "</svg>";
    }

    function _getSVGMain1() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<defs><linearGradient gradientTransform="rotate(90)" id="a"><stop stop-color="#020d1c" offset="0"/><stop stop-color="#0e50ad" offset="1"/></linearGradient><linearGradient id="b"><stop stop-color="#865325" offset="0"/><stop stop-color="#ffd66f" offset=".47"/><stop stop-color="#b3671f" offset="1"/></linearGradient><linearGradient id="c"><stop stop-color="#865325" offset="0"/><stop stop-color="#ffd66f" offset="1"/></linearGradient><linearGradient id="d"><stop stop-color="#ffd66f" offset="0"/><stop stop-color="#b3671f" offset="1"/></linearGradient></defs><path d="M331.62 2.11H21.12A19.12 19.12 0 0 0 2 21.23v506.23a19.12 19.12 0 0 0 19.12 19.12h310.5a19.12 19.12 0 0 0 19.12-19.12V21.22a19.12 19.12 0 0 0-19.12-19.11z" fill="url(#a)"/><path d="M331.62 8.22H21.12a13 13 0 0 0-13 13v506.24a13 13 0 0 0 13 13h310.5a13 13 0 0 0 13-13V21.22a13 13 0 0 0-13-13zm9.33 519.24a9.35 9.35 0 0 1-9.33 9.34H21.12a9.35 9.35 0 0 1-9.34-9.34V21.22a9.35 9.35 0 0 1 9.34-9.33h310.5a9.34 9.34 0 0 1 9.33 9.33v506.24z" fill="#b5e0d6"/><path d="M243.96 222.06a75.59 75.59 0 0 0 8.81-32.93h25.28a100.74 100.74 0 0 1-12.19 45.57l-21.9-12.64z" fill="#54c3f0"/><path d="M278.04 183.72h-25.27a75.59 75.59 0 0 0-8.81-32.93l21.9-12.64a100.74 100.74 0 0 1 12.18 45.57z" fill="#88d3e3"/><path d="M179.53 287.65v-25.28a75.59 75.59 0 0 0 32.93-8.81l12.64 21.89a100.73 100.73 0 0 1-45.57 12.2z" fill="#36abc6"/><path d="M141.19 253.56a75.59 75.59 0 0 0 32.93 8.81v25.28a100.73 100.73 0 0 1-45.57-12.19l12.64-21.9z" fill="#26a1b5"/><path d="M217.14 250.86a76.39 76.39 0 0 0 24.1-24.1l21.89 12.64a101.78 101.78 0 0 1-33.36 33.36l-12.63-21.9z" fill="#44b5d8"/><path d="M75.6 189.13h25.26a75.59 75.59 0 0 0 8.81 32.93L87.78 234.7a100.73 100.73 0 0 1-12.18-45.57z" fill="#1a77b5"/><path d="M112.4 226.75a76.39 76.39 0 0 0 24.1 24.1l-12.64 21.9a101.78 101.78 0 0 1-33.36-33.36l21.9-12.64z" fill="#288bb2"/><path d="M241.25 146.11a76.39 76.39 0 0 0-24.1-24.1l12.64-21.89a101.78 101.78 0 0 1 33.36 33.36l-21.9 12.63z" fill="#b5e0d6"/><path d="M109.69 150.79a75.59 75.59 0 0 0-8.83 32.93H75.6a100.73 100.73 0 0 1 12.19-45.57l21.9 12.64z" fill="#1b55b2"/><path d="M136.5 122a76.39 76.39 0 0 0-24.1 24.1l-21.89-12.64a101.78 101.78 0 0 1 33.35-33.35L136.5 122z" fill="#0e499e"/><circle cx="177" cy="91" r="40" fill="#fff"/><svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 256 256" fill="#16449a" y="46" x="132"><path d="M112.5 1.1C82.2 5.3 56.4 18.3 35.9 39.6c-17 17.8-27.8 38.3-33 62.5-3.2 14.7-3.2 37.1 0 51.9 10.7 50.1 49 88.4 99.2 99.1 14.7 3.2 37.1 3.2 51.8 0 50.2-10.7 88.5-49 99.2-99.1 1.8-8.3 2.2-13.7 2.2-26s-.4-17.7-2.2-26c-10.7-50.1-49.6-88.9-99.2-99-12-2.5-31.1-3.3-41.4-1.9zm-3.7 43.1c2.1 2.1 1.3 3.8-6.4 12.6-4.1 4.8-10.6 13.3-14.5 19C66 108.4 62.9 133 77 162.6c5.2 10.8 15.9 26.6 25.4 37.6 4.2 4.8 7.6 9.3 7.6 10.1 0 3.2-2.8 4-11.3 3.4-42.7-3-76.1-47.9-70.7-95.1 2.4-21.4 10.2-37.7 25-52.7 12.1-12.2 24-19 38.5-21.9 6.3-1.2 16-1.1 17.3.2zm64.9 2.1c23.9 8.2 42.8 27.7 51.1 53 13.9 42.2-3.9 88.6-41.3 107.2-16.4 8.2-36.5 10.2-36.5 3.7 0-.7 3.4-5.2 7.6-10 9.4-10.8 21.2-28.3 25.8-38.3 13.6-29.4 10.4-53.8-11.3-86.1-3.9-5.7-10.4-14.2-14.5-19-7.8-8.9-8.5-10.4-6.3-12.7 1.9-2 16.7-.7 25.4 2.2zm-52.8 53 7.4 13.7 7.5-14 7.6-14h9.3c7 0 9.5.3 9.9 1.4.3.7-3.3 8.3-8 16.7l-8.5 15.4 6.7.3c3.8.2 7 .8 7.4 1.5.9 1.4 1 9.9.2 12.1-.5 1.3-2.5 1.6-11 1.6H139v7h10.5c11.9 0 12 .1 11.3 9.1l-.3 4.4-10.7.3-10.7.3-.3 8.2-.3 8.2h-21l-.3-8.2-.3-8.2-10.2-.3-10.2-.3v-13l10.3-.3 10.2-.3v-6.8l-10.2-.3-10.3-.3v-14l6.8-.3c3.7-.2 6.7-.6 6.7-.9 0-.4-3.6-7.4-8.1-15.6-4.4-8.2-7.8-15.6-7.5-16.4.4-1.1 2.6-1.3 9.8-1.1l9.3.3 7.4 13.8z"/><path d="M86.5 54.4c-7.3 2.3-18.2 8.7-24.4 14.3-10.8 9.7-18.1 21.6-22.7 37-2.4 7.7-2.7 10.5-2.7 22.8s.3 15.1 2.7 22.8c6.7 22.4 19.5 38.2 38.1 47.2 4.9 2.5 10.7 4.7 12.8 5.1l3.7.6-8.5-11.3c-10.2-13.6-20.4-33.4-23.6-45.9-6.8-26.3 1.6-54.3 25.7-85.8 6.8-8.7 6.7-9.2-1.1-6.8zm85 9.7c10 13.3 20.4 33.4 23.6 45.4 2.9 11.1 2.9 27.1 0 38-3.2 12.1-13.6 32.1-23.6 45.4l-8.5 11.3 3.7-.6c2.1-.4 8.1-2.7 13.3-5.3 8-3.9 10.9-6 18-13.2 9.8-9.9 15.3-19.3 19.6-33.6 2.4-7.9 2.7-10.6 2.7-23 0-12.3-.3-15.1-2.7-22.8-6.7-22.4-19.5-38.2-38.1-47.2-4.9-2.5-10.7-4.7-12.8-5.1l-3.7-.6 8.5 11.3z"/></svg><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-weight="700" font-size="32" y="176" x="126">',
                    unicode"日本円",
                    '</text><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-weight="700" font-size="26" y="208" x="112">',
                    unicode"ハッカソン",
                    '</text><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-size="16" y="236" x="150">',
                    unicode"4月開催",
                    '</text><text font-family="sans-serif" letter-spacing=".02em" fill="url(#b)" font-weight="700" font-size="60" y="383" x="83">',
                    unicode"合格証",
                    '</text><text font-family="sans-serif" letter-spacing=".02em" fill="url(#c)" font-weight="bold" font-size="16" x="90" y="413">Wallet ID:</text>'
                )
            );
    }

    function _getSVGWalletID(uint256 tokenID_)
        private
        view
        returns (string memory)
    {
        address originalMinter = tokenIDToOriginalMinterMap[tokenID_];
        if (originalMinter == address(0)) {
            revert NotMintedYet(tokenID_);
        }

        return
            string(
                abi.encodePacked(
                    '<text font-family="sans-serif" letter-spacing=".02em" fill="url(#d)" font-size="16" x="175" y="413">',
                    _getShortenedWalletID(originalMinter),
                    "</text>"
                )
            );
    }

    function _getSVGMain3() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-size="12" x="37" y="472">',
                    unicode"あなたは事前テストで所定の得点を取得しました。",
                    '</text><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-size="12" x="72" y="492">',
                    unicode"よってここに合格証を授与致します。",
                    "</text>"
                )
            );
    }

    function _getShortenedWalletID(address address_)
        private
        pure
        returns (string memory)
    {
        bytes memory prefixBytes = new bytes(PREFIX_LEN);
        bytes memory suffixBytes = new bytes(SUFFIX_LEN);
        bytes memory addressInBytes = abi.encodePacked(address_);

        for (uint256 i = 0; i < PREFIX_LEN; ) {
            prefixBytes[i] = addressInBytes[i];
            unchecked {
                i++;
            }
        }

        for (uint256 i = 0; i < SUFFIX_LEN; ) {
            suffixBytes[i] = addressInBytes[ADDRESS_LEN - SUFFIX_LEN + i];
            unchecked {
                i++;
            }
        }

        return
            string(
                abi.encodePacked(
                    string(prefixBytes),
                    "...",
                    string(suffixBytes)
                )
            );
    } 
}