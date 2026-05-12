import { apiFetch } from './client';
import {
  AnalyzeRequest,
  AnalyzeResponse,
  AnalyzeAndMintRequest,
  AnalyzeAndMintResponse,
  GetReportResponse,
  MintRequest,
  MintResponse,
} from './schemas';

export const analyzeReceipt = (input: AnalyzeRequest) =>
  apiFetch('/api/receipts/analyze', {
    method: 'POST',
    body: input,
    parse: (d) => AnalyzeResponse.parse(d),
  });

export const mintReceipt = (input: MintRequest) =>
  apiFetch('/api/receipts/mint', {
    method: 'POST',
    body: input,
    parse: (d) => MintResponse.parse(d),
  });

export const analyzeAndMintReceipt = (input: AnalyzeAndMintRequest) =>
  apiFetch('/api/receipts/analyze-and-mint', {
    method: 'POST',
    body: input,
    parse: (d) => AnalyzeAndMintResponse.parse(d),
  });

export const fetchReport = (reportHash: `0x${string}`) =>
  apiFetch(`/api/reports/${reportHash}`, {
    method: 'GET',
    parse: (d) => GetReportResponse.parse(d),
  });
