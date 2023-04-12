const hre = require("hardhat");

function stringToBytes32(str) {
    var result = Buffer.from(str, 'utf-8').toString('hex');
    if (result.length > 64) {
        throw "str is too big";
    }
    while (result.length < 64) result += "0";
    return "0x" + result; 
}

function bytes32ToString(b32) {
    if (b32.length != 64+2) {
        throw "wrong bytes32";
    }
    return Buffer.from(b32.substring(2), "hex").toString("utf-8");
}

async function contract() {
    const C = await ethers.getContractFactory("XchgNs")
    const c = await C.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
    return c
}

async function registerDomain(newDomainName, paretnDomainName) {
    const c = await contract();
    await c.registerDomain(stringToBytes32(newDomainName), stringToBytes32(paretnDomainName));
}

async function myDomains() {
    const c = await contract();
    const count = await c.myDomains();
    return count;
}

async function getMyDomain(index) {
    const c = await contract();
    const domain = await c.getMyDomainInfo(index);
    // console.log(domain)
    if (domain === undefined) {
        return "0x00";
    }
    return domain;
}

async function main() {
    try {
        // await registerDomain("work", "xchg");
        const count = await myDomains();
        console.log("Count:", count.toNumber());
        for (let i = 0; i < count; i++) {
            const r = await getMyDomain(i);
            console.log("domain", i, " = ", bytes32ToString(r.fullName.toString()));
        }
    } catch(err) {
        console.log("Exception: ", err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  