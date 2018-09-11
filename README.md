# Dependancies
 * ganache-cli
 * truffle
 * MetaMask


# Development environment

Lauch a local etherneum network
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

Inside the project directory:
Compile the contracts and push them to the local blockchain.
```bash
# Will check and compile the contracts to the ./build diretory
truffle compile
# Will make transactions on the network to register the contracts
truffle migrate
```

Inside the ./client directory:
Launch the test front-end. It's a self served react app.
```bash
# Install dependancies
npm i
# Lauch development server (with live-reload)
npm start
```

Now you can edit the code of the front end. Updates will show in your browser
automatically. Edits done to the contracts needs to be sent to the blockchain
manually with `truffle migrate --reset`.
