const production = !process.env.ROLLUP_WATCH

/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
    purge: {
        content: ['./src/App.svelte'],
        enabled: production, // disable purge in dev
    },
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {},
    },
    plugins: [],
}
