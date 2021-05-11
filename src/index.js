// @ts-check
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

let root = document.getElementById('root');
if (root) {
  root.innerHTML = '';
}
else {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.render(
  <App />,
  root
);