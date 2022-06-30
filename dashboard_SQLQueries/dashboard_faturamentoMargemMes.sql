SELECT
COALESCE(round(sum(fat_bruto_previsto)/1000,0), 0) faturado_previsto,
COALESCE(round(sum(fat_bruto)/1000,0), 0) as faturado_realizado,
COALESCE(round(sum(fat_bruto) / sum(fat_bruto_previsto) * 100, 0), 0) porcentagem_faturado,
COALESCE(round(sum(margem_contribuicao_previsto)/1000,0), 0) margem_contribuicao_previsto,
COALESCE(round(sum(margem_contribuicao)/1000,0), 0) as margem_contribuicao_realizado,
COALESCE(round(sum(margem_contribuicao) / sum(margem_contribuicao_previsto) * 100, 0), 0) porcentagem_margem,
COALESCE(round(sum(VOLUME_PREVISTO)/1000,0), 0) as volume_previsto,
COALESCE(round(sum(VOLUME)/1000,0), 0) as volume_realizado,
COALESCE(round(sum(VOLUME) / sum(VOLUME_PREVISTO) * 100, 0), 0) porcentagem_volume
FROM DASH_PEDIDOS
where ano = CAST(${ano} as integer)
and mes = CAST(${mes} as integer)
and mercado LIKE ${mercado}