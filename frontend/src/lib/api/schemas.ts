import { z } from 'zod';

const hex32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'expected 0x + 64 hex');
const address = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'expected 0x + 40 hex');

export const Confidence = z.enum(['High', 'Medium', 'Low', 'Unverified']);
export type Confidence = z.infer<typeof Confidence>;

export const Evidence = z.object({
  title: z.string(),
  source: z.string(),
  url: z.string().optional().default(''),
  excerpt: z.string().optional().default(''),
  claim: z.string().optional().default(''),
  confidence: Confidence,
  hash: hex32,
});
export type Evidence = z.infer<typeof Evidence>;

export const AnalyzeRequest = z.object({
  productName: z.string().min(1),
  productUrl: z.string().optional(),
  brand: z.string().optional(),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequest>;

export const AnalyzeResponse = z.object({
  productName: z.string(),
  brand: z.string().optional().default(''),
  score: z.number().int().min(0).max(100),
  grade: z.string(),
  summary: z.string().optional().default(''),
  findings: z.array(z.string()).default([]),
  evidences: z.array(Evidence).default([]),
  reportHash: hex32,
  evidenceMerkleRoot: hex32,
  reportURI: z.string(),
  metadataURI: z.string(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponse>;

export const MintRequest = z.object({
  to: address,
  productName: z.string().min(1),
  brand: z.string(),
  score: z.number().int().min(0).max(100),
  grade: z.string(),
  reportHash: hex32,
  evidenceMerkleRoot: hex32,
  metadataURI: z.string(),
});
export type MintRequest = z.infer<typeof MintRequest>;

export const MintResponse = z.object({
  tokenId: z.union([z.number(), z.string()]).transform((v) => BigInt(v)),
  transactionHash: hex32,
  contractAddress: address,
});
export type MintResponse = z.infer<typeof MintResponse>;

export const AnalyzeAndMintRequest = AnalyzeRequest.extend({ to: address });
export type AnalyzeAndMintRequest = z.infer<typeof AnalyzeAndMintRequest>;

export const AnalyzeAndMintResponse = AnalyzeResponse.merge(
  MintResponse.pick({ tokenId: true, transactionHash: true, contractAddress: true }),
);
export type AnalyzeAndMintResponse = z.infer<typeof AnalyzeAndMintResponse>;

export const FullReport = z.object({
  productName: z.string(),
  brand: z.string().optional().default(''),
  score: z.number().int().min(0).max(100),
  grade: z.string(),
  summary: z.string().optional().default(''),
  positiveSignals: z.array(z.string()).optional().default([]),
  riskSignals: z.array(z.string()).optional().default([]),
  greenwashingRisk: z.string().optional().default(''),
  findings: z.array(z.string()).default([]),
  evidences: z.array(Evidence).default([]),
  alternatives: z.array(z.string()).optional().default([]),
  createdAt: z.string().optional(),
});
export type FullReport = z.infer<typeof FullReport>;

export const GetReportResponse = z.object({
  reportHash: hex32,
  reportURI: z.string(),
  report: FullReport,
});
export type GetReportResponse = z.infer<typeof GetReportResponse>;
