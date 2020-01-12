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
            cy.get('.action-button__main').click()
            cy.get('.dialog__content').should('be.visible')
            cy.contains('Email').click()
            cy.url().should('contain', '/draft')
        })

        it("selects the recipients of the issue", () => {
            //При клике на меню выбора аудитории должны открыться опции выбора, в которых можно выбрать получателей
            cy.contains('Аудитория').click()
            cy.contains('Получатели рассылки').should('be.visible')
            cy.contains('Сохранить').click()
            cy.get('.field-layout__error')
              .should('be.visible')
              .and('contain', 'Необходимо заполнить поле')
            cy.get('form').within(() => {
                cy.get('.Button-icon').click()
            })
            cy.get('button[title="Доступные для рассылки email"]').click()
            cy.contains('Сохранить').click()
        })

    })
})

