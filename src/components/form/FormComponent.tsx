import React, { useState, FormEvent } from "react";
import "./Form.css";

interface SubmittedData {
  coin: string;
  date: string;
}

const FormComponent: React.FC = () => {
  const [coin, setCoin] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [submitted, setSubmitted] = useState<SubmittedData | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted({ coin: coin.trim(), date });
  }


  function clearAll() {
    setCoin("");
    setDate("");
    setSubmitted(null);
  }

  return (
    <div className="hud-container">
      <div className="hud-box">
        <h2 className="hud-title">COIN MARKET HUD</h2>

        <div className="hud-field">
          <label className="hud-label">Coin Name</label>
          <input
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            placeholder="e.g. Bitcoin"
            className="hud-input"
          />
        </div>

        <div className="hud-field">
          <label className="hud-label">Date (DD/MM/YYYY)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="hud-input"
          />
        </div>

        <div className="hud-action">
          <button
            onClick={() => alert(`Coin: ${coin}, Date: ${date}`)}
            className="hud-button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
