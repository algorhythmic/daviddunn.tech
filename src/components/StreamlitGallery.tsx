'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { streamlitApps } from "@/data/streamlit-apps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function StreamlitGallery() {
    const [imageError, setImageError] = useState<Record<string, boolean>>({});

    const handleAppClick = (appUrl: string) => {
        window.open(appUrl, '_blank');
    };

    const handleImageError = (appId: string) => {
        setImageError(prev => ({ ...prev, [appId]: true }));
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streamlitApps.map((app) => (
                    <Card 
                        key={app.id}
                        className="hover:shadow-lg transition-shadow duration-200"
                    >
                        <CardHeader className="space-y-2">
                            <div className="relative w-full h-48 mb-2 overflow-hidden rounded-t-lg bg-muted">
                                {!imageError[app.id] ? (
                                    <Image
                                        src={app.imageUrl}
                                        alt={app.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                        onError={() => handleImageError(app.id)}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <span className="text-muted-foreground">Preview not available</span>
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-xl">{app.title}</CardTitle>
                            <CardDescription>{app.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{app.category}</Badge>
                                {app.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleAppClick(app.appUrl)}
                            >
                                Launch App <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
