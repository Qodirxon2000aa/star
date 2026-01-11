import React, { useEffect, useState } from "react";
import "./Market.css";

const Market = ({ onClose }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [type, setType] = useState("all");
  const [giftsData, setGiftsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const url =
      type === "all"
        ? "https://m4746.myxvest.ru/webapp/giftlar.php"
        : `https://m4746.myxvest.ru/webapp/giftlar.php?type=${type}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setGiftsData(d.gifts || []);
        else setGiftsData([]);
      })
      .catch(() => setGiftsData([]))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="market-overlay" onClick={onClose}>
      <div
        className="market-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="market-header">
          <select
            className="filter-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">Barchasi</option>
            <option value="old">Eski giftlar</option>
            <option value="new">Yangi giftlar</option>
            <option value="cheap">Arzon giftlar</option>
            <option value="expensive">Qimmat giftlar</option>
          </select>

          <select className="sort-select">
            <option value="old">Eskilari birinchi</option>
            <option value="new">Yangilari birinchi</option>
          </select>
        </div>

        {/* ================= GRID ================= */}
        <div className="gifts-grid">
          {loading && <p className="loading-text">Loading...</p>}

          {!loading && giftsData.length === 0 && (
            <p className="loading-text">Giftlar topilmadi</p>
          )}

          {!loading &&
            giftsData.map((gift) => (
              <div
                key={gift.id}
                className="gift-card"
                onClick={() => setSelectedGift(gift)}
              >
                <div className="gift-image">
                  <img src={gift.photo} alt={gift.nft_id} />
                </div>

                <div className="gift-info">
                  <div className="column">
                    <p className="gift-name">{gift.nft_id}</p>
                    <p className="gift-price">
                      {Number(gift.price).toLocaleString()} so'm
                    </p>
                     <button className="buuy">Sotib olish</button>
                  </div>
               

                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selectedGift && (
        <div className="detail-overlay" onClick={() => setSelectedGift(null)}>
          <div
            className="detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="detail-close-btn"
              onClick={() => setSelectedGift(null)}
            >
              ×
            </button>
            <br />

            <div className="detail-top">
              <div className="gift-image-large">
                <img
                  src={selectedGift.photo}
                  alt={selectedGift.nft_id}
                />
              </div>

              <div className="detail-right">
                <h3 className="detail-name">
                  <span>{selectedGift.nft_id}</span>
                </h3>

                <div className="detail-info">
                  <p><b>Model:</b> {selectedGift.model}</p>
                  <p><b>Symbol:</b> {selectedGift.symbol}</p>
                  <p><b>Backdrop:</b> {selectedGift.backdrop}</p>
                  <p><b>Sana:</b> {selectedGift.created_at}</p>
                </div>
              </div>
            </div>

            <div className="detail-bottom">
              <button className="balance-btn disabled">
                Balans yetarli emas
              </button>

              <div className="detail-actions">
                <a
                  href={selectedGift.link}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn"
                >
                  👀
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}
    </div>
  );
};

export default Market;
