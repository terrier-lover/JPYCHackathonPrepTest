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

    constructor(address eligibleCaller_, address eligibleTarget_) {
        _setEligibleCaller(eligibleCaller_);
        _setEligibleTarget(eligibleTarget_);
    }

    function setEligibleCaller(address newElilgibleCaller_)
        external
        virtual
        onlyOwner
    {
        _checkIsValidAddress(newElilgibleCaller_);
        _setEligibleCaller(newElilgibleCaller_);
    }

    function setEligibleTarget(address newElilgibleTarget_)
        external
        virtual
        onlyOwner
    {
        _checkIsValidAddress(newElilgibleTarget_);
        _setEligibleTarget(newElilgibleTarget_);
    }

    function _setEligibleCaller(address newElilgibleCaller_) private {
        address previousEligibleCaller = _eligibleCaller;
        _eligibleCaller = newElilgibleCaller_;

        emit SetEligibleCaller(previousEligibleCaller, newElilgibleCaller_);
    }

    function _setEligibleTarget(address newElilgibleTarget_) private {
        address previousEligibleTarget = _eligibleTarget;
        _eligibleTarget = newElilgibleTarget_;

        emit SetEligibleTarget(previousEligibleTarget, newElilgibleTarget_);
    }

    function _checkIsValidAddress(address address_) private pure {
        if (address_ == address(0)) {
            revert InvalidAddress(address_);
        }
    }

    function _checkEligibleTargetExist() internal view {
        if (_eligibleTarget == address(0)) {
            revert EligibleTargetDoesNotExist();
        }
    }

    function _checkDoesEligibleCallerExecute() internal view {
        if (_eligibleCaller != _msgSender()) {
            revert InvalidCaller(_msgSender(), _eligibleCaller);
        }
    }
}
