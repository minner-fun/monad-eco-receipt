import {
  EcoReceiptNFT_ABI,
  EcoReceiptNFT_ADDRESS,
  EcoReceiptNFT_CHAIN_ID,
} from './EcoReceiptNFT';

export const ecoReceiptNftAbi = EcoReceiptNFT_ABI;
export const ecoReceiptNftAddress = EcoReceiptNFT_ADDRESS as `0x${string}`;
export const ecoReceiptNftChainId = EcoReceiptNFT_CHAIN_ID;

export const DEPLOY_BLOCK = 30780616n;

export type EcoReceipt = {
  tokenId: bigint;
  productName: string;
  brand: string;
  score: number;
  grade: string;
  reportHash: `0x${string}`;
  evidenceMerkleRoot: `0x${string}`;
  metadataURI: string;
  timestamp: bigint;
  creator: `0x${string}`;
  auditor: `0x${string}`;
};
