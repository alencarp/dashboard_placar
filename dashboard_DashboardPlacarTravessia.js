var urlpadrao = 'http://' + window.location.host + '/pentaho/plugin/cda/api/doQuery?path=/home/dashboard/DashboardPlacarTravessia.cda'

function getCor(numero) {
  if (numero < 90) {
    return '#ff0000'
  }

  if (numero >= 90 && numero < 100) {
    return '#FFD700'
  }
  return '#7CFC00'
}

function arredondarPorcentagem(valor, previsto) {
  return Math.round(valor / previsto * 100)
}

$('#selectMercado').on('change', function (e) {
  const anoMes = $('#selectAnoMes').val()
  let anoMesInicial = ""
  if(Number(anoMes.slice(4, 6)) === 1){
    anoMesInicial = `${anoMes.slice(0, 4)}01`
  }else if(Number(anoMes.slice(4, 6)) <= 10){
    anoMesInicial = `${anoMes.slice(0, 4)}0${Number(anoMes.slice(4, 6)) - 1}`
  }else{
    anoMesInicial = `${anoMes.slice(0, 4)}${Number(anoMes.slice(4, 6)) - 1}`
  }
  

  atualizarComponentes(anoMes, this.value, anoMesInicial)
})

$('#selectAnoMes').on('change', function (e) {
  const mercado = $('#selectMercado').val()
  const anoMes = `${this.value.substr(0, 6)}`
  let anoMesInicial = ""
  if(Number(anoMes.slice(4, 6)) === 1){
    anoMesInicial = `${anoMes.slice(0, 4)}01`
  }else if(Number(anoMes.slice(4, 6)) <= 10){
    anoMesInicial = `${anoMes.slice(0, 4)}0${Number(anoMes.slice(4, 6)) - 1}`
  }else{
    anoMesInicial = `${anoMes.slice(0, 4)}${Number(anoMes.slice(4, 6)) - 1}`
  }

  atualizarComponentes(this.value, mercado, anoMesInicial)
})

function montaSelectAnoMes(anoMes) {
  getDatas().then(value => {
    const anoMesHoje = anoMes
    const datas = value.resultset

    let selectOptions = ''
    datas.forEach(data => {
      const selected = data[0] === anoMesHoje ? 'selected' : ''
      selectOptions += `<option ${selected} value="${data[0]}" style="color: #000">${[data[0].substr(4, 2), data[0].substr(0, 4)].join('/')}</option>`
    })

    // jquery
    $('#selectAnoMes').append(selectOptions)
  })
}

