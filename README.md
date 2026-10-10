# FreshLink 🌱
### Hyperlocal Produce · Zero Waste

FreshLink is a hyperlocal produce-matching platform designed to connect produce vendors with buyers in nearby areas. It aims to help buyers find the produce they need while helping vendors manage their stock and reduce waste from unsold inventory.

## ✨ Features

- **Role-Based Access:** Registration and login for users, with vendor and buyer workflows.
- **Vendor Stock Management:** Add produce items, quantities, and prices per kilogram.
- **Surplus Stock Management:** Mark unsold produce as surplus and apply a 30% discount.
- **Buyer Requirements:** Post produce requirements with the quantity needed.
- **Smart Produce Matching:** Match buyer requirements with available vendor stock.
- **Location-Based Matching:** Find matching vendors within a 4 km radius.
- **Price-Aware Results:** Prioritize lower effective prices, with distance used as a secondary sorting factor.
- **Voice-Assisted Stock Entry:** Use voice input to help enter produce quantities and prices.
- **Profile Management:** Manage business information and location details.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Supabase | Authentication and backend data access |
| React Router | Client-side navigation |
| Framer Motion | UI animations |
| Lucide React | Icons |

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project configured for the application

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chvnagarjunababu14-boop/Fresh-Circle.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Fresh-Circle
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables.

   Create a `.env` file in the project root with the following variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

   Replace the placeholder values with the appropriate values from your Supabase project.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed in your terminal.

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run lint checks:

```bash
npm run lint
```

## 🧠 How Matching Works

FreshLink's matching algorithm:

1. Reads open buyer requirements.
2. Finds available products with matching item names.
3. Filters out vendors without usable location coordinates and vendors outside the 4 km radius.
4. Applies a 30% discount to products marked as surplus.
5. Sorts matching products by effective price and then distance.
6. Collects available quantities until the buyer's requirement is fulfilled or matching stock runs out.

## 🎯 Goal

FreshLink aims to make local produce sourcing more efficient by connecting nearby buyers and vendors, improving stock visibility, and encouraging the use of surplus produce.

## 🔐 Configuration & Security

- Keep private credentials and service-role keys out of source control.
- Configure Supabase authentication and database access policies before deploying the application.
- Do not commit your local `.env` file.

## 📌 Project Status

FreshLink is an ongoing project. Features and functionality may evolve as development continues.

## 👨‍💻 Repository

[View Fresh-Circle on GitHub](https://github.com/chvnagarjunababu14-boop/Fresh-Circle)
