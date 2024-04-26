import path from "path";
import { argsHandle } from "./utils";
import { AppleHealth } from "./loaders";


type DefaultParams = {
    mode: 'add' | 'history';
    [key: string]: any;
}

const setDefaultParams = (args: Record<string, string | boolean>): DefaultParams => {
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
        dataFilePath: path.resolve(__dirname, './data/test.json'),
        // dataFilePath: path.resolve(__dirname, './data/AppleHealth.json'),
    }).then(() => {
        console.log('✨  add success');
    });
} else {
    AppleHealth.LoadHistoryData({
        historyFilePath: path.resolve(__dirname, './history/export.xml'),
        outputFilePath: path.resolve(__dirname, './data/AppleHealth.json'),
    }).then((data) => {
        console.log('✨  Done')
    }).catch(err => {
        console.error('Error:', err);
    });
}

