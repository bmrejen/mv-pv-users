import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'build/src/main.js',
    output: {
        file: 'dist/js/users.js',
        format: 'iife'
    },
    onwarn: function(warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

        // console.warn everything else
        console.warn( warning.message );
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            module: true,
        }),
        commonjs({
            include: [
                'node_modules/**',
            ],
        })
    ]
};
