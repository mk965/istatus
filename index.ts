import path from "path";
import { argsHandle } from "./utils";
import { AppleHealth } from "./loaders";
import { generateSVG } from './generateSVG';
import fs from 'fs';

type DefaultParams = {
    mode: 'add' | 'history';
    [key: string]: any;
}

const setDefaultParams = (args: Record<string, string | boolean>): DefaultParams => {
    console.log("设置默认参数", args)
    return {
        mode: 'history',
        ...args
    }
}

const params = setDefaultParams(argsHandle(process.argv.slice(2) ?? []));

console.log("参数", params)


if (params.mode === 'add') {
    AppleHealth.AddData({
        ...params,
        // dataFilePath: path.resolve(__dirname, './data/test.json'),
        dataFilePath: path.resolve(__dirname, './data/AppleHealth.json'),
    }).then(() => {
        console.log('✨  add success');
        try {
            const appleData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/AppleHealth.json'), 'utf8').toString());
            const svg = generateSVG(appleData.water);
            fs.writeFileSync(path.resolve(__dirname, './svg/water.svg'), svg);
        } catch (error) {
            console.log("解析错误", error);
        }
    });
} else {
    AppleHealth.LoadHistoryData({
        historyFilePath: path.resolve(__dirname, './history/export.xml'),
        outputFilePath: path.resolve(__dirname, './data/AppleHealth.json'),
    }).then((data) => {
        console.log('✨  Done')
        const svg = generateSVG(data.water);
        fs.writeFileSync(path.resolve(__dirname, './svg/water.svg'), svg);
    }).catch(err => {
        console.error('Error:', err);
    });
}

