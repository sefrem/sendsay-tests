describe("Corporate login test", () => {
	const username = "fireweb2112@gmail.com";
	const password = "thi7Musam";
	let login;

	context("Login form submission", () => {
		beforeEach(() => {
			cy.visit("https://app.sendsay.ru/signin/corporate");
		});

		it("Receives a login", () => {
			//Получаем login, который будем использовать для корпоративного входа
			cy.login(username, password).then(resp => {
				login = resp.body.login;
			});
		});

		it("displays errors if submitting with empty fields", () => {
			// Появляются ли видимые поля с ошибками, если инпуты остаются пустыми
			cy.get('button[type="submit"]').click();
			cy.get(".field-layout__error").should("be.visible");
		});

		it("displays error if login data is incorrect", () => {
			// Появляются ли видимые поля с ошибками, если логин или пароль неправильны
			// Также смотрим, соответствуют ли отображаемые в полях данные введенным
			cy.get('input[name="login"]')
				.type("incorrect")
				.should("have.value", "incorrect");
			cy.get('input[name="sublogin"]')
				.type("incorrect")
				.should("have.value", "incorrect");
			cy.get('input[name="password"]')
				.type("incorrect")
				.should("have.value", "incorrect");
			cy.get('button[type="submit"]').click();
			cy.get(".Flash--error").should("be.visible");
		});

		it("redirects to /dashboard upon successful login", () => {
			// Происходит ли редирект при логировании с верными данными,
			// появляется ли в шапке наш логин и создаются ли кукис с сессией
			cy.get('input[name="login"]').type(login);
			cy.get('input[name="sublogin"]').type(login);
			cy.get('input[name="password"]').type(password);
			cy.get('button[type="submit"]').click();

			cy.url().should("include", "/dashboard");
			cy.get(".root-header").should("contain", username);
			cy.getCookie("sendsay_session").should("exist");
		});
	});
});
