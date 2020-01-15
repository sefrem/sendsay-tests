describe("Newsletter issue testing", () => {
	const username = "fireweb2112@gmail.com";
	const password = "thi7Musam";

	context("Creating and filling all the fields of the newsletter", () => {
		it("logs in and redirects to the newsletter tab", () => {
			//Логинимся
			cy.login(username, password).then(resp => {
				cy.setCookie("sendsay_session", resp.body.session);
			});
			cy.visit("https://app.sendsay.ru/dashboard");

			//Ищем ссылку на рассылки, кликаем по ней и проверяем, что переадресация была верна
			cy.get('a[href="/campaigns"]').click();
			cy.url().should("contain", "/issues");
		});

		it("creates a new email newsletter", () => {
			//При клике на "Создать рассылку" должно всплыть и быть видимым окно с опциямми, которое содержит
			// пункт "Email", при клике на который происходит переадресация на страницу создания новой Email-рассылки
			cy.waitUntil(() =>
				cy.get('button[class="action-button__main"]').then(item => item.click())
			);
			cy.get(".dialog__content").should("be.visible");
			cy.get(".ChannelMenuItem-wrapper")
				.contains("Email")
				.click();
			cy.url().should("contain", "/draft");
		});

		it("selects the recipients of the newsletter", () => {
			//При клике на меню выбора аудитории должны открыться опции выбора, в которых можно выбрать получателей
			cy.getWizardStep(0)
				.find(".Button")
				.click();
			cy.get(".WizardStep-content").should("be.visible");
			//При попытке сохранения без заполнения обязательных полей должна появиться ошибка
			cy.get(".WizardStepSubmitAndCloseButtons-submitButton").click();
			cy.get(".field-layout__error").should("be.visible");
			//При клике на меню-dropdown должен появиться пункт "Доступные для рассылки"
			cy.get("form")
				.find(".Button-icon")
				.click();
			cy.get(".Menu")
				.find(".MenuItem")
				.eq(0)
				.click();
			cy.wait(2000);
			cy.get(".WizardStepSubmitAndCloseButtons-submitButton").click();
			cy.wait(2000);
			//Svg-элемент меню должен закраситься
			cy.getWizardStep(0)
				.find('circle[fill="#6FCF97"]')
				.should("be.visible");
		});

		it("selects the sender of the newsletter", () => {
			//При клике на меню выбора отправителя должна появиться форма ввода данных отправителя.
			cy.getWizardStep(1)
				.find(".Button")
				.click();
			cy.get(".WizardStep-content").should("be.visible");
			//При попытке сохранения без заполнения обязательных полей должна появиться ошибка
			cy.get(".WizardStepSubmitAndCloseButtons-submitButton").click();
			cy.get(".field-layout__error").should("be.visible");
			// Отображаемые в поле "имя" данные должны соответствовать введенным.
			cy.get("form textarea:first")
				.type("test_name")
				.should("have.value", "test_name");
			cy.get(".SelectButton > .Button").click();
			//При клике по опции выбора email отправителя должен открыться dropdown, где можно выбрать свой email.
			cy.get(".Dropdown-content")
				.find(`button[title="${username}"]`)
				.click();
			// Отображаемые в поле "тема" данные должны соответствовать введенным.
			cy.get("textarea[name=subject]")
				.type("test_subject")
				.should("have.value", "test_subject");
			cy.get(".WizardStepSubmitAndCloseButtons-submitButton").click();
			//Svg-элемент меню должен закраситься
			cy.getWizardStep(1)
				.find('circle[fill="#6FCF97"]')
				.should("be.visible");
		});

		it("selects the template of the newsletter", () => {
			//При клике на меню создания письма должна произойти переадресация в галерею шаблонов (url='../gallery')
			cy.getWizardStep(2)
				.find(".Button")
				.first()
				.click();
			cy.url().should("contain", "/gallery");
			//При клике по любому шаблону должна появиться кнопка "Сохранить и закрыть", клик на которую вернет нас в меню создания рассылки.
			cy.get(".GalleryCard:first").click();
			cy.get(".js-save-and-exit").click();
			//Svg-элемент меню должен закраситься
			cy.getWizardStep(2)
				.find('circle[fill="#6FCF97"]')
				.should("be.visible");
		});

		it("sends out the newletter", () => {
			//После заполнения предыдущих полей должна стать активной форма отправки, ф svg элемент меню - закраситься
			cy.get(".Wizard-step:last")
				.find('circle[fill="#6FCF97"]')
				.should("be.visible");
			cy.get(".Wizard-step:last")
				.find(".Button--primary")
				.first()
				.click();
			//После нажатия кнопки отправки должно всплыть окно с подтверждением отправки
			cy.get(".dialog__action-button").click();
			//После подтвердждения отправки должно появиться уведомление о том, что выпуск поставлен в очередь отправки
			cy.get(".notification_opened").should("be.visible");
		});
	});
});
