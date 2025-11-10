# FastAPI Project - Frontend

The frontend is built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [TanStack Query](https://tanstack.com/query), [TanStack Router](https://tanstack.com/router) and [Chakra UI](https://chakra-ui.com/).

## Frontend development

Before you begin, ensure that you have either the Node Version Manager (nvm) or Fast Node Manager (fnm) installed on your system.

* To install fnm follow the [official fnm guide](https://github.com/Schniz/fnm#installation). If you prefer nvm, you can install it using the [official nvm guide](https://github.com/nvm-sh/nvm#installing-and-updating).

* After installing either nvm or fnm, proceed to the `frontend` directory:

```bash
cd frontend
```
* If the Node.js version specified in the `.nvmrc` file isn't installed on your system, you can install it using the appropriate command:

```bash
# If using fnm
fnm install

# If using nvm
nvm install
```

* Once the installation is complete, switch to the installed version:

```bash
# If using fnm
fnm use

# If using nvm
nvm use
```

* Within the `frontend` directory, install the necessary NPM packages:

```bash
npm install
```

* And start the live server with the following `npm` script:

```bash
npm run dev
```

* Then open your browser at http://localhost:5173/.

Notice that this live server is not running inside Docker, it's for local development, and that is the recommended workflow. Once you are happy with your frontend, you can build the frontend Docker image and start it, to test it in a production-like environment. But building the image at every change will not be as productive as running the local development server with live reload.

Check the file `package.json` to see other available options.

### Removing the frontend

If you are developing an API-only app and want to remove the frontend, you can do it easily:

* Remove the `./frontend` directory.

* In the `docker-compose.yml` file, remove the whole service / section `frontend`.

* In the `docker-compose.override.yml` file, remove the whole service / section `frontend` and `playwright`.

Done, you have a frontend-less (api-only) app. 🤓

---

If you want, you can also remove the `FRONTEND` environment variables from:

* `.env`
* `./scripts/*.sh`

But it would be only to clean them up, leaving them won't really have any effect either way.

## Generate Client

### Automatically

* Activate the backend virtual environment.
* From the top level project directory, run the script:

```bash
./scripts/generate-client.sh
```

* Commit the changes.

### Manually

* Start the Docker Compose stack.

* Download the OpenAPI JSON file from `http://localhost/api/v1/openapi.json` and copy it to a new file `openapi.json` at the root of the `frontend` directory.

* To generate the frontend client, run:

```bash
npm run generate-client
```

* Commit the changes.

Notice that everytime the backend changes (changing the OpenAPI schema), you should follow these steps again to update the frontend client.

## Using a Remote API

If you want to use a remote API, you can set the environment variable `VITE_API_URL` to the URL of the remote API. For example, you can set it in the `frontend/.env` file:

```env
VITE_API_URL=https://api.my-domain.example.com
```

Then, when you run the frontend, it will use that URL as the base URL for the API.

## Code Structure

The frontend code is structured as follows:

* `frontend/src` - The main frontend code.
* `frontend/src/assets` - Static assets.
* `frontend/src/client` - The generated OpenAPI client.
* `frontend/src/components` -  The different components of the frontend.
* `frontend/src/hooks` - Custom hooks.
* `frontend/src/routes` - The different routes of the frontend which include the pages.
* `theme.tsx` - The Chakra UI custom theme.

## New Components & Pages (Extension)

This project has been extended with an experimental analytics / model-insights layer. All new pages currently use embedded mock data (no live backend calls yet). Replace inline mock arrays/objects with real API responses once endpoints are available.

### Added Pages (under `src/routes/_layout/`)
| Page | File | Purpose |
|------|------|---------|
| Dashboard | `dashboard.tsx` | Overview stats, charts, recent AI insights, top sources table. |
| Source Detail | `source-detail.tsx` | Single source profile, trust score, evidence list, AI reasoning panel. |
| Compare Sources | `compare-sources.tsx` | Side-by-side metrics table & comparison charts plus AI summary. |
| Model Insights | `model-insights.tsx` | Model performance metrics, feature importance, uncertainty histogram, ask-model overlay. |
| App Settings | `app-settings.tsx` | App-level settings (theme, trust threshold, model/API keys mock). |
| About | `about.tsx` | Project overview, team info, contact links (placeholder). |

### Component Categories (under `src/components`)
Layout: `Layout/Footer.tsx`, `Layout/PageContainer.tsx` – shared wrapper and footer links.

Cards: `Cards/StatCard.tsx`, `Cards/TrustScoreCard.tsx`, `Cards/AlertCard.tsx` – numeric stat, trust score bar (custom), alert message.

Tables: `Tables/DataTable.tsx` (generic semantic table), `Tables/CompareTable.tsx`, `Tables/EvidenceTable.tsx` – comparisons and evidentiary lists.

Charts (Recharts wrapped in Chakra `Box`): `Charts/LineChart.tsx`, `BarChart.tsx`, `RadarChart.tsx`, `FeatureImportanceChart.tsx`, `UncertaintyHistogram.tsx`.

AI: `AI/AIChatPanel.tsx`, `AI/AIInsightBox.tsx`, `AI/AskModelDrawer.tsx` – lightweight mock AI interaction, insights surface, custom overlay (no Drawer dependency).

Filters: `Filters/SearchBar.tsx`, `Filters/DropdownFilter.tsx`, `Filters/DateRangePicker.tsx` – basic form inputs for client-side filtering.

Utilities: `Utilities/ThemeToggle.tsx` (placeholder – no real color mode switch yet), `Utilities/TooltipInfo.tsx` (simplified badge), `Utilities/BadgeConfidence.tsx` (color-coded confidence).

Hooks: `hooks/useDataFetch.ts` (mock fetch abstraction), `useAIQuery.ts` (mock AI responses), `useChartData.ts` (transform raw arrays for charts), `useColorByTrust.ts` (map trust scores to semantic colors).

Trust Colors Utility: `utils/trustColors.ts` centralizes score→color mapping (e.g. 0–30 red, 31–60 yellow, 61–80 teal, 81–100 green).

### Trust Score Mapping
The trust color helpers return semantic tokens you can use directly with Chakra props:
```
0–30   danger.500
31–60  warning.500
61–80  info.500
81–100 success.500
```
Adjust token names if your theme defines different semantic palettes.

### Key Component APIs
`StatCard`
Props: `title: string`, `value: string | number`, `description?: string`.
Usage:
```tsx
<StatCard title="Total Sources" value={128} description="Active last 24h" />
```

`TrustScoreCard`
Props: `score: number`, `label?: string`.
Usage:
```tsx
<TrustScoreCard score={72} label="Model Trust" />
```

`DataTable<T>`
Props:
- `columns: { key: keyof T; label: string }[]`
- `data: T[]`
- `renderCell?: (row: T, colKey: keyof T) => React.ReactNode`
Usage:
```tsx
interface Source { name: string; score: number }
const columns = [ { key: 'name', label: 'Name' }, { key: 'score', label: 'Score' } ]
const rows: Source[] = [ { name: 'Alpha', score: 88 }, { name: 'Beta', score: 64 } ]
<DataTable columns={columns} data={rows} />
```

`AIChatPanel`
Props: `messages: { role: 'user' | 'assistant'; content: string }[]`, `onSend(message: string)`, `loading?: boolean`.
Usage (mock):
```tsx
const [messages, setMessages] = useState([
	{ role: 'assistant', content: 'Ask me about sources.' }
])
const handleSend = (m: string) => setMessages(prev => [...prev, { role: 'user', content: m }])
<AIChatPanel messages={messages} onSend={handleSend} />
```

`AskModelDrawer`
Props: `isOpen: boolean`, `onClose: () => void`, `onAsk: (query: string) => void`, `loading?: boolean`.
Note: Implemented as a fixed-position overlay `Box` instead of Chakra `Drawer` (removed due to version/type issues). Replace with `Drawer` for full accessibility once dependency alignment is restored.

### Replacing Mock Data
Each page defines mock arrays/objects at top-level. When wiring to a backend:
1. Replace local constants with queries via your data fetching layer.
2. Handle loading & error states (currently omitted for brevity).
3. Remove or adapt AI mock delays in `useAIQuery`.

### Accessibility & Future Enhancements
- Reintroduce Chakra primitives (Drawer, Progress, Table) for better a11y if version mismatch resolved.
- Add keyboard focus trapping to `AskModelDrawer`.
- Implement real theme toggle using Chakra `useColorMode`.
- Add suspense/loading skeletons to charts & tables.

### Code Splitting Recommendation
Large dashboard and model insights code can be dynamically imported to reduce initial bundle size. Example with React lazy:
```tsx
const DashboardPage = React.lazy(() => import('./routes/_layout/dashboard'))
```

---

If you find inconsistencies or want richer Chakra integrations, open an issue or adjust imports per your Chakra version.

## End-to-End Testing with Playwright

The frontend includes initial end-to-end tests using Playwright. To run the tests, you need to have the Docker Compose stack running. Start the stack with the following command:

```bash
docker compose up -d --wait backend
```

Then, you can run the tests with the following command:

```bash
npx playwright test
```

You can also run your tests in UI mode to see the browser and interact with it running:

```bash
npx playwright test --ui
```

To stop and remove the Docker Compose stack and clean the data created in tests, use the following command:

```bash
docker compose down -v
```

To update the tests, navigate to the tests directory and modify the existing test files or add new ones as needed.

For more information on writing and running Playwright tests, refer to the official [Playwright documentation](https://playwright.dev/docs/intro).
