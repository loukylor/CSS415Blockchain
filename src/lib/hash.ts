// The length of a hash string
export const HASH_LENGTH_STRING = 16
export const HASH_LENGTH_BYTES = HASH_LENGTH_STRING / 2
export const MAX_HASH_VALUE = (2n ** BigInt(HASH_LENGTH_BYTES * 8)) - 1n

export default function hash(val: string | ArrayBuffer, nonce: bigint | number) {
    let buffer: Uint8Array

    // Convert val to buffer if it's a string
    if (typeof val == "string") {
        buffer = new TextEncoder().encode(val)
    } else {
        buffer = new Uint8Array(val)
    }

    // Ensure result is a bigint
    if (typeof nonce == "number") {
        nonce = BigInt(nonce)
    }

    // A simple addition and xorshift algorithm
    let i = 0
    let result = MAX_HASH_VALUE

    // First do the nonce value
    while (nonce > 0) {
        let nonceChunk = nonce & MAX_HASH_VALUE
        nonce >>= BigInt(HASH_LENGTH_BYTES * 8)

        result = _hashBitChunk(result, nonceChunk)
    }

    // Then the actual data
    while (i < buffer.byteLength) {
        let bufferItem = 0n
        for (let j = 0; i < buffer.byteLength && j < HASH_LENGTH_BYTES; j++) {
            bufferItem += BigInt(buffer[i] << (j * 8))
            i++
        }

        result = _hashBitChunk(result, bufferItem)
    }

    // Final random transformations
    result += result >> 19n
    result ^= result << 31n
    result += result >> 13n

    // Make sure it's the correct number of bits
    return result & MAX_HASH_VALUE
}

function _hashBitChunk(result: bigint, chunk: bigint) {
    result += chunk
    result ^= result >> 17n
    result += result << 37n
    result ^= result >> 41n
    
    return result & MAX_HASH_VALUE
}