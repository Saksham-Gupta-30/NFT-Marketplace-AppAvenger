import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const MyPurchases = ({ NFT, marketplace, account }) => {
    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])
    const loadPurchasedItems = async () => {
        const filter = marketplace.filters.Bought(null, null, null, null, null, account)
        const results = await marketplace.queryFilter(filter)
        //Fetch metadata of each nft and add that to listedItem object.
        const purchases = await Promise.all(results.map(async i => {
            // fetch arguments from each result
            i = i.args
            console.log(i)
            // use uri to fetch the nft metadata stored on ipfs 
            // const response = await fetch(uri)
            const metadata = await NFT.getToken(i.tokenId)
            // get total price of item (item price + fee)
            const totalPrice = await marketplace.getTotalPrice(i.itemId)
            // define listed item object
            let purchasedItem = {
                totalPrice,
                price: i.price,
                itemId: i.itemId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
            }
            return purchasedItem
        }))
        setLoading(false)
        setPurchases(purchases)
    }
    useEffect(() => {
        if (account) loadPurchasedItems()
        else {
            const element = document.getElementById("connect-wallet")
            if (element) element.click()
        }
        // eslint-disable-next-line
    }, [account])
    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className='flex justify-center'>
            {purchases.length > 0 ? (
                <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                    {purchases.map((item, index) => (
                        <div className="rounded-xl relative shadow-card hover:shadow-cardhover card border-gray-400 w-64 border-2 h-full">
                            <img
                                alt="Home"
                                src={item.image}
                                className="h-56 w-full rounded-md object-cover"
                            />
                            <div className="mt-2 px-2">
                                <div>
                                    <div className="text-sm text-gray-500">{ethers.utils.formatEther(item.totalPrice)} ETH</div>
                                </div>
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                </div>
                                <div className="mb-4 flex items-center gap-8 text-xs">
                                    <p className='overflow-hidden truncate'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <main style={{ padding: "1rem 0" }}>
                    <h2>No purchases</h2>
                </main>
            )}
        </div>
    )
}

export default MyPurchases