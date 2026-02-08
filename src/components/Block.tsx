import { useRef, type InputEvent } from "react"
import hashFunc, { HASH_LENGTH_STRING } from "../lib/hash";
import "./Block.css"

function verifyProofOfWork(hash: string) {
    return hash.startsWith("0000")
}

export interface BlockProps {
    nonce: bigint
    onNonceChange: (nonce: bigint) => void
    content: string
    onContentChange: (content: string) => void
    previousHash?: string
    hash: string
    onMining?: (isMining: boolean) => void
    canMine: boolean
    onDelete: () => void
}

export default function Block({ nonce, onNonceChange, content, onContentChange, previousHash, hash, onMining, canMine, onDelete }: BlockProps) {
    const animateIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const miningIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

    function stopMining() {
        clearInterval(miningIntervalRef.current)
        clearInterval(animateIntervalRef.current)
        miningIntervalRef.current = undefined
        animateIntervalRef.current = undefined
        if (onMining !== undefined) {
            onMining(false)
        }
    }

    function mine() {
        if (onMining !== undefined) {
            onMining(true)
        }

        let tempHash = hash
        let tempNonce = nonce
        const data = (previousHash ?? "") + content

        miningIntervalRef.current = setInterval(() => {
            // Hash in groups to speed up hashing
            for (let i = 0; i < 31 && !verifyProofOfWork(tempHash); i++) {    
                tempNonce++
                tempHash = hashFunc(data, tempNonce).toString(16).padStart(HASH_LENGTH_STRING, "0")
            }

            if (verifyProofOfWork(tempHash)) {
                stopMining()
                onNonceChange(tempNonce)
            }
        }, 0);

        animateIntervalRef.current = setInterval(() => {
            onNonceChange(tempNonce)
        }, 1000 / 15);
    }

    function nonceChange(ev: InputEvent<HTMLInputElement>) {
        stopMining()
        onNonceChange(BigInt(ev.currentTarget.value))
    }

    function contentChange(ev: InputEvent<HTMLTextAreaElement>) {
        stopMining()
        onContentChange(ev.currentTarget.value)
    }

    return (
        <div className={"container" + (verifyProofOfWork(hash) ? "" : " invalid")}>
            <button className="delete-button" onClick={onDelete} disabled={!canMine}>Delete</button>
            <h2 className="hash-header">{hash}</h2>
            <div className="input-container">
                <label className="input-label">Previous Hash</label>
                <input className="input" type="text" disabled value={previousHash ?? ""}/>
            </div>
            <div className="input-container">
                <label className="input-label">Nonce</label>
                <input className="input" type="number" step="1" min="0" value={nonce.toString()} onInput={nonceChange} />
            </div>
            <div className="input-container">
                <label className="input-label">Content</label>
                <textarea className="input" value={content} onInput={contentChange} />
            </div>
            <button className="mine-button" onClick={mine} disabled={!canMine}>
                Mine
            </button> 
        </div>
    )
}