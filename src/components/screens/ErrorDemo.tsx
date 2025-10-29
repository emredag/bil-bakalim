/**
 * Error Demo Screen - Task 39 Testing
 *
 * Demonstrates error handling system:
 * - Error types (Database, Validation, NotFound, etc.)
 * - ErrorBoundary component
 * - Error handler service
 * - User-friendly error messages
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Bug, Database, FileX, Copy } from 'lucide-react';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import {
  DatabaseError,
  ValidationError,
  NotFoundError,
  DuplicateError,
  FileSystemError,
} from '../../types/errors';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const ErrorDemo: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [shouldCrash, setShouldCrash] = useState(false);

  // Trigger component crash (ErrorBoundary will catch)
  if (shouldCrash) {
    throw new Error('Intentional component crash for testing ErrorBoundary');
  }

  // Error test scenarios
  const errorTests = [
    {
      type: 'database',
      label: 'Database Error',
      emoji: '🗄️',
      icon: Database,
      description: 'Simulates a database connection or query error',
      trigger: () => {
        const error = new DatabaseError(
          'Failed to connect to database',
          'Veritabanına bağlanırken hata oluştu'
        );
        handleError(error, {
          location: 'ErrorDemo.testDatabaseError',
        });
      },
    },
    {
      type: 'validation',
      label: 'Validation Error',
      emoji: '⚠️',
      icon: AlertTriangle,
      description: 'Simulates invalid user input or data validation error',
      trigger: () => {
        const error = new ValidationError('Invalid email format', 'Geçersiz e-posta formatı');
        handleError(error, {
          location: 'ErrorDemo.testValidationError',
        });
      },
    },
    {
      type: 'notfound',
      label: 'Not Found Error',
      emoji: '🔍',
      icon: FileX,
      description: 'Simulates a resource not found error (404)',
      trigger: () => {
        const error = new NotFoundError('Category not found', 'Kategori bulunamadı');
        handleError(error, {
          location: 'ErrorDemo.testNotFoundError',
        });
      },
    },
    {
      type: 'duplicate',
      label: 'Duplicate Error',
      emoji: '📋',
      icon: Copy,
      description: 'Simulates a duplicate entry error',
      trigger: () => {
        const error = new DuplicateError('Category already exists', 'Bu kategori zaten mevcut');
        handleError(error, {
          location: 'ErrorDemo.testDuplicateError',
        });
      },
    },
    {
      type: 'filesystem',
      label: 'File System Error',
      emoji: '📁',
      icon: FileX,
      description: 'Simulates a file operation error',
      trigger: () => {
        const error = new FileSystemError('Failed to read file', 'Dosya okunurken hata oluştu');
        handleError(error, {
          location: 'ErrorDemo.testFileSystemError',
        });
      },
    },
    {
      type: 'generic',
      label: 'Generic JavaScript Error',
      emoji: '🐛',
      icon: Bug,
      description: 'Simulates a standard JavaScript error',
      trigger: () => {
        try {
          // @ts-ignore - Intentional error for testing
          const test = undefined.someProperty;
        } catch (error) {
          handleError(error, {
            location: 'ErrorDemo.testGenericError',
            userMessage: 'Beklenmeyen bir hata oluştu',
          });
        }
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-container max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
              🚨 Error Handling Demo
            </h1>
            <p className="text-sm md:text-base text-text-secondary">
              Task 39 - Test error types and ErrorBoundary
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>

        {/* Error Boundary Test */}
        <Card className="mb-8 border-2 border-red-500/30">
          <CardHeader>
            <CardTitle>💥 Error Boundary Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-text-secondary">
                This will throw an error in the component, triggering the ErrorBoundary. The entire
                app will show a fallback UI instead of crashing.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShouldCrash(true)}
                className="w-full sm:w-auto"
              >
                💣 Trigger Component Crash
              </Button>
              <p className="text-xs text-text-tertiary">
                Note: You'll need to refresh the page or click "Tekrar Dene" to recover
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error Type Tests */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Error Type Tests</h2>
          <p className="text-text-secondary mb-6">
            Click each button to test different error types. Errors will be logged to console (check
            DevTools).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {errorTests.map((test) => (
              <Card key={test.type} className="hover:scale-105 transition-transform">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Icon & Label */}
                    <div className="text-center">
                      <div className="text-5xl mb-3">{test.emoji}</div>
                      <h3 className="text-lg font-semibold text-text-primary">{test.label}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary text-center">{test.description}</p>

                    {/* Trigger Button */}
                    <Button
                      variant="secondary"
                      onClick={test.trigger}
                      className="w-full"
                      icon={<test.icon className="w-4 h-4" />}
                    >
                      Test Error
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <Card className="mt-8 bg-slate-800/50 border-2 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text-primary mb-2">Testing Instructions</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>
                    • <strong>Error Types:</strong> Click each "Test Error" button to trigger
                    different error types
                  </li>
                  <li>
                    • <strong>Console Logging:</strong> Open DevTools (F12) → Console to see error
                    logs
                  </li>
                  <li>
                    • <strong>User Messages:</strong> Each error type has a user-friendly Turkish
                    message
                  </li>
                  <li>
                    • <strong>Error Boundary:</strong> Click "Trigger Component Crash" to test the
                    ErrorBoundary
                  </li>
                  <li>
                    • <strong>Fallback UI:</strong> You'll see a full-page error screen with retry
                    options
                  </li>
                </ul>

                <div className="pt-3 border-t border-slate-700">
                  <h4 className="font-medium text-text-primary mb-2">Error Types (PRD 14.2):</h4>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>
                      • <strong>DatabaseError:</strong> Veritabanı hataları
                    </li>
                    <li>
                      • <strong>ValidationError:</strong> Validasyon hataları
                    </li>
                    <li>
                      • <strong>NotFoundError:</strong> Kayıt bulunamadı (404)
                    </li>
                    <li>
                      • <strong>DuplicateError:</strong> Tekrar kayıt
                    </li>
                    <li>
                      • <strong>FileSystemError:</strong> Dosya işlem hataları
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

ErrorDemo.displayName = 'ErrorDemo';
