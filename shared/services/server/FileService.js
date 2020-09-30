import fs from 'fs';
import path from 'path';

export default class FileService {
	
	static ensurePath(targetDir, {isRelativeToScript = false} = {}) {
		const sep = path.sep;
		const initDir = path.isAbsolute(targetDir) ? sep : '';
		const baseDir = isRelativeToScript ? __dirname : '.';

		targetDir.split(sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(baseDir, parentDir, childDir);
			try {
				fs.mkdirSync(curDir);
			} catch (err) {
				if (err.code !== 'EEXIST') {
					throw err;
				}
			}

			return curDir;
		}, initDir);
	}

	static move(oldPath, newPath) {
		let promise = new Promise((resolve, reject) => {
			fs.rename(oldPath, newPath, function (err) {
				if (err) {
					if (err.code === 'EXDEV') {
						FileService.copy(oldPath, newPath).then(
							() => {resolve();},
							(err) => {reject(err);}
						);
					} else {
						reject(err);
					}
				} else { resolve(); }
			});	
		});
		
		return promise;
	}

	static renameByCopy(oldPath, newPath) {
		let promise = new Promise((resolve, reject) => {
			var readStream = fs.createReadStream(oldPath);
			var writeStream = fs.createWriteStream(newPath);

			readStream.on('error', (err) => { reject(err); });
			writeStream.on('error',  (err) => { reject(err); });
			readStream.on('close', function () {
				fs.unlink(oldPath, resolve());
			});
			readStream.pipe(writeStream);
		});
		
		return promise;
	}

	static remove(file, newPath) {
		let promise = new Promise((resolve, reject) => {
			fs.unlink(oldPath, resolve());
		});
		
		return promise;
	}
};

module.exports = FileService;
