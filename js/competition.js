const main = document.querySelector("main");

let task = {
        id: 0,
        name: "тип",
        description: "задача",
        lesson: "предмет",
        difficultyId: 0,
        answer: 0,
    }

const fetchDataTask = async (subject) => {
    try {
        const result = await
            fetch(`https://localhost:7238/task?subject=${subject}`);
        return await result.json();
    } catch (error) {
        console.error("error");
    }
}

async function getTask(subject) {
    const response =
        // {
        //     id: 2,
        //     name: "площадь фигуры",
        //     description: "найти площадь треугольника со сторонами 3,4,5",
        //     lesson: "математика",
        //     difficultyId: 1
        // }
    await fetchDataTask(subject);
    if (!response) {
        return null;
    }

    task.id = response.id;
    task.name = response.name;
    task.difficultyId = response.difficultyId;
    task.description = response.description;
    task.subject = response.subject;
    task.answer = 0;
    console.log(task)
    return response
}

const maths = document.getElementById("maths");
const informatics = document.getElementById("informatics");
const answerBtn = document.getElementById("get-answer");
const answerInput = document.getElementById("input-answer");

answerBtn.addEventListener('click', async () => {
    task.answer = answerInput.value;
    console.log(task.answer, "task.answer")
    console.log(answerInput.value, "answerInput.value")
    sendRequest("PUT", `https://localhost:7238/task/check`, task)
        .then(data => console.log(data))
        .catch(err => console.error(err))
});

maths.addEventListener('click', async () => {
    const response = await getTask("математика")
    if (!response) {
        return null;
    }
    renderTask(response)
});

informatics.addEventListener('click', async () => {
    const response = await getTask("информатика")
    if (!response) {
        return null;
    }
    renderTask(response)
});


const renderTask = (task) => {
    main.innerHTML = "";
    main.innerHTML = `<div class="container">
                        <section class="competition">
                            <p class="title">Вы участвуете в соревновании по ${task.subject}</p>
                            <p class="text">${task.description}</p>
                                <input type="text" placeholder="Ответ:" class="input-answer" id="input-answer">
                                <div class="btn-competition">
                                      <button class="registration" id="get-answer">
                                            Отправить
                                      </button>
                                 </div>
<!--                                  <label for="name">Введите ответ:</label>-->
<!--                                  <input-->
<!--                                          type = "text"-->
<!--                                          id = "name"-->
<!--                                          name = "answer"-->
<!--                                          required-->
<!--                                          minlength = "4"-->
<!--                                          maxlength = "8"-->
<!--                                          size = "10"-->
<!--                                  >-->
<!--                                <li class="answer">-->
<!--                                    <button id="maths-1" onclick="addAnswer_1()" title="1">Вариант 1</button>-->
<!--                                </li>-->
<!--                                <li class="answer">-->
<!--                                    <button id="maths-2" onclick="addAnswer_2()" title="2">Вариант 2</button>-->
<!--                                </li>-->
<!--                                <li class="answer">-->
<!--                                    <button id="maths-3" onclick="addAnswer_3()" title="3">Вариант 3</button>-->
<!--                                </li>-->
<!--                                <li class="answer">-->
<!--                                    <button id="maths-4" onclick="addAnswer_4()" title="4">Вариант 4</button>-->
<!--                                </li>-->
                        </section>
                       </div>`
}


function sendRequest(method, url, body=null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token'),
    }

    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers,
    }).then(response => {
        if (response.ok) {
            return response.json()
        }

        return response.json().then(error => {
            const e = new Error("Что-то пошло не так")
            e.data = error
            throw e
        })
    })
}

