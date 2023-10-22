import React, { useState, useEffect } from 'react'

import { Card, Loader } from '../components'

const Home = ({ NFT, marketplace, account }) => {
    const [loading, setLoading] = useState(true)
    const [loader, setLoader] = useState(false)
    const [items, setItems] = useState([])

    const loadMarketplaceItems = async () => {
        // Load all unsold items
        console.log(marketplace)
        const itemCount = await marketplace.itemCount();
        console.log(itemCount)
        let items = []
        for (let i = 1; i <= itemCount.toNumber(); i++) {
            const item = await marketplace.items(i)
            if (!item.sold) {
                // get uri url from nft contract
                const metadata = await NFT.getToken(item.itemId)
                console.log(metadata)
                // get total price of item (item price + fee)
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                // Add item to items array
                items.push({
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                })
            }
        }
        setLoading(false)
        setItems(items)
    }

    const buyMarketItem = async (item) => {
        setLoader(true)
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
        setLoader(false)
        loadMarketplaceItems()
    }

    useEffect(() => {
        if (account) loadMarketplaceItems()
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
            {loader && <Loader text="Please Wait..." />}
            {items.length > 0 ? (
                <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                    {items.map((item, index) => (
                        <Card key={index} item={item} buyMarketItem={buyMarketItem} account={account} />
                    ))}
                </div>
            ) : (
                <h1>No items in marketplace</h1>
            )}
        </div>
    )
}

export default Home