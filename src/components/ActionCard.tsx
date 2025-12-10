import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  variant?: "primary" | "secondary";
}

const ActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  href,
  variant = "primary" 
}: ActionCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="gradient-card gradient-border rounded-xl p-8 text-center transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-secondary/50">
          <Icon className="w-10 h-10 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6">{description}</p>
      <Button 
        variant={variant === "primary" ? "default" : "card"}
        size="lg"
        className="w-full"
        onClick={() => navigate(href)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ActionCard;
