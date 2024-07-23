import AWS from 'aws-sdk';
import fs from 'fs';
import fluent from 'fluent-ffmpeg';
import axios from 'axios';
import { exec } from 'child_process';

export default {
    // download .oga file
    download: async (url, outputPath) => {
        const writer = fs.createWriteStream(outputPath);
        const response = await axios({url, method: 'GET', responseType: 'stream'});

        response.data.pipe(writer);
    },
    // check if user folder exists, if not create it
    folderStructureSync: (folder) => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    },
    // convert .oga to .wav
    convert: async (inputPath, outputPath) => {
        return await fluent(inputPath).toFormat('wav').save(outputPath);
    },
    // extract text from .wav
    speechToText: async (filePath) => {
        const result = await new Promise((resolve, reject) => {
            const pythonExec = process.env.PYTHON_EXEC_PATH || 'python';
            exec(`${pythonExec} python/transcribe.py "${filePath}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });
        });

        return JSON.parse(result);
    },
    // get answer from Google Bard
    getAnswer: async (text) => {
        const gb1psid = process.env.GOOGLE_BARD_SECURE_1PSID;
        const gb1psidts = process.env.GOOGLE_BARD_SECURE_1PSIDTS;
        const result = await new Promise((resolve, reject) => {
            const pythonExec = process.env.PYTHON_EXEC_PATH || 'python';
            exec(`${pythonExec} python/answer.py "${gb1psid}" "${gb1psidts}" "${text}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });
        });

        return JSON.parse(result);
    },
    // empty folder
    emptyFolder: async (folder) => {
        fs.readdir(folder, (err, files) => {
            if (err) {
                console.error(err.message);
            }
            for (const file of files) {
                fs.unlink(`${folder}/${file}`, err => {
                    if (err) {
                        console.error(err.message);
                    }
                });
            }
        });
    },
    // text to voice
    textToVoice: async (text, folderPath) => {
        AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY);
        AWS.config.region = "us-west-2";

        // text-to-speech service
        const Polly = new AWS.Polly({signatureVersion: 'v4', region: 'us-west-2'});

        const params = {'Text': text, 'OutputFormat': 'ogg_vorbis', 'VoiceId': 'Joanna'};
        const data = await Polly.synthesizeSpeech(params).promise();
        if (data.AudioStream instanceof Buffer) {
            const fileName = Date.now();
            const filePath = `${folderPath}/${fileName}.wav`;
            await fs.writeFile(filePath, data.AudioStream, (err) => err && console.error(err));

            return {success: true, file_path: filePath, message: 'Text to voice success!'};
        } else {
            return {success: false, message: 'Text to voice failed!'};
        }
    },
    // filter answer from Google Bard
    filterAnswer: async (originalText) => {
        let text = originalText;

        if (text.includes('Google Bard')) {text = text.replace('Google Bard', 'SQCA bot');}
        if (text.includes('Bard of Google')) {text = text.replace('Bard of Google', 'SQCA bot');}
        if (text.includes('Bard')) {text = text.replace('Bard', 'SQCA bot');}
        if (text.includes('https://bard.google.com')) {text = text.replace('https://bard.google.com', 'boolfalse.com');}

        return text;
    },
};