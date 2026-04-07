import { useState } from 'react';
import { Phone, MapPin, User, Play } from 'lucide-react';

export default function App() {
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Ajika colors - red/orange theme matching real ajika
  const colors = {
    primary: '#C1331E', // Ajika red-orange
    secondary: '#D9534F', // Lighter red
    accent: '#8B1A1A', // Dark red
    footer: '#5A0D23', // Deep burgundy (from header)
    text: '#FFFFFF',
    textDark: '#1A1A1A',
    light: '#FFF5F0', // Light peachy background
    cream: '#FEF9F5',
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`შეკვეთა მიღებულია!\nსახელი: ${orderForm.name}\nტელეფონი: ${orderForm.phone}\nმისამართი: ${orderForm.address}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <header className="py-4 px-4 md:py-6 md:px-8 shadow-lg" style={{ backgroundColor: colors.footer }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logo with pepper "ჯ" */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                {/* Creating ჯ from peppers */}
                <span className="absolute top-0 left-3 md:left-4 text-2xl md:text-3xl">🌶️</span>
                <span className="absolute top-2 md:top-3 left-6 md:left-8 text-2xl md:text-3xl">🌶️</span>
                <span className="absolute top-4 md:top-6 left-3 md:left-4 text-2xl md:text-3xl">🌶️</span>
                <span className="absolute top-6 md:top-9 left-1 md:left-2 text-2xl md:text-3xl">🌶️</span>
                <span className="absolute bottom-0 left-0 md:left-1 text-2xl md:text-3xl">🌶️</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ color: colors.text }}>
                  ajika<span className="text-lg md:text-xl opacity-70">.store</span>
                </h1>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-3 md:gap-6">
            <a href="#intro" className="hidden sm:block hover:opacity-80 transition-opacity text-sm md:text-base" style={{ color: colors.text }}>
              მთავარი
            </a>
            <a href="#video" className="hidden sm:block hover:opacity-80 transition-opacity text-sm md:text-base" style={{ color: colors.text }}>
              ვიდეო
            </a>
            <a href="#order" className="hover:opacity-80 transition-opacity text-sm md:text-base" style={{ color: colors.text }}>
              შეკვეთა
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-8" style={{ backgroundColor: colors.footer }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6" style={{ color: colors.text }}>
            ზაკის ა🌶️იკა
          </h2>
          <p className="text-lg md:text-2xl mb-6 md:mb-8" style={{ color: colors.light }}>
            ტრადიციული რეცეპტით დამზადებული
          </p>
          <div className="flex justify-center gap-3 md:gap-4 text-5xl md:text-7xl mb-6 md:mb-8">
            <span className="animate-bounce">🌶️</span>
            <span className="animate-pulse">🧄</span>
            <span className="animate-bounce">🌿</span>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro" className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center" style={{ color: colors.footer }}>
            რა არის ჩვენი აჯიკა?
          </h2>
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-md">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: colors.primary }}>
                🌱 100% ნატურალური
              </h3>
              <p className="text-sm md:text-base" style={{ color: colors.textDark }}>
                მხოლოდ ნატურალური ინგრედიენტები, ქიმიური დანამატების და კონსერვანტების გარეშე
              </p>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-md">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: colors.primary }}>
                👵 ტრადიციული რეცეპტი
              </h3>
              <p className="text-sm md:text-base" style={{ color: colors.textDark }}>
                აფხაზური ოჯახური რეცეპტი, რომელიც თაობიდან თაობას გადმოეცემა
              </p>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-md">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: colors.primary }}>
                🔥 უნიკალური გემო
              </h3>
              <p className="text-sm md:text-base" style={{ color: colors.textDark }}>
                იდეალური ბალანსი სიმწვანესა და არომატს შორის
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Video Section */}
      <section id="video" className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: colors.footer }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center" style={{ color: colors.text }}>
            როგორ იწარმოება ჩვენი აჯიკა
          </h2>
          <div className="relative bg-gradient-to-br from-red-900 to-red-700 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center group cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 text-center px-4">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform"
                style={{ backgroundColor: colors.text }}
              >
                <Play size={36} style={{ color: colors.primary }} fill="currentColor" className="ml-1" />
              </div>
              <p className="text-lg md:text-xl font-semibold" style={{ color: colors.text }}>
                ნახეთ ვიდეო
              </p>
              <p className="text-xs md:text-sm" style={{ color: colors.light }}>
                აჯიკის მომზადების პროცესი
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm p-5 md:p-6 rounded-xl">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">1️⃣</div>
              <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base" style={{ color: colors.text }}>
                შერჩევა
              </h3>
              <p className="text-xs md:text-sm" style={{ color: colors.light }}>
                საუკეთესო ხარისხის ინგრედიენტების შერჩევა
              </p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-5 md:p-6 rounded-xl">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">2️⃣</div>
              <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base" style={{ color: colors.text }}>
                დამუშავება
              </h3>
              <p className="text-xs md:text-sm" style={{ color: colors.light }}>
                ხელით დამუშავება ტრადიციული მეთოდით
              </p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-5 md:p-6 rounded-xl">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">3️⃣</div>
              <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base" style={{ color: colors.text }}>
                შეფუთვა
              </h3>
              <p className="text-xs md:text-sm" style={{ color: colors.light }}>
                სანიტარული ნორმების დაცვით შეფუთვა
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product & Order Section */}
      <section id="order" className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center" style={{ color: colors.footer }}>
            გაფორმეთ შეკვეთა
          </h2>

          {/* Order Form */}
          <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="text-6xl md:text-7xl text-center mb-4 md:mb-6">🌶️</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center" style={{ color: colors.primary }}>
              აფხაზური აჯიკა
            </h3>

            <form onSubmit={handleOrderSubmit} className="space-y-5 md:space-y-6">
              <div>
                <label className="block mb-2 font-semibold flex items-center gap-2 text-sm md:text-base" style={{ color: colors.textDark }}>
                  <User size={18} style={{ color: colors.primary }} />
                  სახელი და გვარი
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-sm md:text-base"
                  placeholder="მიუთითეთ თქვენი სახელი"
                  style={{ borderColor: colors.light }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold flex items-center gap-2 text-sm md:text-base" style={{ color: colors.textDark }}>
                  <Phone size={18} style={{ color: colors.primary }} />
                  ტელეფონი
                </label>
                <input
                  type="tel"
                  required
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-sm md:text-base"
                  placeholder="+995 555 12 34 56"
                  style={{ borderColor: colors.light }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold flex items-center gap-2 text-sm md:text-base" style={{ color: colors.textDark }}>
                  <MapPin size={18} style={{ color: colors.primary }} />
                  მიწოდების მისამართი
                </label>
                <textarea
                  required
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none text-sm md:text-base"
                  rows={3}
                  placeholder="მიუთითეთ ზუსტი მისამართი"
                  style={{ borderColor: colors.light }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm md:text-base" style={{ color: colors.textDark }}>
                  აირჩიეთ მოცულობა
                </label>
                <select
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-semibold text-sm md:text-base"
                  style={{ borderColor: colors.light, color: colors.primary }}
                  required
                >
                  <option value="">აირჩიეთ...</option>
                  <option value="0.5">0.5 ლიტრი - 25₾</option>
                  <option value="1">1 ლიტრი - 50₾</option>
                  <option value="2">2 ლიტრი - 100₾</option>
                  <option value="3">3 ლიტრი - 150₾</option>
                  <option value="5">5 ლიტრი - 250₾</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold text-lg md:text-xl hover:opacity-90 transition-opacity shadow-lg"
                style={{ backgroundColor: colors.primary, color: colors.text }}
              >
                შეკვეთის გაფორმება
              </button>
            </form>
            <p className="mt-4 text-xs md:text-sm text-center font-semibold" style={{ color: colors.primary }}>
              📦 თბილისში 17:00 საათამდე შეკვეთა იმავე დღეს მიგიღებთ
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: colors.footer }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center" style={{ color: colors.text }}>
            რატომ ჩვენ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">🚚</div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: colors.text }}>
                სწრაფი მიწოდება
              </h3>
              <p className="text-sm" style={{ color: colors.light }}>
                თბილისში იმავე დღეს (17:00-მდე შეკვეთისას)
              </p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">🌱</div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: colors.text }}>
                100% ნატურალური
              </h3>
              <p className="text-sm" style={{ color: colors.light }}>
                ქიმიური დანამატებისა და კონსერვანტების გარეშე
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-8" style={{ backgroundColor: colors.footer }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <span className="absolute top-0 left-2 text-lg md:text-xl">🌶️</span>
                  <span className="absolute top-1 md:top-2 left-3 md:left-4 text-lg md:text-xl">🌶️</span>
                  <span className="absolute top-3 md:top-4 left-2 text-lg md:text-xl">🌶️</span>
                  <span className="absolute top-5 md:top-6 left-1 text-lg md:text-xl">🌶️</span>
                  <span className="absolute bottom-0 left-0 text-lg md:text-xl">🌶️</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold" style={{ color: colors.text }}>
                  აჯიკა
                </h4>
              </div>
              <p className="text-xs md:text-sm" style={{ color: colors.light }}>
                ნამდვილი აფხაზური აჯიკა
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base" style={{ color: colors.text }}>
                ნავიგაცია
              </h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm" style={{ color: colors.light }}>
                <li>
                  <a href="#intro" className="hover:opacity-80 transition-opacity">
                    მთავარი
                  </a>
                </li>
                <li>
                  <a href="#video" className="hover:opacity-80 transition-opacity">
                    ვიდეო
                  </a>
                </li>
                <li>
                  <a href="#order" className="hover:opacity-80 transition-opacity">
                    შეკვეთა
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base" style={{ color: colors.text }}>
                კონტაქტი
              </h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm" style={{ color: colors.light }}>
                <li className="flex items-center gap-2">
                  <Phone size={14} />
                  +995 555 123 456
                </li>
                <li>📧 info@ajika.store</li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} />
                  თბილისი
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base" style={{ color: colors.text }}>
                სამუშაო საათები
              </h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm" style={{ color: colors.light }}>
                <li>ორშაბათი-პარასკევი</li>
                <li>10:00 - 19:00</li>
                <li>შაბათი: 11:00 - 17:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 md:pt-8 text-center text-xs md:text-sm" style={{ borderColor: colors.accent, color: colors.light }}>
            <p>© 2026 აჯიკა • ყველა უფლება დაცულია</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
