import CoreService from 'shared/services/server/CoreService';
import DataBase from 'DataBase.json';

let mysql = require('mysql');

let dataBaseAdapterInstance = null;

class DataBaseAdapter {
	constructor() {
		if (!dataBaseAdapterInstance) {
			dataBaseAdapterInstance = this;
			this._connect();
		}
		return dataBaseAdapterInstance;
	}
	_connect() {
		this._handleDisconnect();
	}

	_handleDisconnect() {
		this.connection = mysql.createConnection({
			host     : 'localhost',
			user     : DataBase.database.user,
			password : DataBase.database.password,
			database : DataBase.database.name
		});

		this.connection.connect((err) => {
			if (err) {
				CoreService.rptIgnError('[DataBaseAdapter] Error when connecting to db', err);
				setTimeout(() => { this._handleDisconnect() }, 2000);
			}
		});

		this.connection.on('error', (err) => {
			CoreService.rptIgnError('[DataBaseAdapter] Db connection error', err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
				this._handleDisconnect();
			} else {
				throw err;
			}
		});
	}

	_close() {
		this.connection.end();
	}

	query(sql, params = [], req) {
		if (sql.search(/insert/i) >= 0 || sql.search(/update/i) >= 0 || sql.search(/delete/i) || sql.search(/alter/i) >= 0)
			CoreService.dbgInspect("[DB] DataBaseAdapter::query " + sql, params);
		return new Promise( (resolve, reject) => {
			this.connection.query(sql, params, (err, rows, fields) => {
				if (err) {
					CoreService.rptError("[DB] ! DataBaseAdapter::query FAILED: " + err.message + "\n	SQL:" + sql, null, req);
					reject(err);
				} else
					resolve(rows);
			});	
		});
	}
	
	async fetchColumns(sql, params = [], req) {
		let data = [];
		let rows;
		try {
			rows = await this.query(sql, params, req);
			rows.map(row => {
				let dataRow = [];
				for (var col in row) {
					dataRow.push(row[col]);
				}
				data.push(dataRow);
			});
		} catch(e) {
		}

		return data;
	}

	async insertValues(table, valueMap) {
		let fields = Object.keys(valueMap).join(',');
		let values = Object.values(valueMap);
		let valuesHooksStr = new Array(values.length).fill('?').join(',');
		let sql = "INSERT INTO "+table+" ("+fields+") VALUES ("+valuesHooksStr+")";
		let rows = await this.query(sql, values);
		return rows;
	}
}

export default DataBaseAdapter;

