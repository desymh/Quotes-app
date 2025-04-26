import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useLogin } from './context/LoginContext'; // pakai context login

export default function Index() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();
  const { isLoggedIn } = useLogin();

  useEffect(() => {
    if (!rootNavigation?.key) return;

    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login');
    }
  }, [rootNavigation, isLoggedIn]);

  return null;
}
