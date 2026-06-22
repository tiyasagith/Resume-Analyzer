"use client";

import { useResume } from '@/hooks/useResume';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Eye } from 'lucide-react';

export function ReduxExample() {
  const { 
    analyses, 
    loading, 
    error, 
    getUserAnalyses, 
    removeAnalysis 
  } = useResume();
  
  const { user, isAuthenticated } = useAuth();
  const { notify } = useUI();

  const handleLoadAnalyses = () => {
    if (user?.id) {
      getUserAnalyses(user.id)
        .unwrap()
        .catch((err) => {
          notify({
            type: 'error',
            title: 'Failed to load analyses',
            message: err,
          });
        });
    }
  };

  const handleDeleteAnalysis = (id: string, userId: string) => {
    removeAnalysis(id, userId)
      .unwrap()
      .then(() => {
        notify({
          type: 'success',
          title: 'Analysis deleted',
          message: 'The analysis has been deleted successfully.',
        });
      })
      .catch((err) => {
        notify({
          type: 'error',
          title: 'Failed to delete',
          message: err,
        });
      });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please log in to view your analyses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Redux State Management Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleLoadAnalyses} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load My Analyses'
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                User: {user?.email}
              </Badge>
              <Badge variant="outline">
                Analyses: {analyses.length}
              </Badge>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">Error: {error}</p>
            </div>
          )}

          {analyses.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Your Resume Analyses:</h4>
              {analyses.map((analysis) => (
                <div 
                  key={analysis.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex-1">
                    <h5 className="font-medium">{analysis.jobTitle}</h5>
                    <p className="text-sm text-muted-foreground">
                      {analysis.companyName} • Score: {analysis.overallScore}/100
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteAnalysis(analysis.id, analysis.userId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
