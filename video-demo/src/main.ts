import { mount } from 'svelte';
import App from './app.svelte';

const target = document.getElementById('app');
if (!target) throw new Error('Video demo mount target is missing.');

mount(App, { target });
