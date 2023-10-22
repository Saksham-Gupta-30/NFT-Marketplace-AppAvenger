async function main() {
  const hre = require("hardhat");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  // console.log("Account balance:", (await deployer.getBalance()).toString());


  // Get the ContractFactories and Signers here.
  const NFT = await hre.ethers.getContractFactory("NFT");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  // deploy contracts
  const marketplace = await Marketplace.deploy(1);
  // await marketplace.deploymentTransaction.wait();
  const nft = await NFT.deploy();
  // await nft.deploymentTransaction.wait();

  // await marketplace.deployed();
  // await nft.deployed();
  // Save copies of each contracts abi and address to the frontend.

  console.log("Marketplace address:", marketplace.target);
  console.log("NFT address:", nft.target);

  saveFrontendFiles(marketplace, "Marketplace");
  saveFrontendFiles(nft, "NFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../client/src/artifacts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  // console.log(`${name} : ${contract.target}`)

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });