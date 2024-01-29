// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../package.json')

export const VERSION = pjson.version

// CONSTANTS
export const TOKEN_TYPES = Object.freeze({
	ETH: 0,
	ERC20: 1,
	ERC721: 2,
	ERC1155: 3,
})

// CONTRACT VERSIONS
// TODO: rename CONTRACT to VAULT
export const LATEST_STABLE_CONTRACT_VERSION = 'v4.2'
export const LATEST_EXPERIMENTAL_CONTRACT_VERSION = 'v4.2'
export const FALLBACK_CONTRACT_VERSION = 'v4'
export const LATEST_STABLE_ROUTER_VERSION = 'Rv4'
export const LATEST_EXPERIMENTAL_ROUTER_VERSION = 'Rv4'
export const LATEST_STABLE_BATCHER_VERSION = 'Bv4'
export const LATEST_EXPERIMENTAL_BATCHER_VERSION = 'Bv4'