import { getConnection } from './database.js';

export interface FaturamentoDia {
  total_dia: number;
  meta_dia: number;
}

export interface FaturamentoMes {
  fat_total: number;
  meta_mes: number;
  meta_acumulada_mes: number;
}

export async function getFaturamentoDia(): Promise<FaturamentoDia> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT CASE WHEN SUM(E1_VALOR) IS NULL THEN 0 ELSE SUM(E1_VALOR) END AS TOTAL_DIA
        ,(SELECT ZV_FATDIA FROM SZV010 WHERE D_E_L_E_T_ = '' AND ZV_DIA = cast(CURRENT_TIMESTAMP as date)) AS META_DIA
        FROM SE1010 WHERE D_E_L_E_T_ = ''
        AND E1_TIPO = 'NF'
        AND E1_STATUS = 'A'
        AND E1_EMISSAO = cast(CURRENT_TIMESTAMP as date)
    `);

    const data = result.recordset[0];
    return {
      total_dia: data.TOTAL_DIA || 0,
      meta_dia: data.META_DIA || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar faturamento do dia:', error);
    throw error;
  }
}

export async function getFaturamentoMes(): Promise<FaturamentoMes> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT	CASE WHEN SUM(SD2.D2_TOTAL) IS NULL THEN 0 ELSE SUM(SD2.D2_TOTAL) END AS FAT_TOTAL
      ,(SELECT SUM(ZV_FATDIA) FROM SZV010 WHERE D_E_L_E_T_ = '' AND SUBSTRING(ZV_DIA,1,6) = SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)) AS META_MES
      ,(SELECT SUM(ZV_FATDIA) FROM SZV010 WHERE D_E_L_E_T_ = '' AND SUBSTRING(ZV_DIA,1,8) <= SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,8) AND SUBSTRING(ZV_DIA,1,6) = SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)) AS META_ACUMULADA_MES
      FROM SD2010 SD2 INNER JOIN SA1010 SA1 ON SA1.A1_COD = SD2.D2_CLIENTE AND SA1.A1_LOJA = SD2.D2_LOJA  AND SA1.D_E_L_E_T_ = '' 
      LEFT OUTER JOIN SE1010 SE1 ON SE1.E1_NUM = SD2.D2_DOC AND SE1.E1_PREFIXO = SD2.D2_SERIE AND SE1.E1_FILIAL = SD2.D2_FILIAL AND SE1.D_E_L_E_T_ = '' AND SE1.E1_TIPO = 'NF' 
      WHERE SD2.D_E_L_E_T_ = '' 
      AND SD2.D2_NFORI = '' 
      AND SD2.D2_TIPO = 'N' 
      AND SD2.D2_CF IN ('5124','5101') 
      AND SUBSTRING(SD2.D2_EMISSAO,1,6) = SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)
      AND SD2.D2_CLIENTE >= '      '
      AND SD2.D2_LOJA     >= '  ' 
      AND SD2.D2_CLIENTE <= 'ZZZZZZ' 
      AND SD2.D2_LOJA <= 'ZZ'
      AND RTRIM(SD2.D2_DOC+SD2.D2_SERIE) NOT IN (SELECT RTRIM(SD1.D1_NFORI+SD1.D1_SERIORI) FROM SD1010 SD1 WHERE SD1.D1_NFORI = SD2.D2_DOC AND SD1.D1_SERIORI = SD2.D2_SERIE AND SD1.D_E_L_E_T_ = '' AND SD1.D1_TIPO = 'D') 
    `);

    const data = result.recordset[0];
    return {
      fat_total: data.FAT_TOTAL || 0,
      meta_mes: data.META_MES || 0,
      meta_acumulada_mes: data.META_ACUMULADA_MES || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar faturamento do mês:', error);
    throw error;
  }
}

export interface EnvioTratadorDia {
  total_trat_dia: number;
  meta_dia: number;
}

export interface EnvioTratadorMes {
  fat_total: number;
  meta_mes: number;
  meta_acumulada_mes: number;
}

