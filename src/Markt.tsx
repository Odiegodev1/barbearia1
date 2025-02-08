import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "./components/ui/button";
import Video1 from "./assets/v1.mp4";
import Video2 from "./assets/v2.mp4";
import Image1 from "./assets/42338cfdcba96da007e0d93733676464.jpg";
import Image2 from "./assets/6ef43ca29561c0270a79e1b313a67bde.jpg";

function Markt() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/MarktP");
  }
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-zinc-800 p-4">
      <div className="flex flex-wrap items-center justify-center space-x-8 lg:space-x-32">
        
        {/* Texto e Botões */}
        <div className="border-r border-zinc-600 pr-10 lg:pr-20 text-center lg:text-left">
          <h1 className="text-2xl text-zinc-300 font-bold">
            💈 Cabelo na régua, confiança no alto!
          </h1>
          <p className="text-zinc-400 text-xl font-semibold">
            💎 Seja o destaque, comece pelo corte!
          </p>
          <div className="mt-4 flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
            <Button onClick={handleNavigate} className="bg-slate-200 text-zinc-900 hover:text-zinc-300">
              Agendar Horário
            </Button>
            <Button className="bg-emerald-700">
            <a href="https://wa.me/5599999999999" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            </Button>
          </div>
        </div>

        {/* Carrossel de Vídeo e Imagem */}
        <main className="mt-6 bg-emerald-700 p-2 rounded-2xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="w-full max-w-xs md:max-w-md rounded-lg shadow-lg"
          >
            {/* Vídeo 1 */}
            <SwiperSlide>
              <video className="w-full rounded-lg" autoPlay loop muted>
                <source src={Video1} type="video/mp4" />
              </video>
            </SwiperSlide>

            {/* Vídeo 2 */}
            <SwiperSlide>
              <video className="w-full rounded-lg" autoPlay loop muted>
                <source src={Video2} type="video/mp4" />
              </video>
            </SwiperSlide>

            {/* Imagem 1 */}
            <SwiperSlide>
              <img src={Image1} alt="Imagem 1" className="w-full rounded-lg" />
            </SwiperSlide>

            {/* Imagem 2 */}
            <SwiperSlide>
              <img src={Image2} alt="Imagem 2" className="w-full rounded-lg" />
            </SwiperSlide>
          </Swiper>
        </main>

      </div>
    </section>
  );
}

export default Markt;
