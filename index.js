const AppleHealthLoader = require('./AppleHealthLoader');


// 创建一个新的 AppleHealthLoader 实例
// const loader = new AppleHealthLoader(2023, 2024, "type", {
//     apple_health_export_file: "test.xml", // 设置 Apple Health export 文件路径
//     apple_health_record_type: "move", // 设置 Apple Health 记录类型
//     apple_health_date: "2021-01-01", // 设置 Apple Health 记录日期
//     apple_health_value: "100", // 设置 Apple Health 记录值
//     apple_health_mode: "incremental" // 设置加载模式，可以是 "backfill" 或 "incremental"
// });
// const loader = new AppleHealthLoader(2023, 2024, "type", {
//     apple_health_export_file: "./test.xml", // 设置 Apple Health export 文件路径
//     apple_health_record_type: "water", // 设置 Apple Health 记录类型
//     apple_health_mode: "backfill" // 设置加载模式，可以是 "backfill" 或 "incremental"
// });

// console.log(loader)
// 调用获取所有跟踪数据的方法
// loader.get_all_track_data().then(data => {
//     console.log("{{{{{{{{Data:", data);
//     const [numberByDateDict, yearList] = data;
//     // 处理返回的数据
//     console.log("Number by Date Dict:", numberByDateDict);
//     console.log("Year List:", yearList);
// });

    
    
    

const loader = new AppleHealthLoader(2023, 2024, {
    apple_health_export_file: 'test.xml',
    apple_health_record_type: 'water', // or other types
    // apple_health_date: '2024-01-01', // example date
    // apple_health_value: '100', // example value
    apple_health_mode: 'backfill', // or 'backfill'
});

(async () => {
    try {
        await loader.makeTrackDict(); // This will load, process, and save data
        const allTrackData = await loader.getAllTrackData(); // Get all track data
        console.log(allTrackData);
    } catch (error) {
        console.error('Error:', error);
    }
})();

