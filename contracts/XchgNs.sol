// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract XchgNs {
    struct Domain {
        bool isRegistered;
        address owner;
        bytes32 name;
        bytes32 fullName;
        bytes32 xchgAddress;
        uint256 parentDomainId;
        uint256[] subDomainIds;
    }

    mapping(uint256 => Domain) public domains;
    uint256 public domainCount = 0;
    uint256 public rootDomainId;

    bytes32 currentDomainPrefix = "xchg";

    event Registered(address indexed _owner, bytes32 indexed _name, bytes32 _address);

    constructor(bytes32 prefix) {
        currentDomainPrefix = prefix;
        rootDomainId = domainCount + 1;
        domains[rootDomainId] = Domain(
            true,
            msg.sender,
            currentDomainPrefix,
            currentDomainPrefix,
            0,
            0,
            new uint256[](0)
        );
        domainCount++;
    }

    function lenOfBytes32(bytes32 bs) private pure returns (uint256) {
        uint256 len = 0;
        while (bs[len] != 0 && len < 32) {
            len++;
        }
        return len;
    }

    function myDomains() public view returns (uint) {
        uint counter = 0;
        for (uint i = 1; i < domainCount+1; i++) {
            if (domains[i].owner == msg.sender) {
                counter++;
            }
        }
        return counter;
    }

    function getMyDomain(uint index) public view returns(bytes32) {
        uint counter = 0;
        for (uint i = 1; i < domainCount+1; i++) {
            if (domains[i].owner == msg.sender) {
                if (counter == index) {
                    return domains[i].name;
                }
                counter++;
            }
        }
        return 0;
    }

    function getMyDomainInfo(uint index) public view returns(Domain memory result) {
        uint counter = 0;
        for (uint i = 1; i < domainCount+1; i++) {
            if (domains[i].owner == msg.sender) {
                if (counter == index) {
                    return domains[i];
                }
                counter++;
            }
        }
        require(false);
    }

    function checkDomainName(bytes32 bs, bool allowPoint) public pure {
        uint256 i = 0;
        while (bs[i] != 0 && i < 32) {
            bool isValidCh = false;
            if (bs[i] >= 0x30 && bs[i] <= 0x39) {
                // 0-9
                isValidCh = true;
            }
            if (bs[i] >= 0x61 && bs[i] <= 0x7A) {
                // a-z
                isValidCh = true;
            }
            if (bs[i] == 0x2D) {
                // -
                isValidCh = true;
            }
            if (allowPoint && bs[i] == 0x2E) {
                isValidCh = true;
            }
            require(isValidCh, "invalid domain name");
            i++;
        }
    }

    function registerDomain(bytes32 _name, bytes32 _parentDomainName, bytes32 _xchgAddress)
        public
        payable
        returns (uint256)
    {
        require(
            lenOfBytes32(_parentDomainName) > 0,
            "parent domain name len must be > 0"
        );
        uint256 parentDomainId = findDomainId(_parentDomainName, true);

        require(
            domains[parentDomainId].isRegistered,
            "Parent domain does not exist"
        );
        require(
            msg.sender == domains[parentDomainId].owner,
            "You are not the owner of the parent domain"
        );

        checkDomainName(_name, false);

        bytes32 fullName = _name;
        fullName = fullName | (bytes32(0x2E00000000000000000000000000000000000000000000000000000000000000) >> (lenOfBytes32(_name) * 8));
        // append parent domain
        for (uint i = 0; i < lenOfBytes32(_parentDomainName); i++) {
            uint offset = lenOfBytes32(_name) + 1 + i;
            fullName = fullName | (bytes32(_parentDomainName[i]) >> (offset * 8));
        }

        uint256 existingDomainId = findDomainId(fullName, false);
        require(existingDomainId == 0, "domain already exists");

        uint256 domainId = domainCount + 1;
        domains[domainId] = Domain(
            true,
            msg.sender,
            _name,
            fullName,
            _xchgAddress,
            parentDomainId,
            new uint256[](0)
        );
        domains[parentDomainId].subDomainIds.push(domainId);
        domainCount++;

        emit Registered(msg.sender, fullName, 0);

        return domainId;
    }

    function findDomainId(bytes32 _name, bool panicIfNotFound) public view returns (uint256) {
        require(lenOfBytes32(_name) > 0, "name is empty");
        checkDomainName(_name, true);

        bytes32[] memory parts = splitString(_name);
        require(parts.length > 0, "empty domain name");

        require(
            parts[parts.length - 1] == currentDomainPrefix,
            "invalid root domain"
        );

        uint256 currentDomainId = rootDomainId;

        for (uint256 indexOfPart = 1; indexOfPart < parts.length; indexOfPart++) {
            uint i = parts.length - 1 - indexOfPart;
            bool foundSubDomain = false;
            for (
                uint256 j = 0;
                j < domains[currentDomainId].subDomainIds.length;
                j++
            ) {
                uint256 subDomainId = domains[currentDomainId].subDomainIds[j];
                if (
                    domains[subDomainId].name == parts[i]
                ) {
                    currentDomainId = subDomainId;
                    foundSubDomain = true;
                    break;
                }
            }
            if (panicIfNotFound) {
                require(foundSubDomain, "Domain does not exist");
            }
            if (!foundSubDomain)
                return 0;
        }
        return currentDomainId;
    }

    function splitString(bytes32 data) public pure returns (bytes32[] memory) {
        uint256 length = 0;
        for (uint256 i = 0; i < 32; i++) {
            if (data[i] == 0) {
                length = i;
                break;
            }
        }

        bytes32[] memory parts = new bytes32[](length);
        uint256 index = 0;
        bytes32 currentPart = 0;
        uint256 currentPartIndex = 0;

        for (uint256 i = 0; i < length; i++) {
            if (data[i] == 0x2E) {
                // ASCII code for "."
                parts[index] = currentPart;
                currentPart = 0;
                currentPartIndex = 0;
                index++;
            } else {
                currentPart =
                    currentPart |
                    (bytes32(data[i]) >> (currentPartIndex * 8));
                currentPartIndex++;
            }
        }

        if (currentPartIndex > 0) {
            parts[index] = currentPart;
            currentPart = 0;
            currentPartIndex = 0;
            index++;
        }

        bytes32[] memory result = new bytes32[](index);
        for (uint256 i = 0; i < index; i++) {
            result[i] = parts[i];
        }

        return result;
    }
}
