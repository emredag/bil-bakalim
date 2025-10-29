/**
 * First Launch Experience Test Page
 * Task 38 - Testing first launch detection and welcome screen
 *
 * This page helps test the first launch experience by providing
 * controls to reset the first launch state
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Home } from 'lucide-react';
import {
  isFirstLaunch,
  resetFirstLaunch,
  markFirstLaunchCompleted,
} from '../../services/firstLaunch';
import { ROUTES } from '../../routes/constants';

export function FirstLaunchTest() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentState, setCurrentState] = useState<boolean>(false);

  useEffect(() => {
    checkCurrentState();
  }, []);

  const checkCurrentState = useCallback(() => {
    const isFirst = isFirstLaunch();
    setCurrentState(isFirst);
  }, []);

  const handleResetFirstLaunch = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      try {
        resetFirstLaunch();
        setStatus('success');
        setMessage('First launch state reset! Navigate to home to see welcome screen.');
        checkCurrentState();
      } catch (error) {
        setStatus('error');
        setMessage('Failed to reset first launch state');
      }

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    },
    [checkCurrentState]
  );

  const handleMarkCompleted = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      try {
        markFirstLaunchCompleted();
        setStatus('success');
        setMessage('First launch marked as completed!');
        checkCurrentState();
      } catch (error) {
        setStatus('error');
        setMessage('Failed to mark first launch as completed');
      }

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    },
    [checkCurrentState]
  );

  const handleNavigateHome = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      navigate(ROUTES.HOME);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Task 38: First Launch Experience Test
          </h1>
          <p className="text-slate-400 mb-8">
            Test the first launch detection and welcome screen functionality
          </p>

          {/* Current State */}
          <div className="bg-slate-900 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Current State</h2>
            <div className="flex items-center gap-3">
              {currentState ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">First Launch State Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-slate-400" />
                  <span className="text-slate-400">First Launch Already Completed</span>
                </>
              )}
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg mb-6 ${
                status === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Test Actions */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleResetFirstLaunch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset First Launch State
            </button>

            <button
              type="button"
              onClick={handleMarkCompleted}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Completed
            </button>

            <button
              type="button"
              onClick={handleNavigateHome}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Navigate to Home
            </button>
          </div>

          {/* Test Scenarios */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Test Scenarios</h2>
            <div className="space-y-3 text-sm">
              <TestScenario
                number="T-001"
                title="First Launch Detection"
                steps={[
                  'Click "Reset First Launch State"',
                  'Click "Navigate to Home"',
                  'Should automatically redirect to /welcome',
                ]}
              />
              <TestScenario
                number="T-002"
                title="Welcome Screen Display"
                steps={[
                  'Verify welcome message is displayed',
                  'Verify database initialization status shows',
                  'Verify "Hemen Başla" button becomes active',
                ]}
              />
              <TestScenario
                number="T-003"
                title="Complete First Launch"
                steps={[
                  'Click "Hemen Başla" on welcome screen',
                  'Should navigate to main menu',
                  'First launch flag should be set to completed',
                ]}
              />
              <TestScenario
                number="T-004"
                title="Subsequent Launches"
                steps={[
                  'After completing first launch, navigate to home',
                  'Should go directly to main menu',
                  'Should NOT show welcome screen again',
                ]}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface TestScenarioProps {
  number: string;
  title: string;
  steps: string[];
}

function TestScenario({ number, title, steps }: TestScenarioProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-blue-400 font-mono font-semibold">{number}</span>
        <span className="text-white font-semibold">{title}</span>
      </div>
      <ol className="list-decimal list-inside text-slate-400 space-y-1 ml-12">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
