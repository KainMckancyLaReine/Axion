# 🚀 Axion — Crypto Dashboard UI (React + TypeScript)

---

## ✨ Project Overview

**Axion** is a sleek, modern, and responsive **crypto dashboard UI** built with **React**, **TypeScript**, **Tailwind CSS**, and **Chart.js**. It fetches live cryptocurrency data from the free [CoinGecko API](https://www.coingecko.com/en/api) and displays it in an intuitive, easy-to-use interface with dark mode, favorites, and currency switching.

---

## 🚀 Features

- 🔥 Real-time crypto prices and market data
- 📊 Beautiful token cards with sparklines and 24h % changes
- 🌗 Toggleable dark mode (persistent with localStorage)
- 💱 Switch between USD, EUR, and BTC
- 🔍 Search and filter tokens instantly
- ⭐ Mark tokens as favorites (saved locally)
- 📈 Detailed price charts with Chart.js
- 🔄 Manual data refresh button
- 📱 Fully responsive and mobile-friendly design

---

## 🛠️ Technology Stack

| Technology       | Purpose                           |
|------------------|---------------------------------|
| ⚛️ React + TypeScript | Component-based UI & strong typing |
| 🎨 Tailwind CSS  | Utility-first styling framework |
| 📈 Chart.js      | Interactive charts               |
| 🪙 CoinGecko API | Live cryptocurrency data        |
| 🌐 React Context | Global state management          |
| 💾 localStorage  | Persist user preferences         |

---

## 📁 Project Structure

```bash
src/
├── assets/                # Icons, images
├── components/            # Reusable UI components (TSX)
├── context/               # App-wide React context & state
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions/utilities
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles
