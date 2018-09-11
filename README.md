# Dependancies
 * ganache-cli
 * truffle
 * MetaMask (browser extension or other tool to connect to a blockchain network)


# Development environment
## Private blockchain network
Launch a local etherneum network using ganache
```bash
# Terminal 1 (keep running)
# -p <listening-port>
# -b <block-minning-speed-in-seconds>
ganache-cli -p 7545 -b 3
```
Save the HD Wallet Mnemonic for later use (~10 words string).
```
HD Wallet
==================
Mnemonic: physical engage misery rival check frequent range runway ability radio violin
```

## Connect your browser to the netwok
Connect to the new network using the HD Wallet mnemonic. On MetaMask it's
achieved by using the `Import using account seed phrase` button and creating
a password to access it. Then in the list of networks use `Custom RPC` and type
the local address `http://127.0.0.1:7545`. Then you're connected.


## Compile and deploy the contracts
Inside the project directory:
Compile the contracts and push them to the local blockchain.
```bash
# Will check and compile the contracts to the ./build diretory
truffle compile
# Will make transactions on the network to register the contracts
truffle migrate
```

## Serve the client
Inside the ./client directory:
Launch the test front-end. It's a self served react app.
```bash
# Terminal 2 (keep running)
# Install dependancies
npm i
# Lauch development server (with live-reload)
npm start
```

## Workflow
Now you can edit the code of the front end. Updates will show in your browser
automatically. Edits done to the contracts needs to be sent to the blockchain
manually with `truffle migrate --reset`.
