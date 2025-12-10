import Logo from "@/components/Logo";
import ActionCard from "@/components/ActionCard";
import FeatureCard from "@/components/FeatureCard";
import { UserPlus, ShieldCheck, Zap, Shield, ScanFace } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sistema avançado de reconhecimento facial com tecnologia de IA para
            identificação segura e precisa
          </p>
        </header>

        {/* Main Actions */}
        <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <ActionCard
            icon={UserPlus}
            title="Cadastrar Rosto"
            description="Registre seu rosto no sistema de forma segura e rápida"
            buttonText="Começar Cadastro"
            href="/cadastro"
            variant="primary"
          />
          <ActionCard
            icon={ShieldCheck}
            title="Verificar Identidade"
            description="Confirme sua identidade através do reconhecimento facial"
            buttonText="Verificar Agora"
            href="/verificar"
            variant="secondary"
          />
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Zap}
            title="Reconhecimento Rápido"
            description="Identificação em menos de 1 segundo com alta precisão"
          />
          <FeatureCard
            icon={Shield}
            title="Segurança Avançada"
            description="Algoritmos de IA para máxima segurança e privacidade"
          />
          <FeatureCard
            icon={ScanFace}
            title="Tecnologia Moderna"
            description="Processamento local no navegador, sem envio de dados"
          />
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-sm">
          <p>© 2024 FaceID - Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
