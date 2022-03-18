'use strict';

const path = require('path');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');
// const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

var config = {
    entry: path.join(path.resolve(__dirname, 'src/frontend-editing'), 'main.js'),

    output: {
        path: path.resolve(__dirname, 'web/assets/dist'),
        filename: 'frontend-editing.js'
    },

    // plugins: [
    //     new MiniCssExtractPlugin( {
    //         filename: 'frontend-editing.css'
    //     } )
    // ],

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: ['raw-loader']
            },
            // {
            //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions: styles.getPostCssConfig( {
            //                     themeImporter: {
            //                         themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
            //                     },
            //                     minify: true
            //                 } )
            //             }
            //         }
            //     ]
            // }
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig({
                                themeImporter: {
                                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                                },
                                minify: true
                            })
                        }
                    }
                ]
            }
        ]
    },

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: {hints: false}
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.cache = {
            type: 'filesystem',
        };
    }

    return config;
};
