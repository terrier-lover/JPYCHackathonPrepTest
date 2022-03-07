//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AbstractJPYCQuizAccessControl is Ownable {
    error InvalidCaller(address invalidCaller_, address eligibleCaller_);
    error EligibleTargetDoesNotExist();
    error InvalidAddress(address invalidAddress_);
    error InvalidEligibleCaller(address invalidEligibleCaller_);
    error InvalidEligibleTarget(address invalidEligibleTarget_);

    event SetEligibleCaller(
        address indexed previousEligibleCaller_, 
        address indexed newEligibleCaller_
    );
    event SetEligibleTarget(
        address indexed previousEligibleTarget_, 
        address indexed newEligibleTarget_
    );

    address internal _eligibleCaller;
    address internal _eligibleTarget;

    constructor(
        address eligibleCaller_, 
        address eligibleTarget_
    ) {
        _setEligibleCaller(eligibleCaller_);
        _setEligibleTarget(eligibleTarget_);
    }

    function setEligibleCaller(address newElilgibleCaller_) public virtual onlyOwner {
        if (!_isValidAddress(newElilgibleCaller_)) {
            revert InvalidAddress(newElilgibleCaller_);
        }
        _setEligibleCaller(newElilgibleCaller_);
    }

    function setEligibleTarget(address newElilgibleTarget_) public virtual onlyOwner {
        if (!_isValidAddress(newElilgibleTarget_)) {
            revert InvalidAddress(newElilgibleTarget_);
        }
        _setEligibleTarget(newElilgibleTarget_);
    }

    function _setEligibleCaller(address newElilgibleCaller_) internal {
        address previousEligibleCaller = _eligibleCaller;
        _eligibleCaller = newElilgibleCaller_;

        emit SetEligibleCaller(
            previousEligibleCaller, 
            newElilgibleCaller_
        );
    }

    function _setEligibleTarget(address newElilgibleTarget_) internal {
        address previousEligibleTarget = _eligibleTarget;
        _eligibleTarget = newElilgibleTarget_;

        emit SetEligibleTarget(
            previousEligibleTarget, 
            newElilgibleTarget_
        );
    }

    function _isValidAddress(address address_) internal pure returns (bool) {
        return address_ != address(0);
    }

    function _doesEligibleTargetExist() internal view returns (bool) {
        return _eligibleTarget != address(0);
    }

    function _isEligibleCaller() internal view returns (bool) {
        return _eligibleCaller == _msgSender();
    }

    modifier onlyWhenEligibleTargetExist {
        if (!_doesEligibleTargetExist()) {
            revert EligibleTargetDoesNotExist();
        }
        _;
    }

    modifier onlyEligibleCaller {
        if (!_isEligibleCaller()) {
            revert InvalidCaller(_msgSender(), _eligibleCaller);
        }
        _;
    }
}
