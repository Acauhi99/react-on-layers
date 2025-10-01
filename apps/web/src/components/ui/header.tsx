import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "./button";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function Header() {
  const { isAuthenticated, getUser, logout } = useAuthStore();
  const user = getUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const renderAuthSection = () => {
    if (!mounted) {
      return <div className="w-8 h-8 animate-pulse bg-muted rounded"></div>;
    }

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth" search={{ mode: "login" }}>
            Entrar
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/auth" search={{ mode: "register" }}>
            Cadastrar
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">FinanceApp</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}
