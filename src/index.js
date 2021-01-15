import Index from './components/index.js';
import { renderToString } from 'react-dom/server';

let content = renderToString(<Index />);
console.log('content', content);