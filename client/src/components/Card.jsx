import React from 'react'
import { ethers } from 'ethers'

const Card = ({ item, buyMarketItem, account }) => {
    return (
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
            {account !== item.seller.toLowerCase() && (
                <div className='flex justify-center items-center'>
                    <button onClick={() => buyMarketItem(item)} className='bg-purple-700 p-2 m-2 w-1/2 '>
                        Buy
                    </button>
                </div>
            )}
        </div>
    )
}

export default Card