import { useState } from "react";
import Block, { type BlockProps } from "./Block";
import hash, { HASH_LENGTH_STRING } from "../lib/hash";
import { PlusCircle } from "iconoir-react";
import "./Chain.css"

interface BlockObject extends BlockProps { }

function calculateHash(block: BlockObject) {
    const hashValue = hash((block.previousHash ?? "") + block.content, block.nonce)
    block.hash = hashValue.toString(16).padStart(HASH_LENGTH_STRING, "0")
}

export default function Chain() {
    const [blocks, setBlocks] = useState<BlockObject[]>([])

    function onNonceChange(nonce: bigint, block: BlockObject) {
        block.nonce = nonce
        setBlocks([...blocks])
    }

    function onContentChange(content: string, block: BlockObject) {
        block.content = content
        setBlocks([...blocks])
    }

    function onIsMining(isMining: boolean) {
        for (const block of blocks) {
            block.canMine = !isMining
        }
    }

    function onDelete(block: BlockObject) {
        if (blocks.at(0)?.canMine !== true) {
            return;
        }

        const index = blocks.indexOf(block)
        if (index != -1) {
            blocks.splice(index, 1)
            setBlocks([...blocks])
        }
    }

    function addBlock() {
        const newBlock: BlockObject = {
            nonce: 0n,
            onNonceChange: nonce => onNonceChange(nonce, newBlock),
            content: "",
            onContentChange: content => onContentChange(content, newBlock),
            previousHash: blocks.at(-1)?.hash,
            hash: "",
            onMining: onIsMining,
            canMine: blocks.at(-1)?.canMine ?? true,
            onDelete: () => onDelete(newBlock)
        }
        calculateHash(newBlock)
        blocks.push(newBlock)
        setBlocks([...blocks])
    }

    let previous: BlockObject | undefined = undefined
    return (
        <div className="chain-container">
            <div className="block-container">
                {blocks.map((block, i) => {
                    block.previousHash = previous?.hash
                    block.onNonceChange = nonce => onNonceChange(nonce, block)
                    block.onContentChange = content => onContentChange(content, block),
                    block.onMining = onIsMining
                    block.onDelete = () => onDelete(block),
                    calculateHash(block)

                    const component = (
                        <Block {...block} key={i} />
                    )

                    previous = block
                    return component
                })}
            </div>
            <button className="add-button" onClick={addBlock} disabled={blocks.at(0)?.canMine === false}>
                <PlusCircle />
            </button>
        </div>
    )
}