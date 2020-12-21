const getNormal = function() {

    return (function() {
  
        let media_antes, variancia_antes;
        let x2, multiplicador, iniciar;
  
        return function normal(media, variancia) {
  
            let x1, u1, u2, v1, v2, s;
  
            if (media !== media_antes || variancia !== variancia_antes) {
                iniciar = false;
                media_antes = media;
                variancia_antes = variancia;
            }
  
            if (iniciar) {
                iniciar = false;
                return (variancia * x2) + media;
            }
  
            u1 = Math.random();
            u2 = Math.random();
  
            v1 = (2 * u1) - 1;
            v2 = (2 * u2) - 1;
  
            s = (v1 * v1) + (v2 * v2);
  
            if (s >= 1) {
                return normal(media, variancia);
            }
  
            multiplicador = Math.sqrt(-2 * Math.log(s) / s);
  
            x1 = v1 * multiplicador;
            x2 = v2 * multiplicador;
  
            iniciar = true;
  
            return Math.abs((variancia * x1) + media);
  
        };
    })();
};
  
export const exponencialRAND = function(media) {

    if (media <= 0)
        throw new TypeError('O valor deve ser maior que zero.');

    return - Math.log(1 - Math.random()) / media;
};

export const normalRAND = getNormal();