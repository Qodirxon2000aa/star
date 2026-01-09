import { createContext, useContext, useEffect, useState, useRef } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  // 🔥 loading faqat USER uchun
  const [loading, setLoading] = useState(true);

  // 🔒 duplicate fetch oldini olish
  const fetchedRef = useRef(false);

  /* =========================
     👤 USER FETCH
  ========================= */
  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);

      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-cache",
      });

      if (!res.ok) throw new Error("User fetch error");

      const text = await res.text();
      const data = JSON.parse(text);

      const userData = data.ok
        ? { balance: data.data?.balance || "0", ...data.data }
        : { balance: "0" };

      setApiUser(userData);
      return userData;
    } catch (err) {
      console.error("❌ fetchUserFromApi:", err.message);
      const fallback = { balance: "0" };
      setApiUser(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     📦 ORDERS (LAZY)
  ========================= */
  const fetchOrders = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/history.php?user_id=${actualUserId}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-cache",
      });

      if (!res.ok) throw new Error("Orders error");

      const data = await res.json();
      setOrders(data.ok && Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("❌ fetchOrders:", err.message);
      setOrders([]);
    }
  };

  /* =========================
     💳 PAYMENTS (LAZY)
  ========================= */
  const fetchPayments = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/payments.php?user_id=${actualUserId}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-cache",
      });

      if (!res.ok) throw new Error("Payments error");

      const data = await res.json();
      setPayments(data.ok && Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      console.error("❌ fetchPayments:", err.message);
      setPayments([]);
    }
  };

  /* =========================
     ⭐ ORDER
  ========================= */
  const createOrder = async ({ amount, sent, type, overall }) => {
    try {
      if (!user?.id) throw new Error("User ID yo‘q");

      const uid = user.isTelegram ? user.id : "7521806735";
      const url =
        `https://m4746.myxvest.ru/webapp/order.php` +
        `?user_id=${uid}&amount=${amount}&sent=@${sent.replace("@", "")}` +
        `&type=${type}&overall=${overall}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.ok) {
        await fetchUserFromApi(uid, user.isTelegram);
        return { ok: true };
      }

      return { ok: false, message: "Order saqlanmadi" };
    } catch (err) {
      console.error("❌ createOrder:", err.message);
      return { ok: false, message: err.message };
    }
  };

  /* =========================
     💎 PREMIUM
  ========================= */
  const createPremiumOrder = async ({ months, sent, overall }) => {
    try {
      if (!user?.id) throw new Error("User ID yo‘q");

      const uid = user.isTelegram ? user.id : "7521806735";
      const url =
        `https://m4746.myxvest.ru/webapp/premium.php` +
        `?user_id=${uid}&amount=${months}&sent=${sent.replace("@", "")}` +
        `&overall=${overall}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.ok) {
        await fetchUserFromApi(uid, user.isTelegram);
        return { ok: true, ...data };
      }

      return { ok: false, message: data.message };
    } catch (err) {
      console.error("❌ createPremiumOrder:", err.message);
      return { ok: false, message: err.message };
    }
  };

  /* =========================
     🔄 REFRESH (YENGIL)
  ========================= */
  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserFromApi(user.id, user.isTelegram);
    }
  };

  /* =========================
     🚀 INIT (BIR MARTA)
  ========================= */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const tgUser = tg?.initDataUnsafe?.user;

    if (tgUser?.id) {
      const baseUser = {
        id: tgUser.id,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        username: tgUser.username ? `@${tgUser.username}` : "",
        language_code: tgUser.language_code || "en",
        isTelegram: true,
        photo_url: tgUser.photo_url || null,
      };

      setUser(baseUser);
      fetchUserFromApi(tgUser.id, true);
    } else {
      // DEV MODE
      const devUser = {
        id: "7521806735",
        first_name: "Dev",
        last_name: "User",
        username: "@dev_user",
        language_code: "uz",
        isTelegram: false,
        photo_url: null,
      };

      setUser(devUser);
      fetchUserFromApi(devUser.id, false);
    }
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        orders,
        payments,
        loading,

        // 🔥 FUNKSIYALAR SAQLANDI
        fetchOrders,
        fetchPayments,
        createOrder,
        createPremiumOrder,
        refreshUser,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error("useTelegram must be used inside provider");
  return ctx;
};
