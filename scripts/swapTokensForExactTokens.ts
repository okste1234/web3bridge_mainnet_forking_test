import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

    await helpers.impersonateAccount(USDCHolder);
    const impersonatedSigner = await ethers.getSigner(USDCHolder);

    const amountOut = ethers.parseUnits("200000000", 6);
    const amountInMax = ethers.parseUnits("30000000000000000000000", 18);

    const USDC = await ethers.getContractAt("IERC20", USDCAddress);
    const DAI = await ethers.getContractAt("IERC20", DAIAddress);

    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);USDCAddress

    const approveTx = await USDC.connect(impersonatedSigner).approve(UNIRouter, amountOut);
    await approveTx.wait();

    
    const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI.balanceOf(impersonatedSigner.address);

    console.log("-----------------------BEFORE SWAP------------------------------------------")


    console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6))
    console.log("DAI Balance:", ethers.formatUnits(daiBal, 18));


    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);



    const swapTx = await ROUTER.connect(impersonatedSigner).swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [USDCAddress, DAIAddress],
        impersonatedSigner.address,
        deadline
    );

    await swapTx.wait();


   
    const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
    const daiBalAfterSwap = await DAI.balanceOf(impersonatedSigner.address);

    console.log("-----------------------AFTER SWAP------------------------------------------")

  
    console.log("usdc balance after swap", ethers.formatUnits(usdcBalAfterSwap, 6) );
    console.log("dai balance after swap", ethers.formatUnits(daiBalAfterSwap, 18) );

   
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});