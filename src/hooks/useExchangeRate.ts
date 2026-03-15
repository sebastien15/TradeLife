import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/wallet.service';

/**
 * Live exchange rate with 30s stale time.
 * Returns { rate, isLoading, isError }
 */
export function useExchangeRate(from: string, to: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['exchangeRate', from, to],
    queryFn: () => walletService.getExchangeRate(from, to).then((r) => r.data),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
  return { rate: data?.rate ?? null, isLoading, isError };
}