function getDatas() {
  return new Promise(resolve => {
    const accessId = '&dataAccessId=data'
    const url = urlpadrao + accessId

    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

function formatDate(date, separator = '-') {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join(separator);
}

function montaSelectMercados() {
  getMercados().then(value => {
    const mercados = value.resultset

    let selectOptions = ''
    mercados.forEach((mercado, index) => {
      const selected = index === 0 ? 'selected' : ''
      selectOptions += `<option ${selected} value="${mercado[0]}" style="color: #000">${mercado[0]}</option>`
    })

    selectOptions += '<option value="Mercado%" style="color: #000">Total</option>'
    // console.log({selectOptions})
    $('#selectMercado').append(selectOptions)
    //jquery
  })
}

function getMercados() {
  return new Promise(resolve => {
    const accessId = '&dataAccessId=mercado'
    const url = urlpadrao + accessId

    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

function getVolumeMesNovo(anoMes, mercado) {
  return new Promise(resolve => {
    const anoAtual = anoMes.slice(0, 4);
    const mesAtual = anoMes.slice(4, 6);
    const paramAno = `&paramano=${anoAtual}`;
    const paramMes = `&parammes=${mesAtual}`;
    const paramMercado = `&parammercado=${mercado}`;
    const accessId = '&dataAccessId=volumeMesNovo'
    const url = urlpadrao + accessId + paramAno + paramMes + paramMercado;

    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}
function getVolumeAcumuladoNovo(anoMes, mercado, anoMesInicial) {
  return new Promise(resolve => {
    const anoInicial = anoMesInicial.slice(0, 4);
    const mesInicial = anoMesInicial.slice(4, 6);
    const anoAtual = anoMes.slice(0, 4);
    const mesAtual = anoMes.slice(4, 6);

    const paramAnoInicial = `&paramanoinicial=${anoInicial}`;
    const paramMesInicial = `&parammesinicial=${mesInicial}`;
    const paramAnoAtual = `&paramanoatual=${anoAtual}`;
    const paramMesAtual = `&parammesatual=${mesAtual}`;
    const paramMercado = `&parammercado=${mercado}`;
    const accessId = '&dataAccessId=volumeAcumuladoNovo';
    const url = urlpadrao + accessId + paramAnoInicial + paramMesInicial + paramAnoAtual + paramMesAtual + paramMercado;

    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

// volume mes
let volumeMes = ''

function factoryAgrupamento() {
    const valores = {
        real: 0,
        previsto: 0
    }

    const dados = {
        volume: {
            mes: valores,
            acumulado: valores
        },
        margem: {
            mes: {
                absoluta: valores,
                relativa: valores
            },
            acumulado: {
                absoluta: valores,
                relativa: valores
            }
        }
    }

    const agrupamento = {
        'CANDIES': {
            familias: {
                'BALA DURA': dados,
                'BALA DURA FLOW PACK': dados,
                'BALA MASTIGAVEL': dados,
                'DROPS DURO': dados,
                'DROPS MASTIGAVEL': dados
            },
            subtotal: dados
        },
        'BISCOITOS': {
            familias: {
                'BISCOITO RECHEADO': dados,
                'BISCOITO TRADICIONAL': dados,
                'PALITOS': dados,
                'PAO DE MEL': dados,
                'WAFER': dados  
            },
            subtotal: dados
        }
    }

    return agrupamento;
}

function atualizaDadosAgrupamento(tipo, familia, real, previsto) {
   
    //console.log({obj: agrupamento[tipo].familias[familia], tipo, familia: familia})
    if(agrupamento[tipo].familias[familia].volume.mes.real == 0) {
        console.log({familia, real, previsto, tipo, agrp: agrupamento[tipo].familias[familia]})
    }
    if (Object.keys(agrupamento[tipo].familias).indexOf(familia) >= 0) {
        //console.log({antes: agrupamento[tipo].familias[familia], familia: familia, tipo, valor:  real })
        agrupamento[tipo].familias[familia].volume.mes.real = real;
        //console.log({depois: agrupamento[tipo].familias[familia]})
        agrupamento[tipo].familias[familia].volume.mes.previsto = previsto;
        agrupamento[tipo].subtotal.volume.mes.real += real;
        agrupamento[tipo].subtotal.volume.mes.previsto += previsto;
    }
}

function atualizaVolumeMes(anoMes, mercado) {
  volumeMesCandies = ''
  volumeMesBiscoitos = ''

  getVolumeMesNovo(anoMes, mercado).then(value => {
    const volumes = value.resultset
    let somaReal = 0;
    let somaPrevisto = 0;
    
    let somaRealCandies = 0;
    let somaPrevistoCandies = 0;
    
    let somaRealBiscoitos = 0;
    let somaPrevistoBiscoitos = 0;
    
    volumes.forEach(resultado => {
      if (['BALA DURA', 'BALA MASTIGAVEL', 'BALA DURA FLOW PACK', 'DROPS DURO', 'DROPS MASTIGAVEL'].indexOf(resultado[0]) >= 0) {
          volumeMesCandies += rowFactory(
            resultado[0],
            resultado[6],
            resultado[5],
            Math.round(((resultado[5] * 100) / (resultado[6]))).toLocaleString('pt-BR')
          );
          
          somaPrevistoCandies += resultado[6]
          somaRealCandies += resultado[5]
      } else {
          volumeMesBiscoitos += rowFactory(
            resultado[0],
            resultado[6],
            resultado[5],
            Math.round(((resultado[5] * 100) / (resultado[6]))).toLocaleString('pt-BR')
          );
          somaPrevistoBiscoitos += resultado[6]
          somaRealBiscoitos += resultado[5]
      }
      
      somaPrevisto += resultado[6]
      somaReal += resultado[5]
    })


    $('#volume-mes').empty()
    $('#volume-mes').append(`
        <thead>
          <tr>
            <th class="mdl-data-table__cell--non-numeric volume-header-th">Linha</th>
            <th class="volume-header-th">Previsto (ton)</th>
            <th class="volume-header-th">Realizado (ton)</th>
            <th class="volume-header-th">Porcentagem (%)</th>
          </tr>
        </thead>
      `)

    $('#volume-mes').append(volumeMesCandies);
    
    $('#volume-mes').append(rowFactory(
      'CANDIES',
      somaPrevistoCandies.toLocaleString('pt-BR'),
      somaRealCandies.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaRealCandies, somaPrevistoCandies).toLocaleString('pt-BR'), true)
    );
    $('#volume-mes').append(volumeMesBiscoitos);

    $('#volume-mes').append(rowFactory(
      'BISCOITOS',
      somaPrevistoBiscoitos.toLocaleString('pt-BR'),
      somaRealBiscoitos.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaRealBiscoitos, somaPrevistoBiscoitos).toLocaleString('pt-BR'), true)
    );

    $('#volume-mes').append(rowFactory(
      'TOTAL',
      somaPrevisto.toLocaleString('pt-BR'),
      somaReal.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaReal, somaPrevisto).toLocaleString('pt-BR'), true)
    )

    $('#titulo-mes').text(`Volume - ${mapMes(anoMes.substr(4, 2))}`)
  })
}

// margem mes
let margemMesNova = ''

function atualizaMargemMes(anoMes, mercado) {
  margemMesCandiesNova = ''
  margemMesBiscoitosNova = ''

  getVolumeMesNovo(anoMes, mercado).then(value => {
    const volumes = value.resultset
    let somaMargemCandiesReal = 0
    let somaMargemCandiesPrevista = 0
    let somaFatLiqCandiesPrevisto = 0
    let somaFatLiqCandiesReal = 0
    
    let somaMargemBiscoitosReal = 0
    let somaMargemBiscoitosPrevista = 0
    let somaFatLiqBiscoitosPrevisto = 0
    let somaFatLiqBiscoitosReal = 0

    volumes.forEach(resultado => {
      const relativaPrevista = (resultado[8] / resultado[4]) * 100;
      const relativaRealizada = (resultado[7] / resultado[3]) * 100;
      
      if (['BALA DURA', 'BALA MASTIGAVEL', 'BALA DURA FLOW PACK', 'DROPS DURO', 'DROPS MASTIGAVEL'].indexOf(resultado[0]) >= 0) {
          margemMesCandiesNova += rowFactoryMargem(
            resultado[8],
            resultado[7],
            Math.round(((resultado[7] * 100) / (resultado[8]))), //.toLocaleString('pt-BR'),
            Math.round(relativaPrevista || 0), //.toLocaleString('pt-BR'),
            Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
            Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR')
          )
          somaMargemCandiesPrevista += resultado[8]
          somaMargemCandiesReal += resultado[7]
          somaFatLiqCandiesPrevisto += resultado[4]
          somaFatLiqCandiesReal += resultado[3]
      } else {
          margemMesBiscoitosNova += rowFactoryMargem(
            resultado[8],
            resultado[7],
            Math.round(((resultado[7] * 100) / (resultado[8]))), //.toLocaleString('pt-BR'),
            Math.round(relativaPrevista || 0), //.toLocaleString('pt-BR'),
            Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
            Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR')
          )
          somaMargemBiscoitosPrevista += resultado[8]
          somaMargemBiscoitosReal += resultado[7]
          somaFatLiqBiscoitosPrevisto += resultado[4]
          somaFatLiqBiscoitosReal += resultado[3]
      }
    })

    $('#margem-mes').empty()
    $('#margem-mes').append(`
        <thead>
          <tr>
            <th class="volume-header-th">Abs Pre(R$)</th>
            <th class="volume-header-th">Abs Rea(R$)</th>
            <th class="volume-header-th">Absoluta (%)</th>
            <th class="volume-header-th">Rela Prev(%)</th>
            <th class="volume-header-th">Rela Real(%)</th>
            <th class="volume-header-th">Relativa (%)</th>
          </tr>
        </thead>
      `)

    $('#margem-mes').append(margemMesCandiesNova);
    
    const relativaPrevistaCandies = somaMargemCandiesPrevista / somaFatLiqCandiesPrevisto * 100;
    const relativaRealCandies = somaMargemCandiesReal / somaFatLiqCandiesReal * 100;
    
    $('#margem-mes').append(rowFactoryMargem(
        somaMargemCandiesPrevista,
        somaMargemCandiesReal,
        arredondarPorcentagem(somaMargemCandiesReal, somaMargemCandiesPrevista),
        Math.round(relativaPrevistaCandies),
        Math.round(relativaRealCandies || 0),
        Math.round(((relativaRealCandies * 100) / (relativaPrevistaCandies)) || 0),
        true
    ));
    
    $('#margem-mes').append(margemMesBiscoitosNova);
    
    const relativaPrevistaBiscoitos = somaMargemBiscoitosPrevista / somaFatLiqBiscoitosPrevisto * 100;
    const relativaRealBiscoitos = somaMargemBiscoitosReal / somaFatLiqBiscoitosReal * 100;
    
    $('#margem-mes').append(rowFactoryMargem(
        somaMargemBiscoitosPrevista,
        somaMargemBiscoitosReal,
        arredondarPorcentagem(somaMargemBiscoitosReal, somaMargemBiscoitosPrevista),
        Math.round(relativaPrevistaBiscoitos),
        Math.round(relativaRealBiscoitos || 0),
        Math.round(((relativaRealBiscoitos * 100) / (relativaPrevistaBiscoitos)) || 0),
        true
    ));
    
    const relativaPrevista = ((somaMargemBiscoitosPrevista + somaMargemCandiesPrevista) / (somaFatLiqCandiesPrevisto + somaFatLiqBiscoitosPrevisto)) * 100;
    const relativaRealizada = ((somaMargemBiscoitosReal + somaMargemCandiesReal) / (somaFatLiqBiscoitosReal + somaFatLiqCandiesReal)) * 100;
    
    const margemPorcentagem = Math.round((somaMargemBiscoitosReal + somaMargemCandiesReal) / (somaMargemBiscoitosPrevista + somaMargemCandiesPrevista) * 100);
    const somaMargemReal = somaMargemBiscoitosReal + somaMargemCandiesReal;
    const somaMargemPrevista = somaMargemBiscoitosPrevista + somaMargemCandiesPrevista;
    
    $('#margem-mes').append(rowFactoryMargem(
        somaMargemPrevista, //.toLocaleString('pt-BR'),
        somaMargemReal, //.toLocaleString('pt-BR'),
        arredondarPorcentagem(somaMargemReal, somaMargemPrevista), //.toLocaleString('pt-BR'),
        Math.round(relativaPrevista), //.toLocaleString('pt-BR'),
        Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
        Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR'),
        true
    ));
    
    

    $('#titulo-margem-mes').text(`Margem Contrib. - ${mapMes(anoMes.substr(4, 2))}`)
    $('#card-margem-mes-real').text(somaMargemReal.toLocaleString('pt-BR'))
    $('#card-margem-mes-previsto').text(somaMargemPrevista.toLocaleString('pt-BR'))
    $('#card-margem-mes-pct').text(`${margemPorcentagem.toLocaleString('pt-BR')} %`)
      .parent().css('background-color', getCor(margemPorcentagem))
    
  })
}
// margem Acumulada
let margemAcumuladaNova = ''

function atualizaMargemAcumulado(anoAcumulado, mercado, anoMesInicial) {
  margemAcumuladoCandiesNova = ''
  margemAcumuladoBiscoitosNova = ''

  getVolumeAcumuladoNovo(anoAcumulado, mercado, anoMesInicial).then(value => {
    const volumes = value.resultset
    let somaMargemCandiesReal = 0
    let somaMargemCandiesPrevista = 0
    let somaFatLiqCandiesPrevisto = 0
    let somaFatLiqCandiesReal = 0
    
    let somaMargemBiscoitosReal = 0
    let somaMargemBiscoitosPrevista = 0
    let somaFatLiqBiscoitosPrevisto = 0
    let somaFatLiqBiscoitosReal = 0

    volumes.forEach(resultado => {
      const relativaPrevista = (resultado[8] / resultado[4]) * 100;
      const relativaRealizada = (resultado[7] / resultado[3]) * 100;
      
      if (['BALA DURA', 'BALA MASTIGAVEL', 'BALA DURA FLOW PACK', 'DROPS DURO', 'DROPS MASTIGAVEL'].indexOf(resultado[0]) >= 0) {
          margemAcumuladoCandiesNova += rowFactoryMargem(
            resultado[8],
            resultado[7],
            Math.round(((resultado[7] * 100) / (resultado[8]))), //.toLocaleString('pt-BR'),
            Math.round(relativaPrevista || 0), //.toLocaleString('pt-BR'),
            Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
            Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR')
          )
          somaMargemCandiesPrevista += resultado[8]
          somaMargemCandiesReal += resultado[7]
          somaFatLiqCandiesPrevisto += resultado[4]
          somaFatLiqCandiesReal += resultado[3]
      } else {
          margemAcumuladoBiscoitosNova += rowFactoryMargem(
            resultado[8],
            resultado[7],
            Math.round(((resultado[7] * 100) / (resultado[8]))), //.toLocaleString('pt-BR'),
            Math.round(relativaPrevista || 0), //.toLocaleString('pt-BR'),
            Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
            Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR')
          )
          somaMargemBiscoitosPrevista += resultado[8]
          somaMargemBiscoitosReal += resultado[7]
          somaFatLiqBiscoitosPrevisto += resultado[4]
          somaFatLiqBiscoitosReal += resultado[3]
      }
    })

    $('#margem-acumulado').empty()
    $('#margem-acumulado').append(`
        <thead>
          <tr>
            <th class="volume-header-th">Abs Pre(R$)</th>
            <th class="volume-header-th">Abs Rea(R$)</th>
            <th class="volume-header-th">Absoluta (%)</th>
            <th class="volume-header-th">Rela Prev(%)</th>
            <th class="volume-header-th">Rela Real(%)</th>
            <th class="volume-header-th">Relativa (%)</th>
          </tr>
        </thead>
      `)

    
    $('#margem-acumulado').append(margemAcumuladoCandiesNova);
    
    const relativaPrevistaCandies = somaMargemCandiesPrevista / somaFatLiqCandiesPrevisto * 100;
    const relativaRealCandies = somaMargemCandiesReal / somaFatLiqCandiesReal * 100;
    
    $('#margem-acumulado').append(rowFactoryMargem(
        somaMargemCandiesPrevista,
        somaMargemCandiesReal,
        arredondarPorcentagem(somaMargemCandiesReal, somaMargemCandiesPrevista),
        Math.round(relativaPrevistaCandies),
        Math.round(relativaRealCandies || 0),
        Math.round(((relativaRealCandies * 100) / (relativaPrevistaCandies)) || 0),
        true
    ));
    
    $('#margem-acumulado').append(margemAcumuladoBiscoitosNova);
    
    const relativaPrevistaBiscoitos = somaMargemBiscoitosPrevista / somaFatLiqBiscoitosPrevisto * 100;
    const relativaRealBiscoitos = somaMargemBiscoitosReal / somaFatLiqBiscoitosReal * 100;
    
    $('#margem-acumulado').append(rowFactoryMargem(
        somaMargemBiscoitosPrevista,
        somaMargemBiscoitosReal,
        arredondarPorcentagem(somaMargemBiscoitosReal, somaMargemBiscoitosPrevista),
        Math.round(relativaPrevistaBiscoitos),
        Math.round(relativaRealBiscoitos || 0),
        Math.round(((relativaRealBiscoitos * 100) / (relativaPrevistaBiscoitos)) || 0),
        true
    ));
    
    const relativaPrevista = ((somaMargemBiscoitosPrevista + somaMargemCandiesPrevista) / (somaFatLiqCandiesPrevisto + somaFatLiqBiscoitosPrevisto)) * 100;
    const relativaRealizada = ((somaMargemBiscoitosReal + somaMargemCandiesReal) / (somaFatLiqBiscoitosReal + somaFatLiqCandiesReal)) * 100;
    
    const margemPorcentagem = Math.round((somaMargemBiscoitosReal + somaMargemCandiesReal) / (somaMargemBiscoitosPrevista + somaMargemCandiesPrevista) * 100);
    const somaMargemReal = somaMargemBiscoitosReal + somaMargemCandiesReal;
    const somaMargemPrevista = somaMargemBiscoitosPrevista + somaMargemCandiesPrevista;
    
    $('#margem-acumulado').append(rowFactoryMargem(
        somaMargemPrevista, //.toLocaleString('pt-BR'),
        somaMargemReal, //.toLocaleString('pt-BR'),
        arredondarPorcentagem(somaMargemReal, somaMargemPrevista), //.toLocaleString('pt-BR'),
        Math.round(relativaPrevista), //.toLocaleString('pt-BR'),
        Math.round(relativaRealizada || 0), //.toLocaleString('pt-BR'),
        Math.round(((relativaRealizada * 100) / (relativaPrevista)) || 0), //.toLocaleString('pt-BR'),
        true
    ));
    
    

    //$('#margem-mes').text(`Margem  Contribuiçao - ${mapMes(anoMes.substr(4,2))}`)
    $('#card-margem-acumulado-real').text(somaMargemReal.toLocaleString('pt-BR'))
    $('#card-margem-acumulado-previsto').text(somaMargemPrevista.toLocaleString('pt-BR'))
    $('#card-margem-acumulado-pct').text(`${margemPorcentagem.toLocaleString('pt-BR')} %`)
      .parent().css('background-color', getCor(margemPorcentagem))
    
  })
}

function rowFactory(linha, real, previsto, porcentagem, total = false) {
  return `
  <tr>
    <td class="mdl-data-table__cell--non-numeric ${total ? 'bold' : ''}">${linha}</td>
    <td class="volume-real ${total ? 'bold' : ''}">${real.toLocaleString('pt-BR')}</td>
    <td class="volume-previsto ${total ? 'bold' : ''}">${previsto.toLocaleString('pt-BR')}</td>
    <td class="table-percent" style="background-color:${getCor(porcentagem)}; color:${'#000'}">${porcentagem.toLocaleString('pt-BR')} %</td>
  </tr>
  `
}

function rowFactoryMargem(absolutaReal, absolutaPrevista, porcentagemAbsoluta, relativaReal, relativaPrevista, porcentagemRelativa, total = false) {
  return `
  <tr>
    <td class="volume-real ${total ? 'bold' : ''}">${absolutaReal.toLocaleString('pt-BR')}</td>
    <td class="volume-previsto ${total ? 'bold' : ''}">${absolutaPrevista.toLocaleString('pt-BR')}</td>
    <td class="table-percent" style="background-color:${getCor(porcentagemAbsoluta)}; color: ${'#000'}">${porcentagemAbsoluta.toLocaleString('pt-BR')} %</td>
    <td class="volume-real ${total ? 'bold' : ''}">${relativaReal.toLocaleString('pt-BR')} %</td>
    <td class="volume-previsto ${total ? 'bold' : ''}">${relativaPrevista.toLocaleString('pt-BR')} %</td>
    <td class="table-percent" style="background-color:${getCor(porcentagemRelativa)}; color: ${'#000'}">${porcentagemRelativa.toLocaleString('pt-BR')} %</td>
    </tr>
  `
}

function getVolumeMes(anoMes, mercado) {
  const accessId = '&dataAccessId=volumeMes'
  const paramAnoMes = `&paramanomes=${anoMes}`
  const paramMercado = `&parammercado=${mercado}`
  const url = urlpadrao + accessId + paramAnoMes + paramMercado

  return new Promise(resolve => {
    $.getJSON(url, function (result) {
      resolve(result)
    });
  })
}

// volume acumulado
let volumeAcumulado = ''

function atualizaVolumeAcumulado(anoMes, mercado, anoMesInicial) {
  volumeAcumuladoCandies = '';
  volumeAcumuladoBiscoitos = '';
  
  getVolumeAcumuladoNovo(anoMes, mercado, anoMesInicial).then(value => {
    const volumes = value.resultset
    let somaReal = 0;
    let somaPrevisto = 0;
    let somaRealCandies = 0;
    let somaPrevistoCandies = 0;
    let somaRealBiscoitos = 0;
    let somaPrevistoBiscoitos = 0;

    volumes.forEach(resultado => {
       if (['BALA DURA', 'BALA MASTIGAVEL', 'BALA DURA FLOW PACK', 'DROPS DURO', 'DROPS MASTIGAVEL'].indexOf(resultado[0]) >= 0) {
          volumeAcumuladoCandies += rowFactory(
            resultado[0],
            resultado[6],
            resultado[5],
            Math.round(((resultado[5] * 100) / (resultado[6]))).toLocaleString('pt-BR')
          );
          
          somaPrevistoCandies += resultado[6]
          somaRealCandies += resultado[5]
      } else {
          volumeAcumuladoBiscoitos += rowFactory(
            resultado[0],
            resultado[6],
            resultado[5],
            Math.round(((resultado[5] * 100) / (resultado[6]))).toLocaleString('pt-BR')
          );
          somaPrevistoBiscoitos += resultado[6]
          somaRealBiscoitos += resultado[5]
      }

      somaPrevisto += resultado[6]
      somaReal += resultado[5]
    })

    $('#volume-acumulado').empty()
    $('#volume-acumulado').append(`
        <thead>
          <tr>
            <th class="mdl-data-table__cell--non-numeric volume-header-th">Linha</th>
            <th class="volume-header-th">Previsto (ton)</th>
            <th class="volume-header-th">Realizado (ton)</th>
            <th class="volume-header-th">Porcentagem (%)</th>
          </tr>
        </thead>
      `)
    $('#volume-acumulado').append(volumeAcumuladoCandies);
    $('#volume-acumulado').append(rowFactory(
      'CANDIES',
      somaPrevistoCandies.toLocaleString('pt-BR'),
      somaRealCandies.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaRealCandies, somaPrevistoCandies).toLocaleString('pt-BR'), true)
    );
    
    $('#volume-acumulado').append(volumeAcumuladoBiscoitos);
    $('#volume-acumulado').append(rowFactory(
      'BISCOITOS',
      somaPrevistoBiscoitos.toLocaleString('pt-BR'),
      somaRealBiscoitos.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaRealBiscoitos, somaPrevistoBiscoitos).toLocaleString('pt-BR'), true)
    );

    $('#volume-acumulado').append(rowFactory(
      'TOTAL',
      somaPrevisto.toLocaleString('pt-BR'),
      somaReal.toLocaleString('pt-BR'),
      arredondarPorcentagem(somaReal, somaPrevisto).toLocaleString('pt-BR'), true)
    );
  })
}
function getVolumeAcumulado(anoMes, mercado, anoMesInicial) {
  const accessId = '&dataAccessId=volumeAcumulado'
  const paramAnoMes = `&paramanomes=${anoMes}`
  const paramAnoMesInicial = `&paramanomes_inicial=${anoMesInicial}`
  const paramMercado = `&parammercado=${mercado}`
  const url = urlpadrao + accessId + paramAnoMesInicial + paramAnoMes + paramMercado

  return new Promise(resolve => {
    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

// margem e faturamento
let faturamentoMes = {}
let margemMes = {}

let faturamentoAcumulado = {}
let margemAcumulado = {}

function atualizaFaturamentoMargem(anoMes, mercado, anoMesInicial) {
  getFaturamentoMargemMes(anoMes, mercado).then(value => {
    var faturamentoMes = {};
    var margemMes = {};
    var volumeMes = {};

    value.resultset.forEach(resultado => {
      faturamentoMes = {
        previsto: resultado[0],
        real: resultado[1],
        porcentagem: resultado[2]
      };
      margemMes = {
        previsto: resultado[3],
        real: resultado[4],
        porcentagem: resultado[5]
      };
      volumeMes = {
        previsto: resultado[6],
        real: resultado[7],
        porcentagem: resultado[8]
      }
    })

    // atualiza cards Mes
    $('#card-faturamento-bruto-mes-real').text(faturamentoMes.real.toLocaleString('pt-BR'))
    $('#card-faturamento-bruto-mes-previsto').text(faturamentoMes.previsto.toLocaleString('pt-BR'))
    $('#card-faturamento-bruto-mes-pct').text(`${faturamentoMes.porcentagem} %`)
      .parent().css('background-color', getCor(faturamentoMes.porcentagem))
      
    $('#card-volume-mes-real').text(volumeMes.real.toLocaleString('pt-BR'))
    $('#card-volume-mes-previsto').text(volumeMes.previsto.toLocaleString('pt-BR'))
    $('#card-volume-mes-pct').text(`${volumeMes.porcentagem} %`)
      .parent().css('background-color', getCor(volumeMes.porcentagem))

    getFaturamentoMargemAcumulado(anoMes, mercado, anoMesInicial).then(value => {
      var faturamentoAcumulado = {}
      var margemAcumulado = {}
      var volumeAcumulado = {}

      value.resultset.forEach(resultado => {
        faturamentoAcumulado = {
          previsto: resultado[0],
          real: resultado[1],
          porcentagem: resultado[2]
        };
        margemAcumulado = {
          previsto: resultado[3],
          real: resultado[4],
          porcentagem: resultado[5]
        };
        volumeAcumulado = {
          previsto: resultado[6],
          real: resultado[7],
          porcentagem: resultado[8]
        };
      })

      $('#card-faturamento-bruto-acumulado-real').text(faturamentoAcumulado.real.toLocaleString('pt-BR'))
      $('#card-faturamento-bruto-acumulado-previsto').text(faturamentoAcumulado.previsto.toLocaleString('pt-BR'))
      $('#card-faturamento-bruto-acumulado-pct').text(`${faturamentoAcumulado.porcentagem} %`)
        .parent().css('background-color', getCor(faturamentoAcumulado.porcentagem))
        
      $('#card-volume-acumulado-real').text(volumeAcumulado.real.toLocaleString('pt-BR'))
      $('#card-volume-acumulado-previsto').text(volumeAcumulado.previsto.toLocaleString('pt-BR'))
      $('#card-volume-acumulado-pct').text(`${volumeAcumulado.porcentagem} %`)
        .parent().css('background-color', getCor(volumeAcumulado.porcentagem))


      const mesExtenso = mapMes(anoMes.substr(4, 2))

      const tituloFat = `Fat. Bruto - ${mesExtenso}`
      $('#titulo-fat-mes').text(tituloFat)
    })
  })
}

function getFaturamentoMargemMes(anoMes, mercado) {

  const anoAtual = anoMes.slice(0, 4);
  const mesAtual = anoMes.slice(4, 6);
  const paramAno = `&paramano=${anoAtual}`;
  const paramMes = `&parammes=${mesAtual}`;
  const paramMercado = `&parammercado=${mercado}`;
  const accessId = '&dataAccessId=faturamentoMargemMes'
  const url = urlpadrao + accessId + paramAno + paramMes + paramMercado;
  console.log(url);
  
  return new Promise(resolve => {
    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

function getFaturamentoMargemAcumulado(anoMes, mercado, anoMesInicial) {
  console.log(anoMesInicial)
  const anoInicial = anoMesInicial.slice(0, 4);
  const mesInicial = anoMesInicial.slice(4, 6);
  const anoAtual = anoMes.slice(0, 4);
  const mesAtual = anoMes.slice(4, 6);
  
  const paramAnoInicial = `&paramanoinicial=${anoInicial}`;
  const paramMesInicial = `&parammesinicial=${mesInicial}`;
  const paramAnoAtual = `&paramanoatual=${anoAtual}`;
  const paramMesAtual = `&parammesatual=${mesAtual}`;
  const paramMercado = `&parammercado=${mercado}`;
  const accessId = '&dataAccessId=faturamentoMargemAcumulado'
  const url = urlpadrao + accessId + paramAnoInicial + paramMesInicial + paramAnoAtual + paramMesAtual + paramMercado;

  return new Promise(resolve => {
    $.getJSON(url, function (result) {
      resolve(result)
    })
  })
}

let agrupamento = factoryAgrupamento();

function iniciarComponentes() {
  const anoMes = formatDate(Date.now(), '').substr(0, 6)
  const mercado = 'Mercado Interno'
  let anoMesInicial = ""
  if(Number(anoMes.slice(4, 6)) === 1){
    anoMesInicial = `${anoMes.slice(0, 4)}01`
  }else if(Number(anoMes.slice(4, 6)) <= 10){
    anoMesInicial = `${anoMes.slice(0, 4)}0${Number(anoMes.slice(4, 6)) - 1}`
  }else{
    anoMesInicial = `${anoMes.slice(0, 4)}${Number(anoMes.slice(4, 6)) - 1}`
  }
  montaSelectAnoMes(anoMes)
  montaSelectMercados()
  agrupamento = factoryAgrupamento();
  atualizarComponentes(anoMes, mercado, anoMesInicial)
}



iniciarComponentes()



function atualizarComponentes(anoMes, mercado, anoMesInicial) {
  agrupamento = factoryAgrupamento();
  atualizaFaturamentoMargem(anoMes, mercado, anoMesInicial)
  atualizaVolumeAcumulado(anoMes, mercado, anoMesInicial)
  atualizaVolumeMes(anoMes, mercado)
  atualizaMargemMes(anoMes, mercado)
  atualizaMargemAcumulado(anoMes, mercado, anoMesInicial)
}

function mapMes(mes) {
  const meses = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro',
  }

  return meses[mes]
}


function montaLegenda() {
  $('#circulo-preto').css('background', getCor(79.99))
  $('#circulo-vermelho').css('background', getCor(89.99))
  $('#circulo-amarelo').css('background', getCor(99.99))
  $('#circulo-verde').css('background', getCor(100))
}

montaLegenda() 