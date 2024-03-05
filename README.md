<div align="center">
<h1> expensio-meter 💸 </h1>

Compare currencies based on values you find expensive or cheap  <br />
Web • Linux • macOS • Windows <br />

![License](https://img.shields.io/github/license/nidnogg/expensio-meter?style=for-the-badge)
![Size](https://img.shields.io/github/repo-size/nidnogg/expensio-meter?color=orange&logo=rust&style=for-the-badge)
![Stars](https://img.shields.io/github/stars/nidnogg/expensio-meter?color=red&style=for-the-badge)
</div>

## About
expensio-meter is a simple web app built for trying to figure out if something is expensive or not when travelling, according to values you know about

## How to Use
For a better idea, check out the [live demo](https://nidnogg.github.io/expensio-meter/). The idea is that you select your home country, add increasing values of things that you find cheap, moderately cheap and so forth.

Then, add a country to compare and you can get a better idea of how values scale. You can then save that value to `localStorage` for later use.


## Setup
Most of the dev environment was initially bootstrapped using `bun`, but later on it was migrated to `pnpm`. 
Using `pnpm` is advised, especially if you add any dependencies, but not really essential.

> [!WARNING]  
> Keep in mind that `.pnpm-lock.yaml` has to match the `package.json`, so CI/CD runs of `bun` installed builds will likely fail.

First, run 
```bash
pnpm install
# alternatively 
# bun install
```

Then, 
```bash
pnpm dev
# alternatively 
# bun dev
```

## Contributing
Feel free to open up a PR for any [issues listed](https://github.com/nidnogg/expensio-meter/issues) in this repo, or for any improvements you'd like to see made.

Bug reports are also welcome and will be promptly considered.


