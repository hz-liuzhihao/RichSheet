const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, '../example/src/index.html'),
    filename: './index.html',
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
});

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '../example/src/index.ts'),
    output: {
        path: path.join(__dirname, '../example/dist'),
        // 为从 entry 中配置生成的 Chunk 配置输出文件的名称
        filename: 'bundle.js',
        // 为动态加载的 Chunk 配置输出文件的名称
        chunkFilename: '[name].[hash].js',
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 0,
        }
    },
    module: {
        rules: [{
                test: /\.tsx?/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                // pre/nomal/post - loader的执行顺序 - 前/中/后
                enforce: 'pre',
                test: /\.tsx?/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|mp4)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20,
                    },
                },
            },
            {
                test: /\.less$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }, 'less-loader']
            }
        ],
    },
    //映射工具
    devtool: 'inline-source-map',
    //处理路径解析
    resolve: {
        //extensions 拓展名
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        alias: {
            custom: '../lib/index.js'
        }
    },
    plugins: [htmlWebpackPlugin, miniCssExtractPlugin, new CleanWebpackPlugin()],
    devServer: {
        port: 3005,
    },
}
