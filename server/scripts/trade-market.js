const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [DAI, BAT, REP, ZRX] = ["DAI", "BAT", "REP", "ZRX"].map((ticker) =>
    hre.ethers.utils.formatBytes32String(ticker)
  );

  const SIDE = {
    BUY: 0,
    SELL: 1,
  };

  const [trader1, trader2, trader3, trader4, _] = await hre.ethers.getSigners();

  const Dex = await hre.ethers.getContractFactory("Dex");
  const Bat = await hre.ethers.getContractFactory("Bat");
  const Dai = await hre.ethers.getContractFactory("Dai");
  const Rep = await hre.ethers.getContractFactory("Rep");
  const Zrx = await hre.ethers.getContractFactory("Zrx");

  const dex = await Dex.deploy();
  const bat = await Bat.deploy();
  const dai = await Dai.deploy();
  const rep = await Rep.deploy();
  const zrx = await Zrx.deploy();

  await dex.deployed();
  await bat.deployed();
  await dai.deployed();
  await rep.deployed();
  await zrx.deployed();

  console.log(dex.address);

  await Promise.all([
    dex.addToken(DAI, dai.address),
    dex.addToken(BAT, bat.address),
    dex.addToken(REP, rep.address),
    dex.addToken(ZRX, zrx.address),
  ]);

  const amount = hre.ethers.utils.parseEther("1000");

  const seedTokenBalance = async (token, trader) => {
    await token.faucet(trader.address, amount);

    await token.connect(trader).approve(dex.address, amount);
    const ticker = await token.name();
    await dex
      .connect(trader)
      .deposit(amount, hre.ethers.utils.formatBytes32String(ticker));
  };

  await Promise.all(
    [dai, bat, rep, zrx].map((token) => seedTokenBalance(token, trader1))
  );

  await Promise.all(
    [dai, bat, rep, zrx].map((token) => seedTokenBalance(token, trader2))
  );
  await Promise.all(
    [dai, bat, rep, zrx].map((token) => seedTokenBalance(token, trader3))
  );
  await Promise.all(
    [dai, bat, rep, zrx].map((token) => seedTokenBalance(token, trader4))
  );

  const increaseTime = async (seconds) => {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  };

  await dex.connect(trader1).createLimitOrder(BAT, 1000, 10, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1000, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1200, 11, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1200, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1200, 15, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1200, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1500, 14, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1500, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 2000, 12, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 2000, SIDE.SELL);

  await dex.connect(trader1).createLimitOrder(REP, 1000, 2, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 1000, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 500, 4, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 500, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 800, 2, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 800, SIDE.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 1200, 6, SIDE.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 1200, SIDE.SELL);

  //create orders
  await Promise.all([
    // dex.connect(trader1).createLimitOrder(BAT, 1400, 10, SIDE.BUY),
    // dex.connect(trader2).createLimitOrder(BAT, 1200, 11, SIDE.BUY),
    // dex.connect(trader2).createLimitOrder(BAT, 1000, 12, SIDE.BUY),
    // dex.connect(trader1).createLimitOrder(REP, 3000, 4, SIDE.BUY),
    // dex.connect(trader1).createLimitOrder(REP, 2000, 5, SIDE.BUY),
    // dex.connect(trader2).createLimitOrder(REP, 500, 6, SIDE.BUY),
    // dex.connect(trader1).createLimitOrder(ZRX, 4000, 12, SIDE.BUY),
    // dex.connect(trader1).createLimitOrder(ZRX, 3000, 13, SIDE.BUY),
    // dex.connect(trader2).createLimitOrder(ZRX, 500, 14, SIDE.BUY),
    // // dex.connect(trader3).createLimitOrder(BAT, 2000, 16, SIDE.SELL),
    // dex.connect(trader4).createLimitOrder(BAT, 3000, 15, SIDE.SELL),
    // dex.connect(trader4).createLimitOrder(BAT, 500, 14, SIDE.SELL),
    // dex.connect(trader3).createLimitOrder(REP, 4000, 10, SIDE.SELL),
    // dex.connect(trader3).createLimitOrder(REP, 2000, 9, SIDE.SELL),
    // dex.connect(trader4).createLimitOrder(REP, 800, 8, SIDE.SELL),
    // dex.connect(trader3).createLimitOrder(ZRX, 1500, 23, SIDE.SELL),
    // dex.connect(trader3).createLimitOrder(ZRX, 1200, 22, SIDE.SELL),
    // dex.connect(trader4).createLimitOrder(ZRX, 900, 21, SIDE.SELL),
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
