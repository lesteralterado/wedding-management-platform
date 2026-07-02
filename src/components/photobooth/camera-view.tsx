"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, RefreshCw, Upload, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CountdownOption = "off" | "3s" | "5s" | "10s";

export function CameraView() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = React.useState<"user" | "environment">("environment");
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = React.useState(false);
  const [countdown, setCountdown] = React.useState<CountdownOption>("off");
  const [countdownValue, setCountdownValue] = React.useState(0);
  const [isCapturing, setIsCapturing] = React.useState(false);

  React.useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing },
          audio: false,
        });
        setStream(mediaStream);
        setPermissionDenied(false);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setPermissionDenied(true);
      }
    }

    if (!capturedImage) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing, capturedImage]);
  

  const startCountdown = (seconds: number) => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setCountdownValue(seconds);
    
    const interval = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          setIsCapturing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageDataUrl);
    
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const switchCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCapture = () => {
    if (countdown === "off") {
      capturePhoto();
    } else if (countdown === "3s") {
      startCountdown(3);
    } else if (countdown === "5s") {
      startCountdown(5);
    } else if (countdown === "10s") {
      startCountdown(10);
    }
  };

  if (permissionDenied) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please allow camera access in your browser settings to use the photo booth.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-[3/4]">
        {capturedImage ? (
          <div className="relative h-full w-full">
            <Image src={capturedImage} alt="Captured" fill className="object-cover" />
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {countdownValue > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="font-display text-8xl font-black text-white animate-pulse">
                  {countdownValue}
                </div>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">Countdown:</span>
        {(["off", "3s", "5s", "10s"] as CountdownOption[]).map((opt) => (
          <Button
            key={opt}
            variant={countdown === opt ? "default" : "outline"}
            size="sm"
            onClick={() => setCountdown(opt)}
            disabled={!!capturedImage}
          >
            {opt === "off" ? <X className="h-4 w-4" /> : opt}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={retakePhoto} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" /> Retake
            </Button>
            <Button className="flex-1" onClick={() => alert("Upload would go here")}>
              <Upload className="h-4 w-4 mr-2" /> Upload Photo
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={switchCamera} className="flex-1">
              <Camera className="h-4 w-4 mr-2" /> Switch
            </Button>
            <Button
              className="flex-1"
              onClick={handleCapture}
              disabled={isCapturing}
              size="lg"
            >
              {isCapturing ? "Capturing..." : <><Timer className="h-4 w-4 mr-2" /> Capture</>}
            </Button>
          </>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {capturedImage ? "Preview mode - not connected to database" : "Live camera feed - point and capture"}
      </p>
    </div>
  );
}