import { ScanFace } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-primary">
        <span className="text-2xl font-light">[</span>
        <span className="text-xl">:</span>
      </div>
      <ScanFace className="w-8 h-8 text-primary" />
      <span className="text-2xl font-bold text-primary">FaceID</span>
      <div className="flex items-center text-primary">
        <span className="text-xl">:</span>
        <span className="text-2xl font-light">]</span>
      </div>
    </div>
  );
};

export default Logo;
