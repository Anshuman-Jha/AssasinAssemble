import { ethers } from "hardhat";

async function main() {
    // 1. Check the account configured in .env (the one that will deploy)
    const [deployer] = await ethers.getSigners();
    console.log(`\n--- Configured Deployer Account ---`);
    console.log(`Address: ${deployer.address}`);

    try {
        const balance = await deployer.getBalance();
        console.log(`Balance: ${ethers.utils.formatEther(balance)} Assasin`);

        if (balance.eq(0)) {
            console.warn("⚠️  WARNING: This account has 0 Tokens. Deployment will fail.");
        } else {
            console.log("✅ SUCCESS: This account has funds.");
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
    }

    // 2. Check the address the user specifically asked about
    const userAddress = "0x89C05DB8d878fC591E7CCCaBC01A631a5454ED7b";

    // Only check if it's different from the deployer to avoid duplicate logs
    if (deployer.address.toLowerCase() !== userAddress.toLowerCase()) {
        console.log(`\n--- User Mentioned Address ---`);
        console.log(`Address: ${userAddress}`);
        try {
            const userBalance = await ethers.provider.getBalance(userAddress);
            console.log(`Balance: ${ethers.utils.formatEther(userBalance)} Assasin`);
        } catch (error) {
            console.error("Error fetching balance for user address:", error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
