SELECT
familia_comercial,
ROUND(sum(COALESCE (fat_bruto, 0)) / 1000) faturamento_bruto_real,
ROUND(sum(COALESCE (fat_bruto_previsto, 0)) / 1000) faturamento_bruto_previsto,
ROUND(sum(COALESCE (fat_liquido, 0)) / 1000) faturamento_liquido_real,
ROUND(sum(COALESCE (fat_liquido_previsto, 0)) / 1000) faturamento_liquido_previsto,
ROUND(sum(COALESCE (volume, 0)) / 1000) volume_realizado,
ROUND(sum(COALESCE (volume_previsto, 0)) / 1000) volume_previsto,
ROUND(sum(COALESCE (margem_contribuicao, 0)) / 1000) margem_contribuicao_real,
ROUND(sum(COALESCE (margem_contribuicao_previsto, 0)) / 1000) margem_contribuicao_previsto
FROM DASH_PEDIDOS
where ano = CAST(${ano} as integer)
and mes = CAST(${mes} as integer)
and mercado LIKE ${mercado}
group by
familia_comercial
ORDER BY 
familia_comercial
