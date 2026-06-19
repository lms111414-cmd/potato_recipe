'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface DiaryEntryFormProps {
  initialImage?: string | null;
  initialMemo?: string;
  submitLabel: string;
  onSubmit: (image: string | null, memo: string) => void;
  cancelLabel?: string;
  onCancel?: () => void;
}

/**
 * 사진 업로드 + 한 줄 메모 입력 공용 폼.
 * 게임 성공 화면과 일기 수정 모달에서 함께 재사용한다.
 */
export function DiaryEntryForm({
  initialImage = null,
  initialMemo = '',
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
}: DiaryEntryFormProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [memo, setMemo] = useState(initialMemo);
  const fileRef = useRef<HTMLInputElement>(null);

  // 로컬 이미지 업로드 → DataURL로 저장(새로고침 후에도 유지)
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setImage(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 스크롤 본문: 이미지 + 입력 폼 */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-0.5">
        <h3 className="text-[16px] font-semibold text-stone-800 mb-1 tracking-wide">
          📔 나만의 감자 일기 남기기
        </h3>
        <p className="text-[12px] text-stone-400 mb-4">
          오늘 만든 감자 요리를 사진과 한 줄로 기록해보세요.
        </p>

        {/* 사진 업로드 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 flex flex-col items-center justify-center overflow-hidden hover:bg-amber-50 transition-colors"
        >
          {image ? (
            <img
              src={image}
              alt="업로드한 사진 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <span className="text-3xl mb-1">📷</span>
              <span className="text-[13px] text-amber-700 font-medium">
                사진 올리기
              </span>
            </>
          )}
        </button>

        {image && (
          <button
            type="button"
            onClick={() => {
              setImage(null);
              if (fileRef.current) fileRef.current.value = '';
            }}
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-stone-900/55 backdrop-blur-sm px-3 py-1.5 text-[12px] font-medium text-white hover:bg-stone-900/75 transition-colors shadow-sm"
          >
            🗑️ 사진 삭제
          </button>
        )}
      </div>

      {image && (
        <p className="text-[12px] text-stone-400 mb-4 -mt-1 text-center">
          사진을 다시 누르면 다른 사진으로 바꿀 수 있어요.
        </p>
      )}

        {/* 한 줄 메모 */}
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="오늘의 한 줄 메모를 남겨보세요"
          maxLength={50}
          className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
        />
      </div>

      {/* 고정 푸터: 저장 / 취소 (스크롤과 무관하게 항상 노출) */}
      <div className="shrink-0 pt-4 mt-2 border-t border-amber-100/80 bg-[#FDFBF7]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onSubmit(image, memo.trim())}
          className="w-full rounded-2xl py-4 text-[15px] font-semibold text-white bg-amber-800 hover:bg-amber-900 shadow-md shadow-amber-900/15 transition-colors"
        >
          {submitLabel}
        </motion.button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 w-full text-center text-[13px] text-stone-400 hover:text-stone-600 transition-colors"
          >
            {cancelLabel ?? '닫기'}
          </button>
        )}
      </div>
    </div>
  );
}
