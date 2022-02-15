/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Quiz, QuizInterface } from "../Quiz";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress_",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
    ],
    name: "LogMintReward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventQuizId_",
        type: "uint256",
      },
    ],
    name: "LogQuizEventID",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "questionId_",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "quizEventId_",
        type: "uint256",
      },
    ],
    name: "LogQuizQuestionID",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress_",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "hasPassed_",
        type: "bool",
      },
    ],
    name: "LogUserAnswer",
    type: "event",
  },
  {
    inputs: [],
    name: "_mintRewardContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_quizEvents",
    outputs: [
      {
        internalType: "uint256",
        name: "quizEventID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "quizName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "minNumOfPasses",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "quizName_",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "questions_",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "minNumOfPasses_",
        type: "uint256",
      },
    ],
    name: "addQuizEventAndQuestionsSkelton",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "a_",
        type: "string",
      },
      {
        internalType: "string",
        name: "b_",
        type: "string",
      },
    ],
    name: "compareStrings",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllQuizEvents",
    outputs: [
      {
        internalType: "uint256[]",
        name: "quizEventIDs",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "quizNames",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "numOfQuestions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionID_",
        type: "uint256",
      },
    ],
    name: "getQuestionInfo",
    outputs: [
      {
        internalType: "string[]",
        name: "selectionLabels",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "selectionIDs",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
    ],
    name: "getSingleQuizEvent",
    outputs: [
      {
        internalType: "string",
        name: "quizName",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "questions",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "questionIDs",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "mintRewardContract_",
        type: "address",
      },
    ],
    name: "setMintRewardContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionID_",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "selectionLabels_",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "selectionIDs_",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "solutionHash_",
        type: "string",
      },
    ],
    name: "setQuestionInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quizEventID_",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "answerHashes_",
        type: "string[]",
      },
    ],
    name: "setUserAnswerHashes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506132d4806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80638594649911610066578063859464991461015e578063b5d1924e14610190578063bc2efbdb146101ac578063bed34bba146101c8578063f5e6ae75146101f85761009e565b806315dcaa74146100a35780631c68525b146100bf578063223453b6146100db578063552502221461010d57806356d0ce461461012d575b600080fd5b6100bd60048036038101906100b891906127e4565b610216565b005b6100d960048036038101906100d49190612874565b6108d5565b005b6100f560048036038101906100f091906127bb565b610a90565b60405161010493929190612d60565b60405180910390f35b610115610b52565b60405161012493929190612c2b565b60405180910390f35b61014760048036038101906101429190612838565b610f23565b604051610155929190612bf4565b60405180910390f35b610178600480360381019061017391906127bb565b6112d7565b60405161018793929190612cb4565b60405180910390f35b6101aa60048036038101906101a591906126a7565b611974565b005b6101c660048036038101906101c191906126d0565b6119b8565b005b6101e260048036038101906101dd919061274f565b611e93565b6040516101ef9190612c77565b60405180910390f35b610200611eec565b60405161020d9190612bd9565b60405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002090506000600184815481106102a5577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000209060040201604051806080016040529081600082015481526020016001820180546102d890613025565b80601f016020809104026020016040519081016040528092919081815260200182805461030490613025565b80156103515780601f1061032657610100808354040283529160200191610351565b820191906000526020600020905b81548152906001019060200180831161033457829003601f168201915b505050505081526020016002820154815260200160038201805480602002602001604051908101604052809291908181526020016000905b828210156106b657838290600052602060002090600602016040518060c0016040529081600082015481526020016001820180546103c690613025565b80601f01602080910402602001604051908101604052809291908181526020018280546103f290613025565b801561043f5780601f106104145761010080835404028352916020019161043f565b820191906000526020600020905b81548152906001019060200180831161042257829003601f168201915b5050505050815260200160028201805480602002602001604051908101604052809291908181526020016000905b8282101561051957838290600052602060002001805461048c90613025565b80601f01602080910402602001604051908101604052809291908181526020018280546104b890613025565b80156105055780601f106104da57610100808354040283529160200191610505565b820191906000526020600020905b8154815290600101906020018083116104e857829003601f168201915b50505050508152602001906001019061046d565b50505050815260200160038201805480602002602001604051908101604052809291908181526020016000905b828210156105f257838290600052602060002001805461056590613025565b80601f016020809104026020016040519081016040528092919081815260200182805461059190613025565b80156105de5780601f106105b3576101008083540402835291602001916105de565b820191906000526020600020905b8154815290600101906020018083116105c157829003601f168201915b505050505081526020019060010190610546565b5050505081526020016004820160009054906101000a900460ff1615151515815260200160058201805461062590613025565b80601f016020809104026020016040519081016040528092919081815260200182805461065190613025565b801561069e5780601f106106735761010080835404028352916020019161069e565b820191906000526020600020905b81548152906001019060200180831161068157829003601f168201915b50505050508152505081526020019060010190610389565b50505050815250509050806060015151835114610708576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ff90612d20565b60405180910390fd5b6000805b84518110156107de576107a7858281518110610751577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015184606001518381518110610796577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160a00151611e93565b156107c3576107c0600183611f1290919063ffffffff16565b91505b6107d7600182611f1290919063ffffffff16565b905061070c565b5060008260400151821015905080156107fb576107fa86611f28565b5b836001016040518060400160405280831515815260200187815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000160006101000a81548160ff021916908315150217905550602082015181600101908051906020019061087b9291906123c6565b505050853373ffffffffffffffffffffffffffffffffffffffff167fe604e4f8b43c11bb484f079b1f4b17c8270db5094a2b5fef349601c40e194e1d836040516108c59190612c77565b60405180910390a3505050505050565b600060018681548110610911577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000209060040201600301858154811061095a577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b906000526020600020906006020190506000845190506000845182149050858360020190805190602001906109909291906123c6565b50808360040160006101000a81548160ff021916908315150217905550838360050190805190602001906109c5929190612426565b5080156109ea57848360030190805190602001906109e49291906123c6565b50610a58565b60005b82811015610a565783600301610a0282612029565b908060018154018082558091505060019003906000526020600020016000909190919091509080519060200190610a3a929190612426565b50610a4f600182611f1290919063ffffffff16565b90506109ed565b505b87877f848ab6ad8dea8ca3bfb7e5fb65b1340319556c680f0701cb70b3125e44fd8dec60405160405180910390a35050505050505050565b60018181548110610aa057600080fd5b9060005260206000209060040201600091509050806000015490806001018054610ac990613025565b80601f0160208091040260200160405190810160405280929190818152602001828054610af590613025565b8015610b425780601f10610b1757610100808354040283529160200191610b42565b820191906000526020600020905b815481529060010190602001808311610b2557829003601f168201915b5050505050908060020154905083565b6060806060600060018054905090508067ffffffffffffffff811115610ba1577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051908082528060200260200182016040528015610bcf5781602001602082028036833780820191505090505b5093508067ffffffffffffffff811115610c12577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051908082528060200260200182016040528015610c4557816020015b6060815260200190600190039081610c305790505b5092508067ffffffffffffffff811115610c88577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051908082528060200260200182016040528015610cb65781602001602082028036833780820191505090505b50915060005b81811015610f1c5760018181548110610cfe577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b906000526020600020906004020160000154858281518110610d49577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101818152505060018181548110610d8f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016001018054610dab90613025565b80601f0160208091040260200160405190810160405280929190818152602001828054610dd790613025565b8015610e245780601f10610df957610100808354040283529160200191610e24565b820191906000526020600020905b815481529060010190602001808311610e0757829003601f168201915b5050505050848281518110610e62577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001018190525060018181548110610ea7577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b906000526020600020906004020160030180549050838281518110610ef5577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001018181525050610f15600182611f1290919063ffffffff16565b9050610cbc565b5050909192565b606080600060018581548110610f62577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016003018481548110610fab577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600602016040518060c001604052908160008201548152602001600182018054610fde90613025565b80601f016020809104026020016040519081016040528092919081815260200182805461100a90613025565b80156110575780601f1061102c57610100808354040283529160200191611057565b820191906000526020600020905b81548152906001019060200180831161103a57829003601f168201915b5050505050815260200160028201805480602002602001604051908101604052809291908181526020016000905b828210156111315783829060005260206000200180546110a490613025565b80601f01602080910402602001604051908101604052809291908181526020018280546110d090613025565b801561111d5780601f106110f25761010080835404028352916020019161111d565b820191906000526020600020905b81548152906001019060200180831161110057829003601f168201915b505050505081526020019060010190611085565b50505050815260200160038201805480602002602001604051908101604052809291908181526020016000905b8282101561120a57838290600052602060002001805461117d90613025565b80601f01602080910402602001604051908101604052809291908181526020018280546111a990613025565b80156111f65780601f106111cb576101008083540402835291602001916111f6565b820191906000526020600020905b8154815290600101906020018083116111d957829003601f168201915b50505050508152602001906001019061115e565b5050505081526020016004820160009054906101000a900460ff1615151515815260200160058201805461123d90613025565b80601f016020809104026020016040519081016040528092919081815260200182805461126990613025565b80156112b65780601f1061128b576101008083540402835291602001916112b6565b820191906000526020600020905b81548152906001019060200180831161129957829003601f168201915b50505050508152505090508060400151925080606001519150509250929050565b6060806060600060018581548110611318577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016040518060800160405290816000820154815260200160018201805461134b90613025565b80601f016020809104026020016040519081016040528092919081815260200182805461137790613025565b80156113c45780601f10611399576101008083540402835291602001916113c4565b820191906000526020600020905b8154815290600101906020018083116113a757829003601f168201915b505050505081526020016002820154815260200160038201805480602002602001604051908101604052809291908181526020016000905b8282101561172957838290600052602060002090600602016040518060c00160405290816000820154815260200160018201805461143990613025565b80601f016020809104026020016040519081016040528092919081815260200182805461146590613025565b80156114b25780601f10611487576101008083540402835291602001916114b2565b820191906000526020600020905b81548152906001019060200180831161149557829003601f168201915b5050505050815260200160028201805480602002602001604051908101604052809291908181526020016000905b8282101561158c5783829060005260206000200180546114ff90613025565b80601f016020809104026020016040519081016040528092919081815260200182805461152b90613025565b80156115785780601f1061154d57610100808354040283529160200191611578565b820191906000526020600020905b81548152906001019060200180831161155b57829003601f168201915b5050505050815260200190600101906114e0565b50505050815260200160038201805480602002602001604051908101604052809291908181526020016000905b828210156116655783829060005260206000200180546115d890613025565b80601f016020809104026020016040519081016040528092919081815260200182805461160490613025565b80156116515780601f1061162657610100808354040283529160200191611651565b820191906000526020600020905b81548152906001019060200180831161163457829003601f168201915b5050505050815260200190600101906115b9565b5050505081526020016004820160009054906101000a900460ff1615151515815260200160058201805461169890613025565b80601f01602080910402602001604051908101604052809291908181526020018280546116c490613025565b80156117115780601f106116e657610100808354040283529160200191611711565b820191906000526020600020905b8154815290600101906020018083116116f457829003601f168201915b505050505081525050815260200190600101906113fc565b50505050815250509050806020015193506000816060015190506000815190508067ffffffffffffffff811115611789577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280602002602001820160405280156117bc57816020015b60608152602001906001900390816117a75790505b5094508067ffffffffffffffff8111156117ff577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60405190808252806020026020018201604052801561182d5781602001602082028036833780820191505090505b50935060005b8181101561196957828181518110611874577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151602001518682815181106118b9577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101819052508281815181106118fd577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160000151858281518110611942577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001018181525050611962600182611f1290919063ffffffff16565b9050611833565b505050509193909250565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008251905060008167ffffffffffffffff811115611a00577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051908082528060200260200182016040528015611a3957816020015b611a266124ac565b815260200190600190039081611a1e5790505b50905060005b82811015611b355780828281518110611a81577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101516000018181525050848181518110611aca577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151828281518110611b0b577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160200181905250611b2e600182611f1290919063ffffffff16565b9050611a3f565b506000600180549050905060018081600181540180825580915050039060005260206000209050508560018281548110611b98577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016001019080519060200190611bbc929190612426565b508360018281548110611bf8577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016002018190555060005b83811015611e5d578060018381548110611c53577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016000018190555060018281548110611ca2577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b906000526020600020906004020160030160018160018154018082558091505003906000526020600020905050828181518110611d08577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160018381548110611d4a577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600402016003018281548110611d93577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000209060060201600082015181600001556020820151816001019080519060200190611dc7929190612426565b506040820151816002019080519060200190611de49291906123c6565b506060820151816003019080519060200190611e019291906123c6565b5060808201518160040160006101000a81548160ff02191690831515021790555060a0820151816005019080519060200190611e3e929190612426565b50905050611e56600182611f1290919063ffffffff16565b9050611c10565b50807f389cba506b1ec64e15fac82279497c470763b41c53765d66739c9ca01bc7ba8e60405160405180910390a2505050505050565b600081604051602001611ea69190612bc2565b6040516020818303038152906040528051906020012083604051602001611ecd9190612bc2565b6040516020818303038152906040528051906020012014905092915050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008183611f209190612ee0565b905092915050565b611fe1600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1633604051602401611f5f9190612bd9565b6040516020818303038152906040527f6a627842000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506121d6565b50803373ffffffffffffffffffffffffffffffffffffffff167f1d9a02bdb492609123b1bd73ebfecc722a908d1205f7ba5864f2e825319346f860405160405180910390a350565b60606000821415612071576040518060400160405280600181526020017f300000000000000000000000000000000000000000000000000000000000000081525090506121d1565b600082905060005b600082146120a357808061208c90613088565b915050600a8261209c9190612f36565b9150612079565b60008167ffffffffffffffff8111156120e5577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156121175781602001600182028036833780820191505090505b5090505b600085146121ca576001826121309190612f67565b9150600a8561213f91906130d1565b603061214b9190612ee0565b60f81b818381518110612187577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856121c39190612f36565b945061211b565b8093505050505b919050565b606061221883836040518060400160405280601e81526020017f416464726573733a206c6f772d6c6576656c2063616c6c206661696c65640000815250612220565b905092915050565b606061222f8484600085612238565b90509392505050565b60608247101561227d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161227490612d00565b60405180910390fd5b6122868561234c565b6122c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016122bc90612d40565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516122ee9190612bab565b60006040518083038185875af1925050503d806000811461232b576040519150601f19603f3d011682016040523d82523d6000602084013e612330565b606091505b509150915061234082828661235f565b92505050949350505050565b600080823b905060008111915050919050565b6060831561236f578290506123bf565b6000835111156123825782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016123b69190612c92565b60405180910390fd5b9392505050565b828054828255906000526020600020908101928215612415579160200282015b82811115612414578251829080519060200190612404929190612426565b50916020019190600101906123e6565b5b50905061242291906124e4565b5090565b82805461243290613025565b90600052602060002090601f016020900481019282612454576000855561249b565b82601f1061246d57805160ff191683800117855561249b565b8280016001018555821561249b579182015b8281111561249a57825182559160200191906001019061247f565b5b5090506124a89190612508565b5090565b6040518060c0016040528060008152602001606081526020016060815260200160608152602001600015158152602001606081525090565b5b8082111561250457600081816124fb9190612525565b506001016124e5565b5090565b5b80821115612521576000816000905550600101612509565b5090565b50805461253190613025565b6000825580601f106125435750612562565b601f0160209004906000526020600020908101906125619190612508565b5b50565b600061257861257384612dc3565b612d9e565b9050808382526020820190508285602086028201111561259757600080fd5b60005b858110156125e157813567ffffffffffffffff8111156125b957600080fd5b8086016125c68982612668565b8552602085019450602084019350505060018101905061259a565b5050509392505050565b60006125fe6125f984612def565b612d9e565b90508281526020810184848401111561261657600080fd5b612621848285612fe3565b509392505050565b60008135905061263881613270565b92915050565b600082601f83011261264f57600080fd5b813561265f848260208601612565565b91505092915050565b600082601f83011261267957600080fd5b81356126898482602086016125eb565b91505092915050565b6000813590506126a181613287565b92915050565b6000602082840312156126b957600080fd5b60006126c784828501612629565b91505092915050565b6000806000606084860312156126e557600080fd5b600084013567ffffffffffffffff8111156126ff57600080fd5b61270b86828701612668565b935050602084013567ffffffffffffffff81111561272857600080fd5b6127348682870161263e565b925050604061274586828701612692565b9150509250925092565b6000806040838503121561276257600080fd5b600083013567ffffffffffffffff81111561277c57600080fd5b61278885828601612668565b925050602083013567ffffffffffffffff8111156127a557600080fd5b6127b185828601612668565b9150509250929050565b6000602082840312156127cd57600080fd5b60006127db84828501612692565b91505092915050565b600080604083850312156127f757600080fd5b600061280585828601612692565b925050602083013567ffffffffffffffff81111561282257600080fd5b61282e8582860161263e565b9150509250929050565b6000806040838503121561284b57600080fd5b600061285985828601612692565b925050602061286a85828601612692565b9150509250929050565b600080600080600060a0868803121561288c57600080fd5b600061289a88828901612692565b95505060206128ab88828901612692565b945050604086013567ffffffffffffffff8111156128c857600080fd5b6128d48882890161263e565b935050606086013567ffffffffffffffff8111156128f157600080fd5b6128fd8882890161263e565b925050608086013567ffffffffffffffff81111561291a57600080fd5b61292688828901612668565b9150509295509295909350565b600061293f8383612a81565b905092915050565b60006129538383612b8d565b60208301905092915050565b61296881612f9b565b82525050565b600061297982612e40565b6129838185612e86565b93508360208202850161299585612e20565b8060005b858110156129d157848403895281516129b28582612933565b94506129bd83612e6c565b925060208a01995050600181019050612999565b50829750879550505050505092915050565b60006129ee82612e4b565b6129f88185612e97565b9350612a0383612e30565b8060005b83811015612a34578151612a1b8882612947565b9750612a2683612e79565b925050600181019050612a07565b5085935050505092915050565b612a4a81612fad565b82525050565b6000612a5b82612e56565b612a658185612ea8565b9350612a75818560208601612ff2565b80840191505092915050565b6000612a8c82612e61565b612a968185612eb3565b9350612aa6818560208601612ff2565b612aaf816131be565b840191505092915050565b6000612ac582612e61565b612acf8185612ec4565b9350612adf818560208601612ff2565b612ae8816131be565b840191505092915050565b6000612afe82612e61565b612b088185612ed5565b9350612b18818560208601612ff2565b80840191505092915050565b6000612b31602683612ec4565b9150612b3c826131cf565b604082019050919050565b6000612b54601283612ec4565b9150612b5f8261321e565b602082019050919050565b6000612b77601d83612ec4565b9150612b8282613247565b602082019050919050565b612b9681612fd9565b82525050565b612ba581612fd9565b82525050565b6000612bb78284612a50565b915081905092915050565b6000612bce8284612af3565b915081905092915050565b6000602082019050612bee600083018461295f565b92915050565b60006040820190508181036000830152612c0e818561296e565b90508181036020830152612c22818461296e565b90509392505050565b60006060820190508181036000830152612c4581866129e3565b90508181036020830152612c59818561296e565b90508181036040830152612c6d81846129e3565b9050949350505050565b6000602082019050612c8c6000830184612a41565b92915050565b60006020820190508181036000830152612cac8184612aba565b905092915050565b60006060820190508181036000830152612cce8186612aba565b90508181036020830152612ce2818561296e565b90508181036040830152612cf681846129e3565b9050949350505050565b60006020820190508181036000830152612d1981612b24565b9050919050565b60006020820190508181036000830152612d3981612b47565b9050919050565b60006020820190508181036000830152612d5981612b6a565b9050919050565b6000606082019050612d756000830186612b9c565b8181036020830152612d878185612aba565b9050612d966040830184612b9c565b949350505050565b6000612da8612db9565b9050612db48282613057565b919050565b6000604051905090565b600067ffffffffffffffff821115612dde57612ddd61318f565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612e0a57612e0961318f565b5b612e13826131be565b9050602081019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612eeb82612fd9565b9150612ef683612fd9565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612f2b57612f2a613102565b5b828201905092915050565b6000612f4182612fd9565b9150612f4c83612fd9565b925082612f5c57612f5b613131565b5b828204905092915050565b6000612f7282612fd9565b9150612f7d83612fd9565b925082821015612f9057612f8f613102565b5b828203905092915050565b6000612fa682612fb9565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015613010578082015181840152602081019050612ff5565b8381111561301f576000848401525b50505050565b6000600282049050600182168061303d57607f821691505b6020821081141561305157613050613160565b5b50919050565b613060826131be565b810181811067ffffffffffffffff8211171561307f5761307e61318f565b5b80604052505050565b600061309382612fd9565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156130c6576130c5613102565b5b600182019050919050565b60006130dc82612fd9565b91506130e783612fd9565b9250826130f7576130f6613131565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b7f4e6f7420656e6f75676820616e73776572730000000000000000000000000000600082015250565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b61327981612f9b565b811461328457600080fd5b50565b61329081612fd9565b811461329b57600080fd5b5056fea264697066735822122084b5b40a6786245f0ccd36d181bbd475ef22663855c6f67e5469c5db38fa69ce64736f6c63430008040033";

export class Quiz__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Quiz> {
    return super.deploy(overrides || {}) as Promise<Quiz>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Quiz {
    return super.attach(address) as Quiz;
  }
  connect(signer: Signer): Quiz__factory {
    return super.connect(signer) as Quiz__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): QuizInterface {
    return new utils.Interface(_abi) as QuizInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Quiz {
    return new Contract(address, _abi, signerOrProvider) as Quiz;
  }
}