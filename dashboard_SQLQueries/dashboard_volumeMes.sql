select
coalesce(round(sum(VOLUME_VERDE)/1000,0),0) volume_previsto,
coalesce(round(sum(VOLUME)/1000,0),0) as volume_realizado,
coalesce(round(sum(volume) / sum(volume_verde) * 100, 0),0) porcentagem,
linhas
from FCT_PREVISTO_BANDEIRAS
 where anomes = ${anomes}
    and mercado like ${mercado}
group by LINHAS
order by LINHAS