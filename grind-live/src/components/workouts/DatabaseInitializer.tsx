'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

export function DatabaseInitializer() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setStatus('idle');

      console.log('🚀 Initialisation de la base de données...');
      const startTime = Date.now();

      const response = await fetch('/api/seed-exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok) {
        setStatus('success');
        setMessage(`${data.message} (${duration}ms)`);
        console.log(`✅ Base de données initialisée en ${duration}ms`);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de l\'initialisation');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Initialisation de la base de données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Cette action va ajouter une base de données d'exercices à votre projet Supabase.
          Cela ne doit être fait qu'une seule fois.
        </p>

        <Button
          onClick={initializeDatabase}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Initialisation...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Initialiser la base de données
            </>
          )}
        </Button>

        {status !== 'idle' && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 