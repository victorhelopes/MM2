const reducer = (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue);

export const tmFila = function (tf) {
    const soma = (tf.reduce(reducer))
    console.log("tempo fila: ",  typeof soma,  soma  / tf.length);
    return (soma / tf.length).toFixed(4);
}

export const probEsperar = function (tf) {
    let cliQueEsperam = 0;

    for(let i = 0; i < tf.length; i++){
        if(parseFloat(tf[i]) > 0) {
            cliQueEsperam++;
        }
    }
    return (cliQueEsperam / tf.length).toFixed(4);
}

export const probOperadorLivre = function (tl, ttotal) {
    return ((tl.reduce(reducer)) / ttotal).toFixed(4);
}

export const tmSvc = function (ts) {
    return ((ts.reduce(reducer)) / ts.length).toFixed(4);
}

export const tmSistema = function (tcs) {
    return ((tcs.reduce(reducer)) / tcs.length).toFixed(4);
}

export const probUmOperadorLivre = function (tl1, tl2, ttotal) {
    return ( (parseFloat(probOperadorLivre(tl1, ttotal)) *1-(parseFloat(probOperadorLivre(tl2, ttotal))) ) + (parseFloat(probOperadorLivre(tl2, ttotal)) *1-(parseFloat(probOperadorLivre(tl1, ttotal))) ) + (parseFloat(probOperadorLivre(tl1, ttotal)) * (parseFloat(probOperadorLivre(tl2, ttotal))) )  ).toFixed(4);
}