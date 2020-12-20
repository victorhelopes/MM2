import React, { useState } from 'react';
import styles from './MainPage.module.css';
import { DataGrid } from '@material-ui/data-grid';
import Chart from 'react-apexcharts';
import { barOptions } from './chart-options';
import { exponencialRAND, normalRAND } from '../../services/randomVar';
import { tmFila, probEsperar, probOperadorLivre, tmSvc, tmSistema, probUmOperadorLivre } from '../../services/statistics';

export default function MainPage() {
    const [tempoSim, setTempo] = useState(0);

    const [tipoTec, setTipoTEC] = useState('');
    const [tec, setTEC] = useState(0);
    const [mediaTEC, setMediaTEC] = useState(0);
    const [varianciaTEC, setVarianciaTEC] = useState(0);

    const [tipoTs, setTipoTS] = useState('');
    const [ts, setTS] = useState(0);
    const [mediaTS, setMediaTS] = useState(0);
    const [varianciaTS, setVarianciaTS] = useState(0);

    const [temposNafila, setTemposNaFila] = useState([]);
    const [temposDeServico, setTemposDeServico] = useState([]);
    const [tempoDeOperadores1Livre, setOperadores1Livre] = useState([]);
    const [tempoDeOperadores2Livre, setOperadores2Livre] = useState([]);
    const [tempoNoSistema, setTempoNoSistema] = useState([]);
    const [numeroExperimentos, setNumeroExperimentos] = useState(0);

    const [tmDeFila, setTmDeFila] = useState(0);
    const [probDeEsperar, setProbDeEsperar] = useState(0);
    const [probDeOperadorLivre1, setProbDeOperadorLivre1] = useState(0);
    const [probDeOperadorLivre2, setProbDeOperadorLivre2] = useState(0);
    const [probAlgumOperadorLivre, setProbAlgumOperadorLivre] = useState(0);
    const [tmDeServico, setTmDeServico] = useState(0);
    const [tmNoSistema, setTmNoSistema] = useState(0);

    const [tamanhoFila, setTamanhoFila] = useState(0);
    const [tipoFila, setTipoFila] = useState('');

    const [dados, setDados] = useState([]);

    function delay(ms) {
        var cur_d = new Date();
        var cur_ticks = cur_d.getTime();
        var ms_passed = 0;
        while(ms_passed < ms) {
            var d = new Date();  // Possible memory leak?
            var ticks = d.getTime();
            ms_passed = ticks - cur_ticks;
            // d = null;  // Prevent memory leak?
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let tabela = []
        let tc = 0.0, tf = 0.0, tis = 0.0, tfs = 0.0, tfs1 = 0.0, tfs2 = 0.0, tcs = 0.0, tl1 = 0.0, tl2 = 0.0
        let tc_antes = 0.0, tfs1_antes = 0.0, tfs2_antes = 0.0
        let experimento = 1
        let temposimulacao = parseFloat(tempoSim)
        let tecint = parseFloat(tec)
        let tsint = parseFloat(ts)
        let tmfila = []
        
        let tmservico = []
        let tempoOperadorLivre1 = []
        let tempoOperadorLivre2 = []
        let tmsistema = []
        let i = 0.0
        let filalivre = parseFloat(tamanhoFila)

        while( parseFloat(tfs) <= parseFloat(temposimulacao) ){
            // if(tipoFila === 'limitada'){
            //     if(filalivre === 0){
            //         //tfs1_antes = tfs1_antes +  
            //         continue;
            //     }
            // }

            if ( tipoTec === "exponencial" ) {
                tecint = parseFloat(exponencialRAND(1 / mediaTEC))
            } else if ( tipoTec === "normal" ) {
                tecint = parseFloat(normalRAND(mediaTEC, varianciaTEC))
            }
            if ( tipoTs === "exponencial" ) {
                tsint = parseFloat(exponencialRAND(1 / mediaTS))
            } else if ( tipoTs === "normal" ) {
                tsint = parseFloat(normalRAND(mediaTS, varianciaTS))
            }

            if ( parseInt(experimento) === 1 ) {            //primeira iteracao
                                                            //operador 1 atende  
                tc = parseFloat(tecint)                     
                tf = 0.0
                tis = parseFloat(tecint)
                tfs1 = parseFloat(tecint)+parseFloat(tsint)
                tfs = tfs1
                tcs = parseFloat(tfs1)-parseFloat(tis)
                tl1 = parseFloat(tecint)
                tl2 = parseFloat(tecint)
                i += parseFloat(tfs1)
                tfs1_antes = parseFloat(tfs1)

            } else if (parseInt(experimento) === 2) {       //operador 2 atende

                tc = parseFloat(tecint) + parseFloat(tc_antes)
                tf = 0.0
                tis = parseFloat(tecint)
                tfs2 = parseFloat(tc)+parseFloat(tsint)
                tfs = tfs2
                tcs = parseFloat(tfs2)-parseFloat(tis)
                tl1 = parseFloat(tc) - parseFloat(tfs1_antes)
                tl2 = parseFloat(tc)
                tfs2_antes = parseFloat(tfs2)
            }
            
            else {                                        //todas as outras iteracoes

                tc = parseFloat(tc_antes)+parseFloat(tecint)

                if ( parseFloat(tfs1_antes) <= parseFloat(tc) ) {          // operador 1 vai atender

                    tf = 0.0
                    tis = parseFloat(tc)
                    tfs1 = parseFloat(tis)+parseFloat(tsint)
                    tfs = parseFloat(tfs1)
                    tcs = parseFloat(tfs1)-parseFloat(tis)
                    tl1 = parseFloat(tc)-parseFloat(tfs1_antes)
                    tl2 = parseFloat(tc)-parseFloat(tfs2_antes)
                    tfs1_antes = parseFloat(tfs1)
                    
                } else {                                                // operador 2 vai atender
                    if ( parseFloat(tfs2_antes) <= parseFloat(tc) ) {
                    
                        tf = 0.0
                        tis = parseFloat(tc)
                        tfs2 = parseFloat(tis)+parseFloat(tsint)
                        tfs = parseFloat(tfs2)
                        tcs = parseFloat(tfs2)-parseFloat(tis)

                        tl1 = parseFloat(tc)-parseFloat(tfs1_antes)
                        tl2 = parseFloat(tc)-parseFloat(tfs2_antes)
                        tfs2_antes = parseFloat(tfs2)


                    } else {                                            // cliente vai pra fila, nenhum operador livre

                        if( parseFloat(tfs1_antes) <= parseFloat(tfs2_antes)){      //dps da fila é atendido pelo operador 1

                            tf = parseFloat(tfs1_antes)-parseFloat(tc)
                            tis = parseFloat(tc)+parseFloat(tf)
                            tfs1 = parseFloat(tis)+parseFloat(tsint)+tf
                            tfs = tfs1
                            tcs = parseFloat(tfs1)-parseFloat(tis)+parseFloat(tf)
                            tl1 = 0.0
                            tl2 = parseFloat(tc)-parseFloat(tfs2_antes)
                            tfs1_antes = parseFloat(tfs1)
                            
                        } else{                                                    //dps da fila é atendido pelo operador 2 

                            tf = parseFloat(tfs2_antes)-parseFloat(tc)
                            tis = parseFloat(tc)+parseFloat(tf)
                            tfs2 = parseFloat(tis)+parseFloat(tsint)+tf
                            tfs = tfs2
                            tcs = parseFloat(tfs2)-parseFloat(tis)+parseFloat(tf)
                            tl1 = parseFloat(tc)-parseFloat(tfs1_antes)
                            tl2 = 0.0
                            tfs2_antes = parseFloat(tfs2)

                        }
                    }
                }
            }

            tc_antes = parseFloat(tc)
            tmfila.push(parseFloat(tf).toFixed(2))
            tmservico.push(parseFloat(tsint).toFixed(2))
            if(tl1 >= 0){
                tempoOperadorLivre1.push(parseFloat(tl1).toFixed(2))
            }
            if(tl2 >= 0){
                tempoOperadorLivre2.push(parseFloat(tl2).toFixed(2))
            }
            
            tmsistema.push(parseFloat(tcs).toFixed(2))

            tecint = parseFloat(tecint).toFixed(2)
            tc = parseFloat(tc).toFixed(2)
            tf = parseFloat(tf).toFixed(2)
            tsint = parseFloat(tsint).toFixed(2)
            tis = parseFloat(tis).toFixed(2)
            tfs = parseFloat(tfs).toFixed(2)
            tcs = parseFloat(tcs).toFixed(2)
            tl1 = parseFloat(tl1).toFixed(2)
            tl2 = parseFloat(tl2).toFixed(2)

            console.log(typeof tecint, typeof tc, typeof tf, typeof tis, typeof tfs, typeof tcs, typeof tl1, typeof tl2)
            console.log(i, experimento,  tecint,  tc,  tf,  tsint, tis,  tfs,  tcs,  tl1,  tl2)

            tabela.push({id: experimento, tecint, tc, tf, tsint, tis, tfs, tcs, tl1, tl2})

            experimento = parseInt(experimento) + 1

            //delay(5000)

            setDados(tabela)
            setTemposNaFila(tmfila)
            setOperadores1Livre(tempoOperadorLivre1)
            setOperadores2Livre(tempoOperadorLivre2)
            setTempoNoSistema(tmsistema)
            setTemposDeServico(tmservico)
            setNumeroExperimentos(parseInt(experimento))

            setTmDeFila(tmFila(tmfila));
            setProbDeEsperar(probEsperar(tmfila));
            setProbDeOperadorLivre1(probOperadorLivre(tempoOperadorLivre1, tfs));
            setProbDeOperadorLivre2(probOperadorLivre(tempoOperadorLivre2, tfs));
            setProbAlgumOperadorLivre(probUmOperadorLivre(tempoOperadorLivre1, tempoOperadorLivre2, tfs));
            setTmDeServico(tmSvc(tmservico));
            setTmNoSistema(tmSistema(tmsistema));
            
        }

        
    }

    function handleChangeTipoTEC(value) {
        setTipoTEC(value);
    }

    function handleChangeTipoTS(value) {
        setTipoTS(value);
    }

    function handleChangeTEC(value) {
        setTEC(parseFloat(value));
    }

    function handleChangeMediaTEC(value) {
        setMediaTEC(parseFloat(value));
    }

    function handleChangeVarianciaTEC(value) {
        setVarianciaTEC(parseFloat(value));
    }

    function handleChangeTS(value) {
        setTS(parseFloat(value));
    }

    function handleChangeMediaTS(value) {
        setMediaTS(parseFloat(value));
    }

    function handleChangeVarianciaTS(value) {
        setVarianciaTS(parseFloat(value));
    }
    
    function handleChangeTipoFila(value) {
        setTipoFila(value);
    }

    return (
        <div className={styles.gridContainer}>
            <div className={styles.header}>Simulador MM2</div>

            <form onSubmit={handleSubmit} className={styles.params}>
                <div className={styles.paramsheader}>
                    <label className={styles.labelSimulacao}>Tempo de Simulação</label>
                    <input 
                    placeholder="em minutos"
                    type="number"
                    min="1"
                    max="999"
                    className={styles.tempoSimulacao} 
                    id="tempoSim"
                    onChange={e => setTempo(parseFloat(e.target.value))} 
                    />

                    <label className={styles.labelSimulacao}>Tamanho máximo da fila</label>

                    <select className={styles.tempoSimulacao} onChange={e => handleChangeTipoFila(e.target.value)}>
                        <option id="tamfila1" name="tipoFila" defaultValue="">Selecione...</option>
                        <option id="tamfila2" name="tipoFila" value="ilimitada">Ilimitada</option>
                        <option id="tamfila3" name="tipoFila" value="limitada">Limitada</option>
                    </select>

                    {tipoFila === "limitada" &&
                         <div>
                            <label className={styles.labelSimulacao}>Tamanho máximo</label>
                            <input
                            className={styles.tempoSimulacao}
                            type="number"
                            min="0"
                            max="999"
                            placeholder="" 
                            onChange={e => setTamanhoFila(e.target.value)}/>
                        </div>
                    }   

                </div>

                <div className={styles.params1}>
    

                    <div>
                        <label>Tempo entre Chegadas</label>
                        <select className={styles.colInput} onChange={e => handleChangeTipoTEC(e.target.value)}>
                            <option id="tipoTec1" name="tipoTec" defaultValue="">Selecione...</option>
                            <option id="tipoTec2" name="tipoTec" value="deterministico">Determinístico</option>
                            <option id="tipoTec3" name="tipoTec" value="normal">Aleatório Normal</option>
                            <option id="tipoTec4" name="tipoTec" value="exponencial">Aleatório Exponencial</option>
                        </select>
                    </div>

                    {tipoTec === "deterministico" &&
                        <div>
                            <label>Tempo entre as chegadas</label>
                            <input 
                            className={styles.colInput}
                            type="number"
                            min="1"
                            max="999"
                            placeholder="(tempo em minutos)" 
                            onChange={e => handleChangeTEC(parseFloat(e.target.value))}
                            />
                        </div>
                    }
                    {tipoTec === "exponencial" &&
                        <div>
                            <label>Média</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            step="0.01"
                            placeholder="(em minutos)" 
                            onChange={e => handleChangeMediaTEC(e.target.value)}/>
                        </div>
                    }
                    {tipoTec === "normal" &&
                    <div>
                        <div>
                            <label>Média</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            step="0.01"
                            id="mediaexp"
                            placeholder="(em minutos)" 
                            onChange={e => handleChangeMediaTEC(e.target.value)}/>
                        </div>

                        <div>
                            <label>Variância</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            step="0.01"
                            id="stdexp"
                            placeholder="(em minutos)" 
                            onChange={e => handleChangeVarianciaTEC(e.target.value)}/>
                        </div>
                    </div>
                    }
                </div>

                <div className={styles.params2}>
                    <div>
                        <label>Tempo de Serviço</label>
                        <select className={styles.colInput} onChange={e => handleChangeTipoTS(e.target.value)}>
                            <option id="tipoTs" name="tipoTs" defaultValue="">Selecione...</option>
                            <option id="tipoTs" name="tipoTs" value="deterministico">Determinístico</option>
                            <option id="tipoTs" name="tipoTs" value="normal">Normal</option>
                            <option id="tipoTs" name="tipoTs" value="exponencial">Exponencial</option>
                        </select>
                    </div>

                    {tipoTs === "deterministico" &&
                        <div>
                            <label>Tempo de Serviço</label>
                            <input 
                            className={styles.colInput}
                            type="number"
                            min="1"
                            max="999"
                            placeholder="(tempo em minutos)" 
                            onChange={e => handleChangeTS(parseFloat(e.target.value))}/>
                        </div>
                    }
                    {tipoTs === "exponencial" &&
                        <div>
                            <label>Média</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            placeholder="(em minutos)" 
                            onChange={e => handleChangeMediaTS(e.target.value)}/>
                        </div>
                    }
                    {tipoTs === "normal" &&
                    <div>
                        <div>
                            <label>Média</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            id="mediaexp"
                            placeholder="(em minutos)" 
                            onChange={e => handleChangeMediaTS(e.target.value)}/>
                        </div>

                        <div>
                            <label>Variância</label>
                            <input
                            className={styles.colInput}
                            type="number"
                            step="0.01"
                            id="stdexp"
                            placeholder="(em minutos)"
                            onChange={e => handleChangeVarianciaTS(e.target.value)} />
                        </div>
                    </div>
                    }
                </div>

                <div className={styles.paramsSubmit}>
                    <input type="submit" value="Ir" />
                </div>
            </form>

            <div className={styles.statistics}>
                <div className={styles.charts}>
                    <div className={styles.chart1}>
                        <div className={styles.chartLabels}>
                            Tempo do Operador Livre (experimentos x minutos)
                        </div>
                        <Chart 
                            options={barOptions} 
                            type="bar"
                            width="100%"
                            height="400"
                            series={[{ data: tempoDeOperadores1Livre, name: "Operador 1"}, { data : tempoDeOperadores2Livre, color: "#1aafff", name: "Operador 2"}]}
                        />

                    </div>
                    <div className={styles.chart2}>
                        <div className={styles.chartLabels}>
                            Tempo de Serviço (experimentos x minutos)
                        </div>
                        <Chart 
                            options={barOptions} 
                            type="bar"
                            width="100%"
                            height="400"
                            series={[{ data: temposDeServico  }]}

                        />
                    </div>
                    <div className={styles.chart3}>
                        <div className={styles.chartLabels}>
                            Tempo na Fila (experimentos x minutos)
                        </div>
                        <Chart 
                            options={barOptions} 
                            type="bar"
                            width="100%"
                            height="400"
                            series={[{ data: temposNafila  }]}
                        />
                    </div>

                    <div className={styles.chart4}>
                        <div className={styles.chartLabels}>
                            Tempo do Cliente no Sistema (experimentos x minutos)
                        </div>
                        <Chart 
                            options={barOptions} 
                            type="bar"
                            width="100%"
                            height="400"
                            series={[{ data: tempoNoSistema  }]}
                        />
                    </div>
                    
                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.stats}>
                        <div>Tempo médio de espera na fila = {tmDeFila} minutos</div>
                        <div>Tempo médio de serviço = {tmDeServico} minutos</div>
                        <div>Tempo médio de cada experimento no sistema = {tmNoSistema} minutos</div>
                        <div>Probabilidade de esperar na fila = {probDeEsperar}</div>
                        <div>Probabilidade do operador 1 estar livre = {probDeOperadorLivre1}</div>
                        <div>Probabilidade do operador 2 estar livre = {probDeOperadorLivre2}</div>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.tableContainerGrid}>
                            <DataGrid 
                            rows={dados} 
                            columns={[
                                { field: 'id', headerName: 'Experimento', width: 120 },
                                { field: 'tecint', headerName: 'T entre chegadas', width: 150 },
                                { field: 'tc', headerName: 'T chegada no relogio', width: 150 },
                                { field: 'tf', headerName: 'T de fila', width: 100 },
                                { field: 'tsint', headerName: 'T de serviço', width: 110 },
                                { field: 'tis', headerName: 'Ti serviço no relogio', width: 170 },
                                { field: 'tfs', headerName: 'Tf serviço no relogio', width: 170 },
                                { field: 'tcs', headerName: 't cliente no sistema', width: 160 },
                                { field: 'tl1', headerName: 'TL operador 1', width: 150 },
                                { field: 'tl2', headerName: 'TL operador 2', width: 150 },
                            ]}
                            headerHeight={100}
                            />
                        </div>

                        <div className={styles.stats}>
                            <div><b>OBS.: Números negativos nos tempos dos operadores livres indica que o ultimo seviço do mesmo ainda está em andamento.</b></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.footer}>
                Desenvolvido por <a href="https://github.com/lorenaelias/"> Lorena </a> e Victor Hugo
            </div>
        
        </div>
    );
}