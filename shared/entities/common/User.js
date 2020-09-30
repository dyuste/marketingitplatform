import moment from 'moment';

export default class User {
	constructor(id, email, contactEmail, name, surname, passwordMd5, freeMonthEndDate, role) {
		this.id = id;
		this.email = email;
		this.contactEmail = contactEmail;
		this.name = name;
		this.surname = surname;
		this.passwordMd5 = passwordMd5;
		this.freeMonthEndDate = freeMonthEndDate;
		this.admin = role == 'admin';
	}

	export() {
		return {
			id: this.id,
			email: this.email,
			contactEmail: this.contactEmail,
			name: this.name,
			surname: this.surname,
			freeMonthEndDate: this.freeMonthEndDate ? this.freeMonthEndDate.valueOf() : null
		};
	}

	static import(data) {
		return new User(
			data.id,
			data.email,
			data.contactEmail,
			data.name,
			data.surname,
			data.freeMonthEndDate ? moment(freeMonthEndDate) : null
		);
	}
};
