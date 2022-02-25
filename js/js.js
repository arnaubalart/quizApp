function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function objetoAjax() {
    var xmlhttp = false;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}



/* Función implementada con AJAX (se llama al recargar la página y al darle a: Volver a jugar!) */
function openTrivia() {
    document.getElementById("modal").classList.add("hidden")

    numQuestion = 0;
    correctAnswers = 0;
    results = {}; // Parte del JSON devuelto que contiene las preguntas...

    /* Inicializar un objeto AJAX */
    var ajax = objetoAjax();

    ajax.open("GET", "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);
            /* Leerá la respuesta que es devuelta por el controlador: */
            results = respuesta.results;
            console.log(results);
            question();
        }
    }
    ajax.send();
}

function question() {
    var contenedor = document.getElementById('content-quiz');
    var recarga = "";
    if (numQuestion != 9) {
        var arrayRespuestas = [];
        arrayRespuestas[0] = results[numQuestion].correct_answer;
        for (let index = 0; index < results[numQuestion].incorrect_answers.length; index++) {
            arrayRespuestas[index + 1] = results[numQuestion].incorrect_answers[index];
        }
        var arrayRandom = arrayRespuestas.sort(() => Math.random() - 0.5);
        console.log(arrayRandom);

        recarga = recarga + `<div class="col-sm-12">
        <p> Pregunta ${numQuestion+1}/10. Aciertos: ${correctAnswers}</p>
        </div>
                            <div class="col-sm-12">
                            <p> ${results[numQuestion].question}</p>
                            </div>`
        for (let index = 0; index < arrayRandom.length; index++) {
            recarga = recarga +
                `
                            <div class="col-sm-12 mt-2">
                                <button type="button" class="btn btn-primary btn-lg btn-block respuesta" onclick="check(this)">${arrayRandom[index]}</button>
                            </div>
                            `;

        }
    } else {
        document.getElementById("aciertos").innerHTML = `Has acertado ${correctAnswers} preguntas!`
        document.getElementById("modal").classList.remove("hidden")
    }


    contenedor.innerHTML = recarga;
}

function nextQuestion() {
    numQuestion += 1;
    question();
}


function check(boton) {
    if (results[numQuestion].correct_answer == boton.innerHTML) {
        correctAnswers += 1
        var respuestas = document.getElementsByClassName("respuesta");
        //console.log(respuestas);
        for (i in respuestas) {
            respuestas[i].disabled = true;
        }
        boton.style.backgroundColor = "green";
        numQuestion += 1;
        delay(1000).then(() => question());
    } else {
        console.log(boton);
        var respuestas = document.getElementsByClassName("respuesta");
        //console.log(respuestas);
        for (i in respuestas) {
            respuestas[i].disabled = true;
            if (respuestas[i].innerHTML == results[numQuestion].correct_answer) {
                respuestas[i].style.backgroundColor = "green";
            }
        }
        boton.style.backgroundColor = "red";
        numQuestion += 1;
        delay(1000).then(() => question());
    }
}

window.onload = function() {
    openTrivia();
}