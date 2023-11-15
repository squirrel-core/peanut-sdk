import { ethers } from 'ethersv5'
import { expect, it, describe, jest } from '@jest/globals'
import peanut from '../../src/index'

describe('createClaimXChainPayload tests', function () {
	afterEach(() => {
		jest.restoreAllMocks()
	})
	it('should create a cross-chain payload', async function () {
		const isTestnet = true
		const link = 'https://peanut.to/claim#?c=5&v=v5&i=10&p=jC2xwZMTFPuhFaTh&t=sdk'
		const recipient = '0x6B3751c5b04Aa818EA90115AA06a4D9A36A16f02'
		const destinationChainId = '59140' // linea testnet (should have liquidity)
		const destinationToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
		const maxSlippage = 10 // 10%

		// mock squid route:
		////////////////////////////
		// this doesn't work
		const mockSquidRouteResponse = {
			params: {
				integratorId: 'peanut-api',
				collectFees: { feeLocation: 'NONE' },
				slippage: 10,
				toAddress: '0x6B3751c5b04Aa818EA90115AA06a4D9A36A16f02',
				fromAddress: '0x6B3751c5b04Aa818EA90115AA06a4D9A36A16f02',
				fromAmount: '1000000000000000',
				toToken: {
					chainId: 59140,
					address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
					name: 'ETH',
					symbol: 'ETH',
					decimals: 18,
					logoURI: 'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
					coingeckoId: 'ethereum',
				},
				fromToken: {
					chainId: 5,
					address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
					name: 'Ethereum',
					symbol: 'ETH',
					decimals: 18,
					logoURI: 'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
					coingeckoId: 'ethereum',
					commonKey: 'eth-wei',
				},
				toChain: '59140',
				fromChain: '5',
				enableForecall: 'true',
			},
			transactionRequest: {
				routeType: 'CALL_BRIDGE_CALL',
				targetAddress: '0x481A2AAE41cd34832dDCF5A79404538bb2c02bC8',
				data: '0x846a1bc6000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000004200000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d6000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000481a2aae41cd34832ddcf5a79404538bb2c02bc800000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000450a900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005615553444300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056c696e6561000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307834383141324141453431636433343833326444434635413739343034353338626232633032624338000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bc000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000000000580000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000009200000000000000000000000000000000000000000000000000000000000000a8000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b5860680000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d9b7849d3a49e287c8e448cea0aae852861c45450000000000000000000000000000000000000000000000000000000000048b4000000000000000000000000000000000000000000000000000000000002ad8010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b5860680000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c00000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000d9b7849d3a49e287c8e448cea0aae852861c454500000000000000000000000000000000000000000000000000000000002d361a00000000000000000000000000000000000000000000000000000042d9ef2e2b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000242e1a7d4d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				value: '1041040028479509',
				gasLimit: '373584',
				gasPrice: '15',
				maxFeePerGas: '1500000026',
				maxPriorityFeePerGas: '1500000000',
			},
		}
		jest.spyOn(peanut, 'getSquidRoute').mockResolvedValue(mockSquidRouteResponse)
		////////////////////////////

		const payload = await peanut.createClaimXChainPayload(
			isTestnet,
			link,
			recipient,
			destinationChainId,
			destinationToken,
			maxSlippage
		)
		console.log('===========================================')
		console.log(payload)
		console.log('===========================================')

		expect(payload).toBeDefined()
		expect(payload.recipientAddress).toBe(recipient)
		expect(String(payload.tokenAmount)).toBe(ethers.utils.parseEther('0.1').toString())
		// expect(payload.chainId).toBe(destinationChainId)
		// expect(payload.contractVersion).toBe('v5')

		expect(payload.hash).toBe('0x3865cdaebe39ed49d298d299f860d2ec22f5fdf4e795c4d967a180c88dae5c37')
		expect(payload.signature).toBe(
			'0xa7d36702fc9988aa87a339db23528d2b0178f6f3c1e11feef4e181a818410c5b3c6b1f2f9081ffa8ae399d340e8a85b7a64c34eff4293f86c570f35a2ef6b2521c'
		)
		expect(payload.transactionRequest.data).toBe(
			'0x846a1bc6000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000004200000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d6000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000481a2aae41cd34832ddcf5a79404538bb2c02bc800000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000450a900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005615553444300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056c696e6561000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307834383141324141453431636433343833326444434635413739343034353338626232633032624338000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bc000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000000000580000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000009200000000000000000000000000000000000000000000000000000000000000a8000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b5860680000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d9b7849d3a49e287c8e448cea0aae852861c45450000000000000000000000000000000000000000000000000000000000048b4000000000000000000000000000000000000000000000000000000000002ad8010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000254d06f33bdc5b8ee05b2ea472107e300226659a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006aa397cab00a2a40025dbf839a83f16d5ec7c1eb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b5860680000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c00000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000d9b7849d3a49e287c8e448cea0aae852861c454500000000000000000000000000000000000000000000000000000000002d361a00000000000000000000000000000000000000000000000000000042d9ef2e2b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000f56dc6695cf1f5c364edebc7dc7077ac9b586068000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000242e1a7d4d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002c1b868d6596a18e32e61b901e4060c872647b6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006b3751c5b04aa818ea90115aa06a4d9a36a16f02000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
		)
	}, 20000)
})
