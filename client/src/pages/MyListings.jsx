import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const MyListings = ({ NFT, marketplace, account }) => {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const loadListedItems = async () => {
        // Load all sold items that the user listed
        const itemCount = await marketplace.itemCount()
        let listedItems = []
        let soldItems = []
        for (let indx = 1; indx <= itemCount.toNumber(); indx++) {
            const i = await marketplace.items(indx)
            if (i.seller.toLowerCase() === account) {
                // use uri to fetch the nft metadata stored on ipfs 
                const metadata = await NFT.getToken(indx)
                // get total price of item (item price + fee)
                const totalPrice = await marketplace.getTotalPrice(i.itemId)
                // define listed item object
                let item = {
                    totalPrice,
                    price: i.price,
                    itemId: i.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                }
                listedItems.push(item)
                // Add listed item to sold items array if sold
                if (i.sold) soldItems.push(item)
            }
        }
        setLoading(false)
        setListedItems(listedItems)
        setSoldItems(soldItems)
    }
    useEffect(() => {
        if (account) loadListedItems()
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
        <div className={`justify-center ${soldItems.length > 0 ? 'flex-row' : 'flex-col'}`}>
            {listedItems.length > 0 ? (
                <div className='mx-8'>
                    <h2 className='text-2xl font-semibold text-center mt-4'>Listed Items</h2>
                    <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                        {listedItems.map((item, index) => (
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
                </div>
            ) : (
                <main style={{ padding: "1rem 0" }}>
                    <h2>No listed items</h2>
                </main>
            )}
            {soldItems.length > 0 && (
                <div className='mx-8 mb-8'>
                    <h2 className='text-2xl font-semibold text-center mt-4'>Sold Items</h2>
                    <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                        {soldItems.map((item, index) => (
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
                </div>
            )}
        </div>
    )
}

export default MyListings