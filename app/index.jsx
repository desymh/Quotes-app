import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (rootNavigation?.key) {
      router.replace('/login');
    }
  }, [rootNavigation]);

  return null;
}
