import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShieldX, Loader2, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import WebcamCapture from "@/components/WebcamCapture";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useToast } from "@/hooks/use-toast";

const Verificar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isModelLoaded, isLoading, error, detectFace, matchFace, getFaces } = useFaceDetection();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "scanning" | "success" | "notFound">("idle");
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [registeredCount, setRegisteredCount] = useState(0);

  useEffect(() => {
    setRegisteredCount(getFaces().length);
  }, [getFaces]);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const handleVerify = async () => {
    if (!videoRef.current || !isModelLoaded) {
      toast({
        title: "Câmera não disponível",
        description: "Aguarde a câmera e os modelos carregarem.",
        variant: "destructive",
      });
      return;
    }

    if (registeredCount === 0) {
      toast({
        title: "Nenhum rosto cadastrado",
        description: "Cadastre um rosto primeiro antes de verificar.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("scanning");
    setMatchedName(null);

    try {
      const detection = await detectFace(videoRef.current);

      if (!detection) {
        setVerificationStatus("notFound");
        toast({
          title: "Rosto não detectado",
          description: "Posicione seu rosto no centro da câmera.",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      const match = matchFace(detection.descriptor);

      if (match) {
        setVerificationStatus("success");
        setMatchedName(match.name);
        toast({
          title: "Identidade verificada!",
          description: `Bem-vindo(a), ${match.name}!`,
        });
      } else {
        setVerificationStatus("notFound");
        toast({
          title: "Rosto não reconhecido",
          description: "Este rosto não está cadastrado no sistema.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error verifying face:", err);
      setVerificationStatus("notFound");
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setVerificationStatus("idle");
    setMatchedName(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Logo />
          <div className="w-24" />
        </header>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Verificar Identidade
            </h1>
            <p className="text-muted-foreground">
              Posicione seu rosto e clique em verificar para confirmar sua identidade
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {registeredCount} rosto(s) cadastrado(s)
            </p>
          </div>

          {/* Loading Models */}
          {isLoading && (
            <div className="gradient-card gradient-border rounded-xl p-8 text-center mb-6">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Carregando modelos de IA...</p>
            </div>
          )}

          {/* Camera */}
          {!isLoading && !error && (
            <>
              <div className="gradient-card gradient-border rounded-xl p-4 mb-6 animate-fade-in">
                <WebcamCapture 
                  onStream={handleVideoReady}
                  isScanning={isVerifying}
                />
              </div>

              {/* Verification Result */}
              {verificationStatus === "success" && matchedName && (
                <div className="gradient-card gradient-border rounded-xl p-8 text-center mb-6 animate-scale-in">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-500 mb-2">
                    Identidade Verificada
                  </h2>
                  <p className="text-foreground text-lg">
                    Bem-vindo(a), <span className="font-semibold text-primary">{matchedName}</span>!
                  </p>
                </div>
              )}

              {verificationStatus === "notFound" && (
                <div className="gradient-card gradient-border rounded-xl p-8 text-center mb-6 animate-scale-in">
                  <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldX className="w-10 h-10 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-destructive mb-2">
                    Não Reconhecido
                  </h2>
                  <p className="text-muted-foreground">
                    Este rosto não foi encontrado no sistema
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4 animate-fade-in">
                {verificationStatus === "idle" || verificationStatus === "scanning" ? (
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying || !isModelLoaded || registeredCount === 0}
                    size="lg"
                    className="w-full gap-2"
                    variant="glow"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <ScanFace className="w-5 h-5" />
                        Verificar Identidade
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={resetVerification}
                    size="lg"
                    className="w-full gap-2"
                    variant="outline"
                  >
                    Verificar Novamente
                  </Button>
                )}

                {registeredCount === 0 && (
                  <Button
                    onClick={() => navigate("/cadastro")}
                    size="lg"
                    className="w-full"
                    variant="secondary"
                  >
                    Cadastrar um Rosto
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verificar;
