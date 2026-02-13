"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SetupGuide } from "@/components/SetupGuide";
import { onAuthChange } from "@/lib/firebase";
import { api } from "@/lib/api";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Check for existing projects
        const data = await api.get<{ projects: { id: string; apiKey: string | null }[] }>(
          "/projects/with-keys"
        );

        if (data.projects.length > 0 && data.projects[0].apiKey) {
          setProjectId(data.projects[0].id);
          setApiKey(data.projects[0].apiKey);
        } else {
          // Create a new project
          const result = await api.post<{ projectId: string; apiKey: string }>(
            "/projects/quick-create",
            { name: "My Project" }
          );
          setProjectId(result.projectId);
          setApiKey(result.apiKey);
        }
      } catch (err) {
        console.error("Setup error:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Setup PlanBrew</h1>
          <p className="text-muted-foreground">
            Follow these steps to start tracking your coding activity.
          </p>
        </div>
        {projectId && apiKey ? (
          <SetupGuide apiKey={apiKey} projectId={projectId} />
        ) : (
          <p className="text-muted-foreground">Failed to create project. Please try again.</p>
        )}
      </main>
    </div>
  );
}
