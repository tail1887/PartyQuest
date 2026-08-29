"use client";

import React, { useState } from "react";
import { QrCode, Ticket, CheckCircle2, X, Sparkles, Clock, ChevronRight } from "lucide-react";
import { RedeemedCoupon } from "@/types/party";

interface MyCouponWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: RedeemedCoupon[];
  onToggleUseCoupon?: (couponId: string) => void;
}

export default function MyCouponWalletModal({
  isOpen,
  onClose,
  coupons,
  onToggleUseCoupon,
}: MyCouponWalletModalProps) {
  const [activeBarcode, setActiveBarcode] = useState<RedeemedCoupon | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-party-card border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col justify-between overflow-hidden">
        <div>
          {/* 상단 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl text-slate-950 shadow-lg shadow-cyan-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">내 파티 쿠폰 & QR 보관함</h3>
              <span className="text-[10px] text-cyan-300 font-semibold">
                교환한 바코드/QR코드를 현장에서 스태프에게 제시하세요! ({coupons.length}개 보유)
              </span>
            </div>
          </div>

          {/* 쿠폰 리스트 영역 */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            {coupons.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
                <Ticket className="w-8 h-8 mx-auto mb-2 opacity-50 text-cyan-400" />
                <p className="text-xs font-bold text-slate-300">보관된 쿠폰이 없습니다.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  퀘스트 포인트로 리워드 교환소에서 쿠폰을 교환해 보세요!
                </p>
              </div>
            ) : (
              coupons.map((cp) => (
                <div
                  key={cp.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    cp.isUsed
                      ? "bg-slate-900/40 border-slate-800 opacity-60"
                      : "bg-slate-900 border-cyan-500/30 hover:border-cyan-400 shadow-md shadow-cyan-950/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0">
                      {cp.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <strong className="text-xs text-white font-bold truncate">
                          {cp.rewardTitle}
                        </strong>
                        {cp.isUsed && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                            사용 완료
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        코드: {cp.couponCode} • {cp.redeemedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!cp.isUsed && (
                      <button
                        onClick={() => setActiveBarcode(cp)}
                        className="py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 active:scale-95 text-slate-950 font-black rounded-xl text-[11px] flex items-center gap-1 shadow-md shadow-cyan-500/20 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR 보기</span>
                      </button>
                    )}

                    {onToggleUseCoupon && (
                      <button
                        onClick={() => onToggleUseCoupon(cp.id)}
                        className={`p-1.5 rounded-xl border text-[10px] font-bold cursor-pointer ${
                          cp.isUsed
                            ? "bg-slate-800 text-slate-400 border-slate-700"
                            : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900"
                        }`}
                        title={cp.isUsed ? "미사용으로 변경" : "사용 완료로 변경"}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 바코드/QR코드 선택 팝업 모달 */}
        {activeBarcode && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-150">
            <div className="relative w-full max-w-sm bg-party-card border border-cyan-500/50 rounded-3xl p-6 shadow-2xl text-center text-slate-100">
              <button
                onClick={() => setActiveBarcode(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-4xl mb-2">{activeBarcode.icon}</div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-2">
                보관함 QR/바코드 열람
              </span>

              <h4 className="text-base font-bold text-white mb-1">
                {activeBarcode.rewardTitle}
              </h4>
              <p className="text-xs text-slate-300 mb-5">
                현장 스태프/바텐더에게 제시하고 혜택을 받으세요!
              </p>

              {/* 바코드 카드 */}
              <div className="bg-white text-slate-950 rounded-2xl p-5 mb-4 shadow-xl">
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <QrCode className="w-5 h-5 text-slate-800" />
                  <span className="text-xs font-black tracking-widest uppercase">
                    {activeBarcode.couponCode}
                  </span>
                </div>

                {/* 바코드 선 그래픽 */}
                <div className="h-14 flex items-center justify-center gap-1 overflow-hidden">
                  {[4, 2, 6, 2, 4, 8, 2, 6, 3, 5, 2, 7, 3, 6, 2, 4, 8, 3, 5, 2, 4, 6, 2].map((w, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  교환 시각: {activeBarcode.redeemedAt}
                </p>
              </div>

              <div className="flex gap-2">
                {onToggleUseCoupon && (
                  <button
                    onClick={() => {
                      onToggleUseCoupon(activeBarcode.id);
                      setActiveBarcode(null);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    현장 사용 완료 처리
                  </button>
                )}
                <button
                  onClick={() => setActiveBarcode(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
