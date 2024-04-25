const fs = require('fs').promises;
const sax = require('sax');
const dayjs = require('dayjs');
const { pipeline } = require('stream');

const HEALTH_RECORD_TYPES = {
    move: {
        type: "HKQuantityTypeIdentifierActiveEnergyBurned",
        unit: "kCal",
        track_color: "#ED619C",
        func: parseFloat,
    },
    exercise: {
        type: "HKQuantityTypeIdentifierAppleExerciseTime",
        unit: "mins",
        track_color: "#D7FD37",
        func: parseInt,
    },
    stand: {
        type: "HKCategoryTypeIdentifierAppleStandHour",
        unit: "hours",
        track_color: "#62F90B",
        func: (x) => x.includes("HKCategoryValueAppleStandHourStood") ? 1 : 0,
    },
    water: {
        type: "HKQuantityTypeIdentifierDietaryWater",
        unit: "mL",
        track_color: "#aaa",
        func: parseInt,
    },
};

class AppleHealthLoader {
    constructor(from_year, to_year, options) {
        console.log(options)
        this.from_year = from_year;
        this.to_year = to_year;
        this.archive = {};
        this.number_by_date_dict = {};
        this.apple_health_export_file = options.apple_health_export_file || "IN_FOLDER/apple_health_export/export.xml";
        this.apple_health_record_type = options.apple_health_record_type || "move";
        this.apple_health_mode = options.apple_health_mode || "incremental";
        this.record_metadata = HEALTH_RECORD_TYPES[this.apple_health_record_type];

        this.unit = this.record_metadata.unit;
        this.track_color = this.record_metadata.track_color;
    }

    async loadAppleHealthHistory() {
        const historyFilePath = "IN_FOLDER/apple_history.json";

        try {
            const content = await fs.readFile(historyFilePath, "utf8");
            this.archive = JSON.parse(content);
            this.number_by_date_dict = this.archive[this.apple_health_record_type] || {};
        } catch (err) {
            console.error("Error reading history file:", err);
        }
    }

    async writeAppleHealthHistory() {
        const historyFilePath = "IN_FOLDER/apple_history.json";
        this.archive[this.apple_health_record_type] = this.number_by_date_dict;

        try {
            await fs.writeFile(historyFilePath, JSON.stringify(this.archive, null, 4));
            console.log("Apple Health history has been written.");
        } catch (err) {
            console.error("Error writing history file:", err);
        }
    }

    async _processRecords() {
        switch (this.apple_health_mode) {
            case "incremental":
                const dateStr = dayjs(this.apple_health_date).format('YYYY-MM-DD');
                const value = this.record_metadata.func(this.apple_health_value);
                this.number_by_date_dict[dateStr] = value;
                break;
            case "backfill":
                await this.backfill();
                break;
            default:
                throw new Error(`Invalid apple_health_mode: ${this.apple_health_mode}`);
        }
    }

    async backfill() {
        const fromExport = {};

        const saxStream = sax.createStream(true); // strict mode: true

        saxStream.on("error", (err) => {
            console.error("Parsing error:", err);
        });

        saxStream.on("opentag", (node) => {
            if (node.name === "Record" && node.attributes.type === this.record_metadata.type) {
                const created = dayjs(node.attributes.creationDate);
                if (created.year() >= this.from_year && created.year() <= this.to_year) {
                    const dateStr = created.format('YYYY-MM-DD');
                    const value = this.record_metadata.func(node.attributes.value);
                    fromExport[dateStr] = (fromExport[dateStr] || 0) + value;
                }
            }
        });

        saxStream.on("end", () => {
            for (const [date, value] of Object.entries(fromExport)) {
                if (!this.number_by_date_dict[date]) {
                    this.number_by_date_dict[date] = value;
                }
            }
            console.log("Parsing finished:", this.number_by_date_dict);
        });

        try {
            const fileStream = await fs.open(this.apple_health_export_file, 'r');
            await pipeline(fileStream, saxStream);
        } catch (err) {
            console.error("Error reading export file:", err);
        }
    }

    async makeTrackDict() {
        await this.loadAppleHealthHistory();
        await this._processRecords();
        await this.writeAppleHealthHistory();

        // Return relevant data
        return [this.number_by_date_dict];
    }

    async getAllTrackData() {
        const trackData = await this.makeTrackDict();
        return [trackData[0], [1, 2, 3]];
    }
}

module.exports = AppleHealthLoader;