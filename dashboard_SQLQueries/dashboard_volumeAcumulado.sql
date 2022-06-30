select
round(sum(VOLUME_VERDE)/1000,0) volume_previsto,
round(sum(VOLUME)/1000,0) as volume_realizado,
round(sum(volume) / sum(volume_verde) * 100, 0) porcentagem,
linhas
from FCT_PREVISTO_BANDEIRAS
 where anomes between ${anomes_inicial} and ${anomes}
    and mercado like ${mercado}
group by LINHAS
order by LINHAS