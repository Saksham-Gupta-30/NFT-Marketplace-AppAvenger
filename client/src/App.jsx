import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ethers } from 'ethers'

import MarketplaceAbi from './artifacts/Marketplace.json'
import MarketplaceAddress from './artifacts/Marketplace-address.json'
import NFTAbi from './artifacts/NFT.json'
import NFTAddress from './artifacts/NFT-address.json'

import { Loader, Navigation } from './components'
import { Home, Mint, MyListings, MyPurchases } from './pages'

const App = () => {
    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState(null)
    const [NFT, setNFT] = useState({})
    const [marketplace, setMarketplace] = useState({})

    const web3Handler = async () => {
        setLoading(true)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = await provider.getSigner()

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        })

        window.ethereum.on('accountsChanged', async function (accounts) {
            setAccount(accounts[0])
            await web3Handler()
        })
        loadContracts(signer)
    }
    const loadContracts = async (signer) => {
        // Get deployed copies of contracts
        const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
        setMarketplace(marketplace)
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nft)
        setLoading(false)
    }

    return (
        <Router>
            <div>
                <>
                    <Navigation web3Handler={web3Handler} account={account} />
                </>
                <div>
                    {loading ? (
                        <Loader text="Awaiting Metamask Connection..." />
                    ) : (
                        <Routes>
                            <Route path="/" element={<Home NFT={NFT} marketplace={marketplace} account={account} />} />
                            <Route path="/mint" element={<Mint NFT={NFT} marketplace={marketplace} />} />
                            <Route path="/my-listings" element={<MyListings NFT={NFT} marketplace={marketplace} account={account} />} />
                            <Route path="/my-purchases" element={<MyPurchases NFT={NFT} marketplace={marketplace} account={account} />} />
                        </Routes>
                    )}
                </div>

            </div>
        </Router>
    )
}

export default App