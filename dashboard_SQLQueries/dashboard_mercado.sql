select distinct mercado 
from dim_regiaocomercial 
    join fct_venda on dim_regiaocomercial.idregiaocomercial = fct_venda.idregiaocomercial
