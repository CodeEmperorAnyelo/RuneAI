// utils/error.ts
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function handleApiError(error: unknown) {
  const message = error instanceof AxiosError 
    ? error.response?.data?.message || error.message
    : 'An unexpected error occurred';
    
  toast.error(message);
  return message;
}