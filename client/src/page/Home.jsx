import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';

const Home = () => {
  const { contract, walletAddress, gameData, setShowAlert, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const [wait, setWait] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      console.log('Registering... Contract:', contract);
      console.log('Wallet:', walletAddress);

      if (!contract) return alert('Contract not loaded');

      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        setWait(true);
        console.log('Sending transaction...');
        const tx = await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });
        console.log('Transaction sent:', tx);
        await tx.wait(); // Wait for transaction to be mined
        console.log('Transaction mined!');

        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`,
        });

        navigate('/create-battle');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setErrorMessage(error);
    } finally {
      setWait(false);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      console.log('Checks:', { playerExists, playerTokenExists, walletAddress });

      if (playerExists && playerTokenExists) navigate('/create-battle');
    };

    if (contract) createPlayerToken();
  }, [contract]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    walletAddress && (
      <div className="flex flex-col">
        <CustomInput
          label="Name"
          placeHolder="Enter your player name"
          value={playerName}
          handleValueChange={setPlayerName}
        />

        <CustomButton
          title={wait ? 'Registering...' : 'Register'}
          handleClick={handleClick}
          restStyles="mt-6"
          disabled={wait}
        />
      </div>
    )
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Assasin Assemble <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>,
);
