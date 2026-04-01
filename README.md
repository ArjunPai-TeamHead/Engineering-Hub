# EngiNexus — Engineering Intelligence Platform

EngiNexus is an all-in-one learning, prototyping, and collaboration platform built for hardware engineers, makers, and students.

---

## 🏠 Home (Landing Page)

The main dashboard with quick-access cards to every section of the platform. Provides an at-a-glance overview of your activity and platform highlights.

## 🔬 The Lab

An interactive electronics component library and virtual breadboard simulator. Browse components (resistors, capacitors, ICs, sensors, etc.), view datasheets, pinouts, and wiring diagrams. Includes a code editor and serial monitor for simulated microcontroller projects.

## 💬 The Hive

A real-time community chat organized into topic-based channels (e.g. #general, #arduino-help, #project-showcase). Share messages, images, and files. React with emojis and collaborate with fellow engineers.

## 🎓 The Academy

A structured learning management system (LMS) with full courses on:

- **Raspberry Pi Robotics 2025** — 38 hands-on projects (LEDs, sensors, motors, IoT, GUI, Bluetooth, LCD)
- **Arduino Robotics 2025** — Core Arduino programming and circuit design
- **OpenCV Computer Vision 2025** — Image processing and computer vision with Python
- **PyGame Game Development 2025** — 2D game programming with Python

Each lesson includes content, code examples, and a quiz. Complete all quizzes with 100% to earn a certificate.

## 🧠 The Core

An AI-powered engineering assistant. Ask questions about:

- Compiler errors (avrdude, GCC, MicroPython) — translated to plain English
- Code translation between C++ and Python
- Component substitution suggestions
- Project ideas based on your available parts
- Code optimization and documentation
- Datasheets, pinouts, and protocols (I2C, SPI, UART, PWM)

## 🛒 The Depot

An electronics component marketplace. Browse and purchase components with a full checkout flow including shipping options, billing, and multiple payment methods (Stripe, UPI, Net Banking, COD). Includes personal wishlist and order history.

## 🔧 The Workshop (Toolbox + Forge)

A comprehensive collection of engineering calculators and tools:

**Toolbox:**
- Resistor Color Code Calculator
- Ohm's Law Calculator
- Voltage Divider Calculator
- LED Resistor Calculator
- Battery Life Estimator
- 555 Timer Calculator
- Base Number Converter
- ASCII Table Reference
- Unit Converter
- Regex Tester
- PCB Trace Width Calculator
- Power Calculator
- Capacitor Code Decoder
- Decibel Calculator
- Frequency Calculator

**Forge (Mechanical):**
- Mounting Hole Reference
- Wire Gauge Calculator
- Heatsink Calculator
- Fastener Calculator
- Connector Matcher

## 🔗 The Hub

A central dashboard linking to all platform sections with visual cards and descriptions.

## ☁️ Cloud Database

Personal cloud storage for your engineering files. Upload images, save code snippets, and organize text files — all synced securely to your account.

## 🏆 Certificates

View and showcase certificates earned by completing Academy courses with perfect quiz scores.

## ⚙️ Settings

Manage your profile (display name, username, avatar, bio, skill level, GitHub username) and account preferences.

## 🛡️ Admin Dashboard

(Admin-only) Manage users, view platform analytics, and moderate content. Protected by role-based access control.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (Supabase)
- **AI:** Lovable AI Gateway (Gemini models)
- **Auth:** Email/password with role-based access
- **Realtime:** Live chat via Supabase Realtime
