import React from 'react'
import { Link } from 'react-router-dom';

const Navigation = ({ web3Handler, account }) => {
    const handleClick = () => {
        const navToggle = document.getElementsByClassName("toggle");
        for (let i = 0; i < navToggle.length; i++) {
            navToggle.item(i).classList.toggle("hidden");
        }
    }

    return (
        <nav className="flex flex-wrap items-center justify-between p-3 bg-teal-200">
            <img src="https://tailwindflex.com/public/favicon.ico" className="h-10 w-10" alt="ACME" width="120" />
            <div className="flex md:hidden">
                <button onClick={handleClick}>
                    <img className="toggle block" src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png" alt='toggle block' width="40" height="40" />
                    <img className="toggle hidden" src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png" alt='toggle hidden' width="40" height="40" />
                </button>
            </div>
            <div className="toggle hidden w-full md:w-auto md:flex text-right text-bold mt-5 md:mt-0 border-t-2 border-blue-900 md:border-none">
                <Link to="/" className='block md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none'>Home</Link>
                <Link to="/mint" className='block md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none'>Mint</Link>
                <Link to="/my-listings" className='block md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none'>My Listings</Link>
                <Link to="/my-purchases" className='block md:inline-block text-blue-900 hover:text-blue-500 px-3 py-3 border-b-2 border-blue-900 md:border-none'>My Purchases</Link>
            </div>
            {account ? (
                <button className="toggle hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button className="toggle hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded" id="connect-wallet" onClick={web3Handler}>
                    Connect Wallet
                </button>
            )}
        </nav>
    )
}

export default Navigation