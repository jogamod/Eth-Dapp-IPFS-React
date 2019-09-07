const Meme = artifacts.require("Meme")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Meme', (accounts) => {
    //Write tests here
    let meme

    before( async () => {
        meme = await Meme.deployed()
    })

    describe('deployment', async () => {

        it('deploys successfully', async() => {
            const address = meme.address
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })
    })

    describe('storage', async () => {
        it('updates the state', async() => {
            await meme.set('test')
            const memeHash = await meme.get()
            assert.equal('test', memeHash)
        })
    })
    
    
})