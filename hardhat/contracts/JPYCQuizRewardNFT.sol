//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "base64-sol/base64.sol";

// TODO: Simplify the logics. Currently it allows multiple events, but
// for the simplicity, it does not need to support multiple events.
contract JPYCQuizRewardNFT is ERC721Upgradeable, OwnableUpgradeable {
    uint256 public _currentTokenId;
    address public _mintRewardCaller;

    // Key: tokenId, Value: user address who initially minted the nft
    mapping(uint256 => address) public originalMinters;

    function initialize(string memory name_, string memory symbol_)
        public
        initializer
    {
        __ERC721_init(name_, symbol_);
        __Ownable_init();
        _currentTokenId = 0;
    }

    function mint(address destination_) public {
        require(msg.sender == _mintRewardCaller, "Invalid caller");

        _currentTokenId++;
        originalMinters[_currentTokenId] = destination_;
        _safeMint(destination_, _currentTokenId);
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
        require(
            _exists(tokenId_),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return getTokenURIJson(tokenId_);
    }

    function getTokenURIJson(uint256 tokenId_)
        private
        view
        returns (string memory)
    {
        string memory svg = getSVG(tokenId_);
        bytes memory json = getJsonByte(tokenId_, svg);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(json)
                )
            );
    }

    function getJsonByte(uint256 tokenId_, string memory svg_)
        private
        pure
        returns (bytes memory)
    {
        return
            abi.encodePacked(
                '{"name": "JPYC hackathon certification #',
                StringsUpgradeable.toString(tokenId_),
                '", "description": "This NFT certifies that the original minter is eligible for JPYC hackathon.", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg_)),
                '"}'
            );
    }

    function getSVG(uint256 tokenId_) private view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    getSVGRootOpen(),
                    getSVGMain1(),
                    getSVGWalletID(tokenId_),
                    getSVGMain3(),
                    getSVGRootClose()
                )
            );
    }

    function getSVGRootOpen() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg width="353" height="548" xmlns="http://www.w3.org/2000/svg">'
                )
            );
    }

    function getSVGRootClose() private pure returns (string memory) {
        return "</svg>";
    }

    function getSVGMain1() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<defs><linearGradient gradientTransform="rotate(90)" id="a"><stop stop-color="#020d1c" offset="0"/><stop stop-color="#093470" offset="1"/></linearGradient><linearGradient id="b"><stop stop-color="#865325" offset="0"/><stop stop-color="#ffd66f" offset=".47"/><stop stop-color="#b3671f" offset="1"/></linearGradient><linearGradient id="c"><stop stop-color="#865325" offset="0"/><stop stop-color="#ffd66f" offset="1"/></linearGradient><linearGradient id="d"><stop stop-color="#ffd66f" offset="0"/><stop stop-color="#b3671f" offset="1"/></linearGradient></defs><path d="M331.62 2.11H21.12A19.12 19.12 0 0 0 2 21.23v506.23a19.12 19.12 0 0 0 19.12 19.12h310.5a19.12 19.12 0 0 0 19.12-19.12V21.22a19.12 19.12 0 0 0-19.12-19.11z" fill="url(#a)"/><path d="M331.62 8.22H21.12a13 13 0 0 0-13 13v506.24a13 13 0 0 0 13 13h310.5a13 13 0 0 0 13-13V21.22a13 13 0 0 0-13-13zm9.33 519.24a9.35 9.35 0 0 1-9.33 9.34H21.12a9.35 9.35 0 0 1-9.34-9.34V21.22a9.35 9.35 0 0 1 9.34-9.33h310.5a9.34 9.34 0 0 1 9.33 9.33v506.24z" fill="#b5e0d6"/><path d="M243.96 222.06a75.59 75.59 0 0 0 8.81-32.93h25.28a100.74 100.74 0 0 1-12.19 45.57l-21.9-12.64z" fill="#54c3f0"/><path d="M278.04 183.72h-25.27a75.59 75.59 0 0 0-8.81-32.93l21.9-12.64a100.74 100.74 0 0 1 12.18 45.57z" fill="#88d3e3"/><path d="M179.53 287.65v-25.28a75.59 75.59 0 0 0 32.93-8.81l12.64 21.89a100.73 100.73 0 0 1-45.57 12.2z" fill="#36abc6"/><path d="M141.19 253.56a75.59 75.59 0 0 0 32.93 8.81v25.28a100.73 100.73 0 0 1-45.57-12.19l12.64-21.9z" fill="#26a1b5"/><path d="M217.14 250.86a76.39 76.39 0 0 0 24.1-24.1l21.89 12.64a101.78 101.78 0 0 1-33.36 33.36l-12.63-21.9z" fill="#44b5d8"/><path d="M75.6 189.13h25.26a75.59 75.59 0 0 0 8.81 32.93L87.78 234.7a100.73 100.73 0 0 1-12.18-45.57z" fill="#1a77b5"/><path d="M112.4 226.75a76.39 76.39 0 0 0 24.1 24.1l-12.64 21.9a101.78 101.78 0 0 1-33.36-33.36l21.9-12.64z" fill="#288bb2"/><path d="M241.25 146.11a76.39 76.39 0 0 0-24.1-24.1l12.64-21.89a101.78 101.78 0 0 1 33.36 33.36l-21.9 12.63z" fill="#b5e0d6"/><path d="M109.69 150.79a75.59 75.59 0 0 0-8.83 32.93H75.6a100.73 100.73 0 0 1 12.19-45.57l21.9 12.64z" fill="#1b55b2"/><path d="M136.5 122a76.39 76.39 0 0 0-24.1 24.1l-21.89-12.64a101.78 101.78 0 0 1 33.35-33.35L136.5 122z" fill="#0e499e"/><image href="https://jpyc.jp/static/media/jpyc.0d1e5d3f.png" y="46" x="132" width="90" height="90"/><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-weight="700" font-size="32" y="176" x="126">',
                    unicode"日本円",
                    '</text><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-weight="700" font-size="26" y="208" x="112">',
                    unicode"ハッカソン",
                    '</text><text fill="#f1f2f2" font-family="sans-serif" letter-spacing=".02em" class="common" font-size="16" y="236" x="150">',
                    unicode"4月開催",
                    '</text><text font-family="sans-serif" letter-spacing=".02em" fill="url(#b)" font-weight="700" font-size="60" y="383" x="83">',
                    unicode"合格証",
                    '</text><text font-family="sans-serif" letter-spacing=".02em" fill="url(#c)" font-weight="bold" font-size="17" x="90" y="413">Wallet ID:</text>'
                )
            );
    }

    function getSVGWalletID(uint256 tokenID_)
        private
        view
        returns (string memory)
    {
        address originalMinter = originalMinters[tokenID_];
        require(originalMinter != address(0), "No original minter");

        return
            string(
                abi.encodePacked(
                    '<text font-family="sans-serif" letter-spacing=".02em" fill="url(#d)" font-size="16" x="171" y="413">',
                    getShortenedWalletID(addressToString(originalMinter)),
                    "</text>"
                )
            );
    }

    function getSVGMain3() private pure returns (string memory) {
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

    function getShortenedWalletID(string memory address_)
        private
        pure
        returns (string memory)
    {
        uint256 addressSize = bytes(address_).length;
        uint256 prefixLen = 4;
        uint256 suffixLen = 4;
        uint256 addressLen = 42;

        require(addressSize >= (prefixLen + suffixLen), "not correct wallet");

        bytes memory prefixBytes = new bytes(prefixLen);
        bytes memory suffixBytes = new bytes(suffixLen);
        bytes memory addressInBytes = bytes(address_);

        for (uint256 i = 0; i < prefixLen; i++) {
            prefixBytes[i] = addressInBytes[i];
        }

        for (uint256 i = 0; i < suffixLen; i++) {
            suffixBytes[i] = addressInBytes[addressLen - suffixLen + i];
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

    function addressToString(address _addr)
        public
        pure
        returns (string memory)
    {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(51);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(value[i + 12] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}
