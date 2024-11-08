import React, { useState, useMemo } from 'react';
import { Coins, RotateCcw, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const VentJar: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [recentVents, setRecentVents] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const MAX_AMOUNT = 50;

  // Generate overlapping coin positions from top to bottom
  const coinGrid = useMemo(() => {
    const positions = [];
    const columns = 5;  // More columns for density
    const rows = 10;    // More rows to ensure coverage
    const offsetX = 88; // Percentage for overlap (less than 100)
    const offsetY = 92; // Percentage for vertical overlap
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        positions.push({
          left: `${(col * offsetX/columns) + (row % 2 ? 8 : 0)}%`,
          // Position from top instead of bottom
          top: `${(row * offsetY/rows)}%`,
          delay: (row * columns + col) * 30,
          zIndex: rows - row // Reverse z-index so top coins appear above
        });
      }
    }
    // Reverse the array so coins fill from top to bottom
    return positions.reverse();
  }, []);

  const visibleCoins = Math.floor(amount);
  const percentFull = (amount / MAX_AMOUNT) * 100;

  const handleVent = () => {
    if (amount < MAX_AMOUNT) {
      setAmount(prev => Math.min(prev + 1, MAX_AMOUNT));
      setIsShaking(true);
      const now = new Date().toLocaleTimeString();
      setRecentVents(prev => [`${now}: Added $1 to the jar`, ...prev].slice(0, 5));
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleFirstConfirm = () => {
    setShowFinalConfirm(true);
  };

  const handleFinalConfirm = () => {
    setAmount(0);
    setRecentVents([]);
    setShowResetConfirm(false);
    setShowFinalConfirm(false);
    const now = new Date().toLocaleTimeString();
    setRecentVents([`${now}: Jar was reset to $0`]);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
    setShowFinalConfirm(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8">
      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Craig's Venting Jar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Jar Container */}
          <div className={`relative mx-auto ${isShaking ? 'animate-shake' : ''}`}>
            {/* Lid */}
            <div className="relative z-20 mx-auto w-48 h-12 bg-gray-200 rounded-t-full shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-300 rounded-t-full"></div>
            </div>
            
            {/* Jar Body */}
            <div className="relative w-64 h-80 mx-auto">
              {/* Glass Effect Container */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-gray-100 overflow-hidden">
                {/* Left Glass Highlight */}
                <div className="absolute left-4 top-0 bottom-0 w-12 bg-white/20 blur-sm transform -skew-x-12"></div>
                
                {/* Coins Container */}
                <div className="absolute inset-0">
                  {coinGrid.slice(0, visibleCoins).map((position, index) => (
                    <div
                      key={index}
                      className="absolute w-12 h-12 transition-all duration-500"
                      style={{
                        left: position.left,
                        top: position.top,
                        transitionDelay: `${position.delay}ms`,
                        opacity: index < visibleCoins ? 1 : 0,
                        transform: `translateY(${index < visibleCoins ? '0' : '-100%'})`,
                        zIndex: position.zIndex,
                      }}
                    >
                      <div className="w-full h-full bg-yellow-400 rounded-full shadow-lg flex items-center justify-center rotate-12">
                        <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600 text-xs font-bold">$1</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fill Level Indicator */}
                {percentFull >= 100 && (
                  <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
                )}
              </div>

              {/* Amount Display */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-5xl font-bold text-gray-800 bg-white/80 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  ${amount}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons Container */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={handleVent}
              disabled={amount >= MAX_AMOUNT}
              className={`bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                ${amount >= MAX_AMOUNT 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-600 hover:shadow-lg'}`}
            >
              <Coins className="w-5 h-5" />
              {amount >= MAX_AMOUNT ? 'Jar Full!' : 'Add $1'}
            </button>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-colors"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={handleResetClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Recent History</h3>
              {recentVents.length > 0 ? (
                <ul className="space-y-2">
                  {recentVents.map((vent, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {vent}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No recent activity</p>
              )}
            </div>
          )}

          {/* Reset Confirmation Modals */}
          {showResetConfirm && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-4 border-2 border-red-100">
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Reset Venting Jar?
                </h3>
                <p className="text-gray-800 mb-6 text-base">
                  Are you sure you want to reset the jar to $0?
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelReset}
                    className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFirstConfirm}
                    className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Yes, Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {showFinalConfirm && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-4 border-2 border-red-200">
                <h3 className="text-xl font-bold mb-2 text-red-600">
                  ⚠️ Final Warning!
                </h3>
                <p className="text-gray-900 mb-2 text-base font-medium">
                  Are you REALLY, REALLY sure??
                </p>
                <p className="text-gray-800 mb-6 text-base">
                  This will permanently delete all vent history and reset the
                  jar to $0.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelReset}
                    className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    No, Keep Records
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Yes, Reset Everything!
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(-5px) rotate(-1deg);
          }
          75% {
            transform: translateX(5px) rotate(1deg);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};