import { createRoot } from 'react-dom/client';

import { App } from './App';

let domNode = document.getElementById('root');

if (!domNode) {
  domNode = document.createElement('div');
  domNode.setAttribute('id', 'root');
  document.body.appendChild(domNode);
}

const root = createRoot(domNode);

root.render(<App />);
