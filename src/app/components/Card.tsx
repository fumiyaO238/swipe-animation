"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { CardType } from "./SwipeCards";
import { Dispatch, SetStateAction, useState } from "react";

type CardProps = {
  id: number;
  url: string;
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
};
export const Card = ({ id, url, cards, setCards }: CardProps) => {
  const x = useMotionValue(0);

  const [cardCenter, setCardCenter] = useState<number>(0);
  const [isLike, setIsLike] = useState<"nope" | "like" | "">("");

  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    // const offset = isFront ? 0 : id % 2 === 0 ? 5 : -5;
    // return `${rotateRaw.get() + offset}deg`;
    return `${rotateRaw.get()}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((v) => v.id !== id));
    }
    setCardCenter(0);
    setIsLike("");
  };

  const handleDragStart = () => {
    const element = document.getElementById(`img_${id}`);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const center = rect.right - rect.width / 2;

    setCardCenter(center);
  };

  const handleDragging = () => {
    const element = document.getElementById(`img_${id}`);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const center = rect.right - rect.width / 2;

    if (cardCenter < center) {
      setIsLike("like");
    } else {
      setIsLike("nope");
    }
  };

  return (
    <>
      <motion.img
        src={url}
        id={`img_${id}`}
        className="h-96 w-72 origin-bottom object-cover hover:cursor-grab active:cursor-grabbing rounded-xl mt-20"
        style={{
          gridRow: 1,
          gridColumn: 1,
          x,
          opacity,
          rotate,
          transition: "0.125s transform",
          boxShadow: isFront
            ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
            : undefined,
          zIndex: isFront ? 1 : 0,
          position: "relative",
        }}
        animate={{
          scale: isFront ? 1.15 : 1.1,
        }}
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDrag={handleDragging}
      />
      <div className="absolute z-10 top-10 font-extrabold text-4xl">
        {isFront && isLike === "like" ? (
          <span className="text-pink-200">LIKE</span>
        ) : (
          isLike === "nope" && <span className="text-gray-600">NOPE</span>
        )}
      </div>
    </>
  );
};
