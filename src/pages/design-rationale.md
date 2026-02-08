---
layout: ../layouts/MarkdownLayout.astro
---

# Design Rationale

The design of the chain itself is pretty simple. There were a couple decisions that I've made, and the rest are basically required. 
Here is what I consider required (and I imagine you too):
- Mining that isn't instant (but not too long for demo purposes)
- A hashing algorithm with few enough collisions
- A nonce, and the content of the block, as inputs into the hash
- Adding and removing blocks from the chain


I consider these required because this chain is supposed to be simple and educational.
More complicated ways of creating hashes, actual mining (as in taking minutes), and merkle trees as content felt outside the scope of this assignment.
But, I still wanted to convey the ways that blockchains are secure. That means still having mining, an okay enough hashing algorithm, and a nonce + content in the hash.
If any of those things were omitted, then the blockchain would not really be a blockchain or would be terrible security wise.


## The Decisions I Made
Below are some of the decisions that I made.


### The Proof of Work (PoW)
I chose four 0's for the proof of work based on a couple things. This was mainly the "Mining that isn't instant" point from above, but actually realized. I found that four 0's was a sweet spot between not too long and too long.

I found that four 0's in my mind felt absurdly rare, a one in ten thousand chance. This helps convey that although this is just an educational exercise, it still demonstrates the inherent security in the blockchain. Also keeping in mind that real PoWs are many times more difficult than four 0's really puts into perspective the scale of blockchain.


### Including the Previous Block's Hash
Another decision was including the previous block's hash in the current block's hash. I mainly did this to again add to security and understanding.

Having one block changing visibly invalidating the entire rest of the chain really helped demonstrate how difficult tampering with the chain would be. On a chain of this scale, you would lose simple minutes, but on real chains, it could be days, weeks, or even longer. Having just one block turn red just didn't give the same effect more me.

Additionally, this improve security as instead of just needing to recalculate the PoW of one or two blocks, all blocks after need to have their PoW redone. This greatly increases the resource investment needed to modify the chain.


## The Hashing Algorithm
Onto the real meat and potatoes, here is the hash function, that's a pretty heavily modified version of this one: [Jenkin's Hash Function](https://en.wikipedia.org/wiki/Jenkins_hash_function).
Also note that I've rewritten it in psuedocode, rather than the direct source code for ease of understanding.

```py
# A simple addition and xorshift algorithm

# Inputs
nonce = ...      # an arbitrarily large number
prev_hash = ...  # the hash of the previous block
content = ...    # a string of characters

# The previous hash is included by just appending it to the beginning of the content
data = prev_hash + content

result = 0xFFFF_FFFF_FFFF_FFFF  # Initial hash value is just the max 64 bit number value


"""
Now hash the nonce value
"""
while nonce > 0:

    # Take the first 64 bits of the nonce
    nonceChunk = nonce & 0xFFFF_FFFF_FFFF_FFFF
    nonce >>= 64

    # Add it to the hash, then do some xorshifting with prime numbers
    result += nonceChunk
    result ^= result >> 17
    result += result << 37
    result ^= result >> 41


"""
Now do the actual data
"""
while data > 0 {

    # Again, take the first 64 bits of the data
    dataChunk = data & 0xFFFF_FFFF_FFFF_FFFF
    data >>= 64

    # Add it to the hash, then do some xorshifting with prime numbers
    result += dataChunknonceChunk
    result ^= result >> 17
    result += result << 37
    result ^= result >> 41
}


"""
Do some final transformations
"""
result += result >> 19
result ^= result << 31
result += result >> 13

return result
```

### Explanation
Let me explain the high level overview of the hashing function. It performs in essentially 3 steps:
 - Hash nonce (the first while loop)
 - Hash data (the second while loop)
 - final transformations (everything at the end)

You can see these three steps by the comments wrapped in triple double quotes ("""). These steps were based on the Jenkin's Hashing Function.

The actual hashing relies on an operation called xorshift, which is performing an exclusive or (XOR) operation along with a shift operation. This pretty reliably jumbles the bits of the data. I'm not super knowledgeable about hashing, but I think more than anything, the choice of numbers for the shift operation matters the most. The biggest thing is to use prime numbers, which is why all of my shifts have prime operands. Additionally, I made sure to switch the direction of each shift operation to not just lose all my data by shifting it off the edge of the number.

This creates a reliable enough hashing algorithm that is also not too slow.