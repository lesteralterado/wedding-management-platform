"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PhotographerDashboard() {
  const stats = [
    { label: "Total Photos", value: "342", hint: "Uploaded" },
    { label: "Total Videos", value: "28", hint: "Reels & clips" },
    { label: "Storage Used", value: "4.2 GB", hint: "Of 10 GB" },
    { label: "Albums", value: "4", hint: "Active" },
  ];

  const recentUploads = [
    { name: "IMG_8921.jpg", size: "4.2 MB", time: "10 min ago" },
    { name: "IMG_8922.jpg", size: "3.8 MB", time: "12 min ago" },
    { name: "VID_015.mov", size: "128 MB", time: "25 min ago" },
    { name: "IMG_8923.jpg", size: "5.1 MB", time: "32 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl font-black">{s.value}</CardTitle>
            </CardHeader>
            <CardContent><span className="text-xs text-muted-foreground">{s.hint}</span></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Latest media uploaded to gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentUploads.map((file) => (
              <div key={file.name} className="flex items-center justify-between rounded-2xl border border-border p-3">
                <span className="font-semibold text-sm">{file.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                  <Badge variant="outline">{file.time}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
