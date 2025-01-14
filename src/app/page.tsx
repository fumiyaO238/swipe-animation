import { Swiper } from "./components/Swiper";
import TinderSwipe from "./components/TinderSwipe";
import { cardData } from "./components/SwipeCards";

export default function Home() {
  return (
    <main>
      <Swiper />
      {/* <TinderSwipe db={[...cardData]} /> */}
    </main>
  );
}
