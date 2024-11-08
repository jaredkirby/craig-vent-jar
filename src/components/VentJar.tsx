import React, { useState } from "react";
import { Coins, RotateCcw, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const VentJar: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [recentVents, setRecentVents] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const handleVent = () => {
    setAmount((prev) => prev + 1);
    setIsShaking(true);
    const now = new Date().toLocaleTimeString();
    setRecentVents((prev) =>
      [`${now}: Added $1 to the jar`, ...prev].slice(0, 5)
    );
    setTimeout(() => setIsShaking(false), 500);
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
      <Card className="bg-white shadow-lg relative">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Craig's Venting Jar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className={`relative mx-auto w-40 h-40 ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-full border-8 border-gray-100 overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-300"
                style={{ height: `${Math.min((amount / 50) * 100, 100)}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-50"></div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-800">${amount}</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleVent}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Coins className="w-5 h-5" />
              Add $1
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={handleResetClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {showHistory && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-3">Recent History</h3>
              {recentVents.length > 0 ? (
                <ul className="space-y-2">
                  {recentVents.map((vent, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {vent}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
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
                  This will permanently delete all vent history and reset the jar to $0.
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
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
