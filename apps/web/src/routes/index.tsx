import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  PieChart,
  Target,
  Shield,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: TrendingUp,
      title: "Controle de Gastos",
      description:
        "Monitore suas receitas e despesas com categorização inteligente",
    },
    {
      icon: PieChart,
      title: "Relatórios Visuais",
      description:
        "Gráficos e dashboards para entender seus hábitos financeiros",
    },
    {
      icon: Target,
      title: "Metas de Investimento",
      description: "Defina e acompanhe suas metas de investimento mensais",
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description:
        "Seus dados financeiros protegidos com criptografia avançada",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Interface otimizada para uso em qualquer dispositivo",
    },
    {
      icon: BarChart3,
      title: "Análises Avançadas",
      description: "Relatórios mensais e anuais para decisões inteligentes",
    },
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Bem-vindo de volta!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Continue gerenciando suas finanças de forma inteligente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
            Controle Financeiro
            <br />
            Inteligente
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerencie suas finanças pessoais, acompanhe investimentos e tome
            decisões inteligentes com nossa plataforma completa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth" search={{ mode: "register" }}>
                Começar Gratuitamente
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth" search={{ mode: "login" }}>
                Já tenho conta
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Junte-se a milhares de usuários que já transformaram sua vida
            financeira
          </p>
          <Button size="lg" asChild>
            <Link to="/auth" search={{ mode: "register" }}>
              Criar Conta Gratuita
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
