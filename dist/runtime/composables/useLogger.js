import { useNuxtApp } from "#app";
export function useLogger() {
  const { $logger } = useNuxtApp();
  if (!$logger) {
    throw new Error(
      "Logger not available. Make sure the winston plugin is properly initialized."
    );
  }
  return $logger;
}
