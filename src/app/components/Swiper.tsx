"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { cardData, CardType } from "./SwipeCards";

export const Swiper = () => {
  const [cards, setCards] = useState<Array<CardType>>(cardData);

  const handleNOPE = (id: number) => {
    setCards((prev) => prev.filter((v) => v.id !== id));
  };

  const handleLIKE = (id: number) => {
    setCards((prev) => prev.filter((v) => v.id !== id));
  };

  useEffect(() => {
    // キーボードイベントをリッスン
    const handleKeyDown = (event: KeyboardEvent) => {
      // Print Screen キーが押された場合
      if (event.key === "PrintScreen") {
        event.preventDefault(); // PrintScreenのデフォルトの動作を無効化
        alert("Print Screen (スクリーンショット)は無効です");
      }
    };

    // イベントリスナーを追加
    document.addEventListener("keydown", handleKeyDown);

    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[salmon] grid place-items-center gap-10">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          url={card.url}
          cards={cards}
          setCards={setCards}
        />
      ))}
      {cards.length > 0 && (
        <div className="flex gap-10 -mt-60">
          <button
            className="w-24 p-2 bg-slate-700 text-white"
            onClick={() => handleNOPE(cards.length)}
          >
            NOPE
          </button>
          <button
            className="w-24 p-2 bg-green-400"
            onClick={() => handleLIKE(cards.length)}
          >
            LIKE
          </button>
        </div>
      )}
    </div>
  );
};