export async function getEnvioTratadorDia(): Promise<EnvioTratadorDia> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
    SELECT /*TOTAL_DIA_MET,COALESCE(TOTAL_DIA_MAG,0) TOTAL_DIA_MAG
    ,TOTAL_DIA_MET,COALESCE(TOTAL_DIA_LIB,0) TOTAL_DIA_LIB
    ,*/TOTAL_DIA_MET+COALESCE(TOTAL_DIA_MAG,0)+COALESCE(TOTAL_DIA_LIB,0) TOTAL_TRAT_DIA
    ,META_DIA

    FROM

    (SELECT CASE WHEN SUM(C6_VALOR) IS NULL THEN 0 ELSE SUM(C6_VALOR) END AS TOTAL_DIA_MET
      
      ,(SELECT SUM(C6_VALOR) FROM SC6010 WHERE R_E_C_D_E_L_ = 0
        AND C6_CLI = '000074' 
        AND NOT C6_TES = '508' 
        AND NOT C6_ZZTRAT = 'TS-MAG-F' 
        AND C6_DATFAT = CONVERT(CHAR(8),CURRENT_TIMESTAMP,112)) TOTAL_DIA_MAG
      
      ,(SELECT SUM(C6_VALOR) FROM SC6010 WHERE R_E_C_D_E_L_ = 0
        AND C6_CLI = '000076' 
        AND NOT C6_TES = '508' 
        AND NOT C6_ZZTRAT = 'TS-LBR-F' 
        AND C6_DATFAT = CONVERT(CHAR(8),CURRENT_TIMESTAMP,112)) TOTAL_DIA_LIB
      
        ,(SELECT ZV_FATTRAT FROM SZV010 WHERE D_E_L_E_T_ = '' AND ZV_DIA = CONVERT(CHAR(8),CURRENT_TIMESTAMP,112)) META_DIA
      
    FROM SC6010 WHERE R_E_C_D_E_L_ = 0
    AND C6_CLI = '000071'
    AND NOT C6_TES = '508'
    AND NOT C6_ZZTRAT = 'TS-MET-F'
    AND C6_DATFAT = CONVERT(CHAR(8),CURRENT_TIMESTAMP,112)
    )TAB
    `);

    const data = result.recordset[0];
    return {
      total_trat_dia: data.TOTAL_TRAT_DIA || 0,
      meta_dia: data.META_DIA || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar envio tratador do dia:', error);
    throw error;
  }
}

export async function getEnvioTratadorMes(): Promise<EnvioTratadorMes> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT CASE WHEN SUM(C6_VALOR) IS NULL THEN 0 ELSE SUM(C6_VALOR) END AS TOTAL_MES_TRAT

      ,(SELECT SUM(ZV_FATTRAT) FROM SZV010 WHERE D_E_L_E_T_ = '' AND SUBSTRING(ZV_DIA,1,6) = SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)) AS META_MES_TRAT

      ,(SELECT SUM(ZV_FATTRAT) FROM SZV010 WHERE D_E_L_E_T_ = '' AND SUBSTRING(ZV_DIA,1,8) <= SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,8) AND SUBSTRING(ZV_DIA,1,6) = SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)) AS META_ACUMULADA_MES

      FROM SC6010 WHERE D_E_L_E_T_ = ''

      AND C6_CLI IN ('000071','000074','000076')
      AND NOT C6_TES = '508'
      AND NOT C6_ZZTRAT IN ('TS-MET-F','TS-MAG-F','TS-LBR-F')
      AND SUBSTRING(C6_DATFAT,1,6) = 
        SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)
    `);

    const data = result.recordset[0];
    return {
      fat_total: data.TOTAL_MES_TRAT || 0,
      meta_mes: data.META_MES_TRAT || 0,
      meta_acumulada_mes: data.META_ACUMULADA_MES || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar envio tratador do mês:', error);
    throw error;
  }
}

export interface RecebimentoHistorico {
  [vencimento: string]: number;
}

export async function getRecebimentoAtual(): Promise<RecebimentoHistorico> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        SUBSTRING(SE1.E1_VENCTO, 5, 2)+'/'+SUBSTRING(SE1.E1_VENCTO, 1, 4) AS VENCIMENTO
        ,(SELECT SUM(SE1.E1_VALOR)) AS VALOR_MES
      FROM SE1010 SE1
      WHERE SE1.D_E_L_E_T_ = ''
      AND SE1.E1_TIPO = 'NF'
      AND SE1.E1_STATUS = 'A'
      AND SUBSTRING(SE1.E1_EMISSAO,1,6) = 
        SUBSTRING(CONVERT(varchar, GETDATE(), 112),1,6)
      GROUP BY SUBSTRING(SE1.E1_VENCTO, 5, 2)+'/'+SUBSTRING(SE1.E1_VENCTO, 1, 4)
    `);

    const historico: RecebimentoHistorico = {};
    result.recordset.forEach((row: any) => {
      historico[row.VENCIMENTO] = row.VALOR_MES || 0;
    });
    return historico;
  } catch (error) {
    console.error('Erro ao buscar recebimento atual:', error);
    throw error;
  }
}

export async function getRecebimentoAcumulado(): Promise<RecebimentoHistorico> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        SUBSTRING(SE1.E1_VENCTO, 5, 2)+'/'+SUBSTRING(SE1.E1_VENCTO, 1, 4) AS VENCIMENTO
        ,(SELECT SUM(SE1.E1_VALOR)) AS VALOR_ACUMULADO
      FROM SE1010 SE1
      WHERE SE1.D_E_L_E_T_ = ''
      AND SE1.E1_TIPO = 'NF'
      AND SE1.E1_EMISSAO >= '20220101'
      GROUP BY SUBSTRING(SE1.E1_VENCTO, 5, 2)+'/'+SUBSTRING(SE1.E1_VENCTO, 1, 4)
    `);

    const historico: RecebimentoHistorico = {};
    result.recordset.forEach((row: any) => {
      historico[row.VENCIMENTO] = row.VALOR_ACUMULADO || 0;
    });
    return historico;
  } catch (error) {
    console.error('Erro ao buscar recebimento acumulado:', error);
    throw error;
  }
}
