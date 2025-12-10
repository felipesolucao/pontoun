import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import WebcamCapture from "@/components/WebcamCapture";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isModelLoaded, isLoading, error, detectFace, saveFace } = useFaceDetection();
  
  const [name, setName] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const handleCapture = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome antes de capturar.",
        variant: "destructive",
      });
      return;
    }

    if (!videoRef.current || !isModelLoaded) {
      toast({
        title: "Câmera não disponível",
        description: "Aguarde a câmera e os modelos carregarem.",
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(true);
    setCaptureStatus("detecting");
    setStatusMessage("Detectando rosto...");

    try {
      const detection = await detectFace(videoRef.current);

      if (!detection) {
        setCaptureStatus("error");
        setStatusMessage("Nenhum rosto detectado. Posicione seu rosto no centro.");
        setIsCapturing(false);
        return;
      }

      saveFace(name.trim(), detection.descriptor);
      setCaptureStatus("success");
      setStatusMessage(`Rosto de ${name} cadastrado com sucesso!`);
      
      toast({
        title: "Cadastro realizado!",
        description: `${name} foi cadastrado no sistema.`,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error capturing face:", err);
      setCaptureStatus("error");
      setStatusMessage("Erro ao capturar rosto. Tente novamente.");
    } finally {
      setIsCapturing(false);
    }
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
              Cadastrar Rosto
            </h1>
            <p className="text-muted-foreground">
              Posicione seu rosto no centro da câmera e clique em capturar
            </p>
          </div>

          {/* Loading Models */}
          {isLoading && (
            <div className="gradient-card gradient-border rounded-xl p-8 text-center mb-6">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Carregando modelos de IA...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="gradient-card gradient-border rounded-xl p-8 text-center mb-6 border-destructive">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Camera */}
          {!isLoading && !error && (
            <>
              <div className="gradient-card gradient-border rounded-xl p-4 mb-6 animate-fade-in">
                <WebcamCapture 
                  onStream={handleVideoReady}
                  isScanning={isCapturing}
                />
              </div>

              {/* Status Message */}
              {captureStatus !== "idle" && (
                <div className={`flex items-center justify-center gap-2 mb-6 p-4 rounded-lg ${
                  captureStatus === "success" 
                    ? "bg-green-500/10 text-green-500" 
                    : captureStatus === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}>
                  {captureStatus === "detecting" && <Loader2 className="w-5 h-5 animate-spin" />}
                  {captureStatus === "success" && <CheckCircle className="w-5 h-5" />}
                  {captureStatus === "error" && <AlertCircle className="w-5 h-5" />}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Seu nome
                  </label>
                  <Input
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                <Button
                  onClick={handleCapture}
                  disabled={isCapturing || !isModelLoaded || captureStatus === "success"}
                  size="lg"
                  className="w-full gap-2"
                  variant="glow"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Capturando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Capturar Rosto
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
