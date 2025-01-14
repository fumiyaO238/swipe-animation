"use client";

import React, { FC, useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
// import { useHistory } from "react-router-dom";
import { CardType } from "./SwipeCards";
// import Loading from "../components/Loading";

type Props = {
  db: Array<CardType>;
};

const TinderSwipe: FC<Props> = ({ db }) => {
  // const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDirection, setLastDirection] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);
  /**
   * レンダリングされても状態を保つ（記録する）
   */
  const currentIndexRef = useRef(currentIndex);
  /**
   * dbのlengthだけuseRefを生成する
   * TinderSwipeを通すことでswipeメソッドとrestoreCardメソッドを付与する(useImperativeHandle)
   */
  const childRefs = useMemo<any>(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    [db.length]
  );
  /**
   *　useRefを更新する（valは基本 1 or -1 になる）
   */
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
    if (currentIndexRef.current === -1) {
      setIsLoading(true);
      setIsLoading(false);
      // history.push("/diagnose/result");
    }
  };
  /**
   * goback可能かを監視する
   * DBが5の場合4の時はgobackできない（初期gobackを不可にする）
   */
  const canGoBack = currentIndex < db.length - 1;
  /**
   * スワイプ可能かを監視する
   * DBが5の場合4,3,2,1,0と減っていく
   */
  const canSwipe = currentIndex >= 0;

  const outOfFrame = (idx: number) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };
  /**
   * 手動でのスワイプの処理（押下式のスワイプも最終的にはこの関数を叩いている）
   * currentIndexを-1する
   */
  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };
  /**
   *　ライブラリのonSwipeを叩く　>　ローカルで用意しているswipeを叩く
   */
  const swipe = async (direction: string) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(direction);
    }
  };
  /**
   * gobackする
   * currentIndexを+1する
   */
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <>
      {/* {isLoading && <Loading />} */}
      <div className="min-h-screen bg-[salmon] grid place-items-center gap-10 overflow-hidden">
        <div className="tinder-swipe">
          <div className="cardContainer">
            {db.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.name}
                onSwipe={(dir) => swiped(dir, index)}
                onCardLeftScreen={() => outOfFrame(index)}
              >
                <div
                  style={{ backgroundImage: "url(" + character.url + ")" }}
                  className="card"
                >
                  <h3>{character.name}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
          <div className="buttons">
            <button onClick={() => swipe("left")}>
              <img src="/svg/icon_bad.svg" alt="" />
            </button>
            <button onClick={() => goBack()}>
              <img src="/svg/icon_undo.svg" alt="" />
            </button>
            <button onClick={() => swipe("right")}>
              <img src="/svg/icon_good.svg" alt="" />
            </button>
          </div>
          {lastDirection && (
            <h3 key={lastDirection} className="infoText">
              You swiped {lastDirection}
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default TinderSwipe;
