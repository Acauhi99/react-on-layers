import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemeProvider>>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
