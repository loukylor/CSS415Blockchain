---
layout: ../layouts/MarkdownLayout.astro
---

# Tradeoff Analysis
I touched on this in my design rationale, but I'll talk about it in full.

## Including the Previous Block's Hash in the Current Block's Hash
### Advantages
The main advantage is added security. If the previous block's hash was not included, then it would be as simple as:
- editing block 1
- remining block 1
- editing the previous hash value of block 2

to edit a block on the blockchain. That only requires remining a single block, which is a huge security flaw. If the hash of the previous block was included in the hash, then block 2 would have to be remined, then block 3, block 4, etc.

Another advantage is the added understanding. Due to this also being an educational exercise, there is benefit in improving the understandability of the blockchain. Having the entire chain turn red if one block is changed, and then having to individually remine each one, really demonstrates the near immutability of a chain. If it was as simple as remining a single block, there would be almost no point.

### Disadvantages
There's only one really, that's the added complexity. In a real world model, this may be really significant, but because this is very simple and small scale, there is virtually no cost. For me implementing it, having the previous block's hash as part of the current block didn't add much work.

## Proof of Work Being Four 0's in the Hash
### Advantages
The advantage of four 0's being proof of work is that it's simple and easy to understand. Other proof of work methods, or more complex methods like proof of stake, are harder to implement and understand. I think they are interesting, but the time it'd take to implement them, then create a UI, felt out of scope for this assignment.

The other advantage is four 0's felt just right in terms of how long mining takes. 5 took way too long, and 3 felt like it was too short. 4 was the goldilock's number, so to speak. While the speed of mining can also be tuned to better support three of five 0's, I also found that the current speed was a good balance between the amount of load on the processor and the actual mining speed.

### Disadvantages
The biggest disadvantage is that this proof of work method is old and outdated. It causes a lot of energy waste, and isn't generally used by newer chains. It would be more beneficial to learn about the newer methods, especially considering that this proof of work method does not need to be understood to understand newer methods, like proof of stake.

Another is the lost hashes due to having four 0's in each block's hash. Each 0 represents 4 bits of our 64 bit hash, and having four means that there are only 2^48 unique hashes that a block can have. 2^48 is still a very large number, but much, much, smaller than 2^64. In a real situation, this number will very likely be too small.

## Writing your own Hashing Algorithm
### Advantages
This was a great learning opportunity to see how hashes are actually made, which was surprisingly simple. I'm also proud that I made a hashing algorithm that's somewhat passable, at least in the context of this blockchain.

### Disadvantages
My algorithm is slow, and very, very far from being secure. It's virtually never a good idea to do anything cryptographically important using your own code. There are simply too many tiny shortfalls that can serve as very easy surfaces for attack to a well versed attacker.

I mentioned earlier that hashing functions are simple, but that's really only because they have to be fast. The number of very subtle decisions that do very subtle, but significant, things to the algorithm is innumerable. It's people's entire career to make algorithms like SHA and MD5. Something that I cook up myself in about an hour will not even come close to matching what the very smart researchers can do.