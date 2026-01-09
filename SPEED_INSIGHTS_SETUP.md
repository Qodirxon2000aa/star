# Getting started with Speed Insights

This guide documents how Vercel Speed Insights is set up in this project, showing how it's enabled, added to the project, and configured for deployment to Vercel.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
pnpm i vercel
# or
yarn i vercel
# or
npm i vercel
# or
bun i vercel
```

## Installation and Setup

### 1. Enable Speed Insights in Vercel

On the [Vercel dashboard](/dashboard), select your Project followed by the **Speed Insights** tab. Then, select **Enable** from the dialog.

> **💡 Note:** Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.

### 2. Add `@vercel/speed-insights` to your project

Using npm (or your package manager of choice), add the `@vercel/speed-insights` package to your project:

```bash
npm i @vercel/speed-insights
# or
pnpm i @vercel/speed-insights
# or
yarn i @vercel/speed-insights
# or
bun i @vercel/speed-insights
```

This project already has this dependency installed in `package.json`.

### 3. Add the `SpeedInsights` component to your React/Vite app

For React applications (including Vite-based React apps), add the `SpeedInsights` component to your main App component:

```jsx
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <SpeedInsights />
    </div>
  );
}
```

In this project, the `SpeedInsights` component is integrated in `src/App.jsx`:

```jsx
import { SpeedInsights } from "@vercel/speed-insights/react";

const AppContent = () => {
  // ... component logic
  return (
    <Router>
      {/* Routes and content */}
      <SpeedInsights />
    </Router>
  );
};
```

The component can be placed anywhere within your app, but it's recommended to place it near the top level to ensure it captures all page loads.

### 4. Deploy your app to Vercel

You can deploy your app to Vercel's global CDN by running the following command from your terminal:

```bash
vercel deploy
```

Alternatively, you can [connect your project's git repository](/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest pushes and merges to main.

Once your app is deployed, it's ready to begin tracking performance metrics.

> **💡 Note:** If everything is set up correctly, you should be able to find the `/_vercel/speed-insights/script.js` script inside the body tag of your page.

### 5. View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view the data in the dashboard.

To do so, go to your [dashboard](/dashboard), select your project, and click the **Speed Insights** tab.

After a few days of visitors, you'll be able to start exploring your metrics. For more information on how to use Speed Insights, see [Using Speed Insights](/docs/speed-insights/using-speed-insights).

## Framework-Specific Integration

This is a **Vite + React** project, which follows the same integration pattern as a Create React App project.

For the `SpeedInsights` component from `@vercel/speed-insights/react`:
- Import the component from `@vercel/speed-insights/react`
- Add it somewhere in your component tree (typically near the root)
- No additional configuration is required

The component automatically:
- Injects the tracking script
- Captures Web Vitals and performance metrics
- Sends data to Vercel's analytics servers
- Works with client-side routing (React Router, etc.)

## Privacy and Data Compliance

Learn more about how Vercel supports [privacy and data compliance standards](/docs/speed-insights/privacy-policy) with Vercel Speed Insights.

## Next steps

Now that you have Vercel Speed Insights set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/speed-insights` package](/docs/speed-insights/package)
- [Learn about metrics](/docs/speed-insights/metrics)
- [Read about privacy and compliance](/docs/speed-insights/privacy-policy)
- [Explore pricing](/docs/speed-insights/limits-and-pricing)
- [Troubleshooting](/docs/speed-insights/troubleshooting)
