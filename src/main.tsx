import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import {
//   KBarProvider,
//   KBarPortal,
//   KBarPositioner,
//   KBarAnimator,
//   KBarSearch,
// } from "kbar";

// import RenderResults from './RenderResults.tsx';

import './index.css'

// TO-DO kbar code to add later
// const actions = [
//   {
//     id: "blog",
//     name: "Blog",
//     shortcut: ["b"],
//     keywords: "writing words",
//     perform: () => (window.location.pathname = "blog"),
//   },
//   {
//     id: "contact",
//     name: "Contact",
//     shortcut: ["c"],
//     keywords: "email",
//     perform: () => (window.location.pathname = "contact"),
//   },
// ]


ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    {/* TO-DO - add kbar in the near future
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator>
            <KBarSearch />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      <App />
    </KBarProvider>
     */}
     <App />
  </React.StrictMode>,
)
