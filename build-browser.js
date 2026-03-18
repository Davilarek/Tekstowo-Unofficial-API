import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const bundle = await rollup({
	input: './index.js',
	plugins: [
		resolve({ browser: true }),
		commonjs()
	]
});

await bundle.write({
	file: './dist/TekstowoAPI-browser.js',
	format: 'umd',
	name: '_internalAPI',
	footer: `{const oldRequire = window.require;
window.require = function(path) {
	if (path === './TekstowoAPI' || path === 'TekstowoAPI') {
	return window._internalAPI;
	}
	return oldRequire ? oldRequire(path) : undefined;
};}`
});
