import { createContext, useContext, useEffect, useState, useRef } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
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
     📦 ORDERS
  ========================= */
  const fetchOrders = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/history.php?user_id=${actualUserId}`;

      const res = await fetch(url);
      const data = await res.json();

      setOrders(data.ok && Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    }
  };

  /* =========================
     💳 PAYMENTS
  ========================= */
  const fetchPayments = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/payments.php?user_id=${actualUserId}`;

      const res = await fetch(url);
      const data = await res.json();

      setPayments(data.ok && Array.isArray(data.payments) ? data.payments : []);
    } catch {
      setPayments([]);
    }
  };

  /* =========================
     ⭐ ORDER
  ========================= */
  const createOrder = async ({ amount, sent, type, overall }) => {
    try {
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

      return { ok: false };
    } catch {
      return { ok: false };
    }
  };

  /* =========================
     💎 PREMIUM
  ========================= */
  const createPremiumOrder = async ({ months, sent, overall }) => {
    try {
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
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  /* =========================
     🎁 GIFT ORDER (YANGI)
  ========================= */
  const createGiftOrder = async ({ giftId, sent, price }) => {
    try {
      if (!user?.id) throw new Error("User yo‘q");

      const uid = user.isTelegram ? user.id : "7521806735";
      const balance = Number(apiUser?.balance || 0);

      if (balance < price) {
        return { ok: false, message: "Balans yetarli emas" };
      }

      const cleanUsername = sent.startsWith("@") ? sent : `@${sent}`;

      const url =
        `https://m4746.myxvest.ru/webapp/gifting.php` +
        `?user_id=${uid}` +
        `&gift_id=${giftId}` +
        `&sent=${encodeURIComponent(cleanUsername)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data?.ok) {
        return { ok: false, message: data?.message || "Gift xatosi" };
      }

      await fetchUserFromApi(uid, user.isTelegram);

      return { ok: true, data };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  /* =========================
     🔄 REFRESH
  ========================= */
  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserFromApi(user.id, user.isTelegram);
    }
  };

  /* =========================
     🚀 INIT
  ========================= */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const tgUser = tg?.initDataUnsafe?.user;

    if (tgUser?.id) {
      setUser({
        id: tgUser.id,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        username: tgUser.username ? `@${tgUser.username}` : "",
        isTelegram: true,
      });
      fetchUserFromApi(tgUser.id, true);
    } else {
      const devUser = {
        id: "7521806735",
        first_name: "Dev",
        username: "@dev_user",
        isTelegram: false,
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

        fetchOrders,
        fetchPayments,
        createOrder,
        createPremiumOrder,
        createGiftOrder,
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
