describe("Issues testing", () => {

    const username = 'fireweb2112@gmail.com';
    const password = 'thi7Musam';

    context("Creating and filling all the fields of the issue", () => {

        it("logs in and redirects to the issues tab", () => {
            //Логинимся
            cy.request('POST', `https://api.sendsay.ru/general/api/v100/json/${username}/`, {
                "action" : "login",
                "login"  : username,
                "passwd" : password
               }).then((resp) => {
                cy.setCookie('sendsay_session', resp.body.session)
              })
              cy.visit('https://app.sendsay.ru/dashboard')

            //Ищем элемент "Рассылки", кликаем по ней и проверяем, что переадресация была верна
            cy.contains('Рассылки').click()
            cy.url().should('contain', '/issues')
        })
   
        it("creates a new email issue", () => {
            //При клике на "Создать рассылку" должно всплыть и быть видимым окно с опциямми, которое содержит
            // пункт "Email", при клике на который происходит переадресация на страницу создания новой Email-рассылки
            cy.get('button[class="action-button__main"]').click({force: true})
            cy.get('.dialog__content').should('be.visible')
            cy.contains('Email').click({force: true})
            cy.url().should('contain', '/draft')
        })

        it("selects the recipients of the issue", () => {
            //При клике на меню выбора аудитории должны открыться опции выбора, в которых можно выбрать получателей
            cy.contains('Аудитория').click()
            cy.contains('Получатели рассылки').should('be.visible')
            //При попытке сохранения без заполнения обязательных полей должна появиться ошибка
            cy.contains('Сохранить').click()
            cy.get('.field-layout__error')
              .should('be.visible')
              .and('contain', 'Необходимо заполнить поле')
            //При клике на меню-dropdown должен появиться пункт "Доступные для рассылки"
            cy.get('form').within(() => {
                cy.get('.Button-icon').click()
            })
            cy.get('button[title="Доступные для рассылки email"]').click()
            cy.wait(2000)
            cy.contains('Сохранить').click()
            cy.wait(2000)
        })

        it("selects the sender of the issue", () => {
            //При клике на меню выбора отправителя должна появиться форма ввода данных отправителя.
            cy.contains('Отправитель').click()
            cy.contains('Имя отправителя').should('be.visible')
            //При попытке сохранения без заполнения обязательных полей должна появиться ошибка
            cy.contains('Сохранить').click()
            cy.get('.field-layout__error')
              .should('be.visible')
              .and('contain', 'Необходимо заполнить поле')
            // Отображаемые в поле "имя" данные должны соответствовать введенным.
            cy.get('form textarea:first').type('test_name').should('have.value', 'test_name')
            cy.contains('Выберите email').click()
            //При клике по опции выбора email отправителя должен открыться dropdown, где можно выбрать свой email.
            cy.get('.Dropdown-content').contains(username).click()
            // Отображаемые в поле "тема" данные должны соответствовать введенным.
            cy.get('textarea[name=subject]').type('test_subject').should('have.value', 'test_subject')
            cy.contains('Сохранить').click()
        })

        it("selects the template of the issue", () => {
            //При клике на меню создания письма должна произойти переадресация в галерею шаблонов (url='../gallery')
            cy.contains('Создать письмо').click()
            cy.url().should('contain', '/gallery')
            //При клике по любому шаблону должна появиться кнопка "Сохранить и закрыть", клик на которую вернет нас в меню создания рассылки.
            cy.get('.GalleryCard:first').click()
            cy.contains('Сохранить и закрыть').click()
        })

        it("sends out the issue", () => {
            //После заполнения предыдущих полей должна стать активной форма отправки
            cy.get('.Wizard .Wizard-step:last').within(() => {
                cy.get('button').within(() => {
                    cy.contains('Отправить').click()
                })
            })
            //После нажатия кнопки отправки должно всплыть окно с подтверждением отправки
            cy.get('.dialog__action-button').click()
            //После подтвердждения отправки должно появиться уведомление о том, что выпуск поставлен в очередь отправки
            cy.contains('Выпуск поставлен в очередь отправки').should('be.visible')
        })

    })
})

