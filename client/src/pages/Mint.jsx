import { ethers } from 'ethers'
import React, { useState } from 'react'
import { Web3Storage } from 'web3.storage'
import { useNavigate } from 'react-router-dom'

import { Loader } from '../components'

const Mint = ({ NFT, marketplace }) => {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    const navigate = useNavigate()

    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })

    const uploadToIPFS = async () => {
        if (selectedFile !== null) {
            try {
                const response = await client.put([selectedFile])
                // console.log(response)
                const cid = response
                setImage(`https://ipfs.io/ipfs/${cid}/${selectedFile.name}`)
                // console.log(cid)
            } catch (err) {
                console.log(err)
            }
        } else {
            alert('Please select a file')
        }
    }

    const mintNFT = async (e) => {
        e.preventDefault()
        if (!name || !description || !price) {
            alert('Please fill in all fields')
            return
        }
        try {
            if (!selectedFile) {
                alert('File not selected')
                return
            }
            await uploadToIPFS(selectedFile)
            if (image === "") {
                alert('Try Again')
                return
            }
            try {
                mintThenList({ image })
            } catch (err) {
                alert("Upload failed")
            }
        } catch (err) {
            alert("Upload failed")
        }
    }

    const mintThenList = async ({ image }) => {
        setLoading(true)
        if (!image || !name || !description || !price) {
            alert('Please fill in all fields')
            return
        }
        const uri = await NFT.tokenCount()
        // console.log({ name, description, price, image })
        console.log(name, description, image, price)
        const tokenUri = uri.toString()
        await (await NFT.mint(tokenUri)).wait()
        const tokenId = await NFT.tokenCount()
        console.log(tokenId)
        await(await NFT.createToken(name, description, image, ethers.utils.parseUnits(price, 18))).wait()
        await (await NFT.setApprovalForAll(marketplace.address, true)).wait()

        const listingPrice = ethers.utils.parseEther(price)
        await (await marketplace.makeItem(NFT.address, tokenId, listingPrice)).wait()
        setLoading(false)
        alert('NFT minted successfully!')
        setSelectedFile(null)
        navigate('/')
    }

    const handleChange = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        console.log(file)
        setSelectedFile(file)
    }

    return (
        <div>
            {loading && <Loader text="Please Wait..." />}
            <div className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-[550px] bg-white">
                    <form className="py-4 px-9">
                        <div className="mb-5">
                            <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                                Name
                            </label>
                            <input type="text" name="name" id="name" placeholder="NFT Name" value={name}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="description" className="mb-3 block text-base font-medium text-[#07074D]">
                                Description
                            </label>
                            <input type="text" name="description" id="description" placeholder="NFT Description" value={description}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="price" className="mb-3 block text-base font-medium text-[#07074D]">
                                Price
                            </label>
                            <input type="number" name="price" id="price" placeholder="ETH" value={price}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" onChange={(e) => setPrice(e.target.value)} />
                        </div>

                        <div className="mb-6 pt-4">
                            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                                Upload File
                            </label>

                            <div className="mb-8">
                                <input type="file" name="file" id="file" className="sr-only" onChange={handleChange} />
                                <label htmlFor="file"
                                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                                    <div>
                                        <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                            Drop files here
                                        </span>
                                        <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                            Or
                                        </span>
                                        <span
                                            className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                            Browse
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <button
                                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                                onClick={mintNFT}
                            >
                                Mint NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Mint