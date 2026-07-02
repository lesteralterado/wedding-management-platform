"use client";

import { CameraView } from "@/components/photobooth/camera-view";

export default function CameraTestPage() {
  return (
    <div className="min-h-screen bg-background p-4 pt-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold">QR Photo Booth Test</h1>
          <p className="text-muted-foreground">Test the camera component without database connection</p>
        </div>
        <CameraView />
      </div>
    </div>
  );
}